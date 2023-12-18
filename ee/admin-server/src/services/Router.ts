import { IncomingMessage, ServerResponse } from 'node:http'
import { URL } from 'node:url'
import { readHostFromHeader } from '../utils/readHostFromHeader'
import { BadRequestError } from '../BadRequestError'
import { ProjectGroupResolver } from './ProjectGroupResolver'
import { DeployController } from '../controllers/DeployController'
import { MeController } from '../controllers/MeController'
import { ApiController } from '../controllers/ApiController'
import { LegacyController } from '../controllers/LegacyController'
import { PanelController } from '../controllers/PanelController'
import { AssetController } from '../controllers/AssetController'

export class Router {

	constructor(
		private readonly projectGroupResolver: ProjectGroupResolver,
		private readonly deployController: DeployController,
		private readonly meController: MeController,
		private readonly apiController: ApiController,
		private readonly legacyController: LegacyController,
		private readonly panelController: PanelController,
		private readonly assetController: AssetController,
	) {}

	async handle(req: IncomingMessage, res: ServerResponse) {
		try {
			const url = new URL(req.url ?? '/', `http://${req.headers.host}`)
			const [prefix, ...rest] = url.pathname.substring(1).split('/')
			const hostname = readHostFromHeader(req)
			const projectGroup = this.projectGroupResolver.resolve(hostname)

			switch (prefix) {
				case '_api':
					return await this.apiController.handle(req, res, { path: rest.join('/'), projectGroup })

				case '_deploy':
					return await this.deployController.handle(req, res, { projectGroup })

				case '_me':
					return await this.meController.handle(req, res, { projectGroup })

				case '_panel':
					return await this.panelController.handle(req, res)

				case 'p':
				case 'projects':
					return await this.legacyController.handle(req, res)

				default:
					return await this.assetController.handle(
						req, res, { project: prefix, projectGroup: projectGroup, path: rest.join('/') },
					)
			}
		} catch (e) {
			console.error(e)

			if (e instanceof BadRequestError) {
				res.writeHead(e.code).end(e.message)

			} else if (!res.headersSent) {
				res.writeHead(500).end('Server error')

			} else {
				res.end()
			}
		}
	}
}
