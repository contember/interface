import type { IncomingMessage, ServerResponse } from 'node:http'
import { array, nullable, object, ParseError, string } from '../utils/schema'
import { BaseController } from './BaseController'
import type { TenantClient } from '../services/TenantClient'
import type { S3Manager } from '../services/S3Manager'
import { ForbiddenError, SystemClient } from '../services/SystemClient'

type DeployPayloadType = ReturnType<typeof DeployPayloadType>

const DeployPayloadType = object({
	project: nullable(string),
	files: array(
		object({
			path: string,
			data: string,
		}),
	),
})

const SIMPLE_PATH = /^[\w-]+(?:\.[\w-]+)*(?:\/[\w-]+(?:\.[\w-]+)*)*$/

interface DeployParams {
	projectGroup: string | undefined
}

export class DeployController extends BaseController<DeployParams> {

	constructor(
		private readonly tenant: TenantClient,
		private readonly systemClient: SystemClient,
		private readonly s3: S3Manager,
	) {
		super()
	}


	async handle(req: IncomingMessage, res: ServerResponse, params: DeployParams): Promise<void> {
		let payload: DeployPayloadType

		try {
			payload = await this.readJsonBody(req, DeployPayloadType)
		} catch (e) {
			if (e instanceof SyntaxError || e instanceof ParseError) {
				res.writeHead(400)
				res.end(`Requested with invalid JSON <${e.message}>.`)
				return
			} else {
				throw e
			}
		}

		const token = this.readBearerToken(req)

		if (token === null) {
			res.writeHead(400)
			res.end('Missing bearer token')
			return
		}

		// we are supporting two different ways of deploy (project-wide and project-group-wide deployments)
		if (payload.project === null) {
			if (!(await this.tenant.canDeployEntrypoint(token, params.projectGroup))) {
				res.writeHead(403)
				res.end(`Provided token is not authorized to deploy entrypoint for project group <${params.projectGroup}>`)
				return
			}
		} else {
			try {
				// hacky way
				// try to run empty project migrations, if you don't have permission then you are not allowed deploy project
				await this.systemClient.migrate(
					{
						token: token,
						project: payload.project,
						projectGroup: params.projectGroup,
						migrations: [],
					},
				)
			} catch (e) {
				if (e instanceof ForbiddenError) {
					res.writeHead(403)
					res.end(`provided token is not authorized to deploy project ${payload.project}`)
					return
				}

				throw e
			}
		}

		await this.handleDeployment(payload, res, params.projectGroup)
	}


	/** checks files consistency and deploy them to project or project-group storage based on request type */
	private async handleDeployment(payload: DeployPayloadType, res: ServerResponse, projectGroup: string | undefined) {
		const filesWithDangerousPath = payload.files.filter(
			file => !SIMPLE_PATH.test(file.path),
		)

		if (filesWithDangerousPath.length > 0) {
			res.writeHead(400)
			res.end('Invalid file path:\n' + filesWithDangerousPath
				.map(it => it.path)
				.join('\n'),
			)
			return
		}

		// first of all deploy static assets, index.html should be last uploaded page to remove any
		// change of not-ready page in process of deployment
		const batches = [
			payload.files.filter(it => it.path !== 'index.html'),
			payload.files.filter(it => it.path === 'index.html'),
		]

		for (const batch of batches) {
			await Promise.all(
				batch.map(async file => {
					await this.s3.putObject({
						project: payload.project ?? undefined,
						projectGroup: projectGroup,
						path: file.path,
						body: Buffer.from(file.data, 'base64'),
					})
				}),
			)
		}

		res.writeHead(200)
		res.end()
	}
}
