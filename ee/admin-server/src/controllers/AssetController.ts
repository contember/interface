import { BaseController } from './BaseController'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { TenantClient } from '../services/TenantClient'
import type { S3Manager } from '../services/S3Manager'
import { Readable } from 'node:stream'
import type { GetObjectCommandOutput } from '@aws-sdk/client-s3'
import { readReadable } from '../utils/readReadable'
import { URL } from 'node:url'
import { StaticFileHandler } from '../services/StaticFileHandler'
import { ConfigResolver } from '../services/ConfigResolver'
import { readAuthCookie } from '../utils/cookies'

const CONTEMBER_CONFIG_PLACEHOLDER = '{configuration}'

interface ProjectParams {
	project: string | undefined
	projectGroup: string | undefined
	path: string
}

export class AssetController extends BaseController<ProjectParams> {

	constructor(
		private s3: S3Manager,
		private tenant: TenantClient,
		private configResolver: ConfigResolver,
		private staticFileHandler: StaticFileHandler,
	) {
		super()
	}

	async handle(req: IncomingMessage, res: ServerResponse, params: ProjectParams): Promise<void> {
		const url = new URL(req.url ?? '/', `http://${req.headers.host}`)

		const pathParts = url.pathname
			.substring(1)
			.split('/')
			.filter(p => p !== '') // remove empty string after last optional slash (http://example.com/ -> http://example.com)

		const path = pathParts.join('/')
		const pathFile = path.includes('.')
			? path : `${path === '' ? '' : path + '/'}index.html` // if we are referencing folder add index.html

		// check and possibly switch handler to legacy mode (client does not have custom deployments with entrypoint)
		// for these projects we are checking access permissions
		if (!await this.tryCheckAdvancedStructure(params.projectGroup)) {
			// index and static assets should not be authorized because you need login page available for users without auth
			const specialStaticAssets = [
				'',
				'_static',
				'favicon.ico',
				'robots.txt',
			]

			// verify access permissions for projects (exclude special paths with assets)
			if (params.project !== undefined && !specialStaticAssets.includes(params.project)) {
				const token = readAuthCookie(req)

				if (token === null || !(await this.tenant.hasProjectAccess(token, params.project, params.projectGroup))) {
					const params = new URLSearchParams({ backlink: req.url! })

					res.setHeader('Location', '/?' + params.toString())
					res.writeHead(302)
					res.end()

					return
				}
			}
		}

		try {
			// check if we have assets stored in s3 bucket
			// this can be caused by custom project group deployments or simply deployed admin via our bucket
			const s3AssetFound = await this.handleAssetsFromS3(req, res, pathFile, params)

			if (!s3AssetFound) {
				// fallback that serves content from local build of application (default assets)
				await this.handleAssetsFromFileSystem(req, res, params)
			}
		} catch (e) {
			res.writeHead(500)
			res.end('Internal server error.')
		}
	}


	private async handleAssetsFromS3(req: IncomingMessage, res: ServerResponse, path: string, params: ProjectParams): Promise<boolean> {
		try {
			const targetFile = await this.tryFiles(undefined, params.projectGroup, path)

			if (targetFile.Body instanceof Readable) {
				res.setHeader('Content-Type', targetFile.ContentType ?? 'application/octet-stream')

				// for index files we need to run preprocessing and replace relative path with absolute one
				// because some project expect to run on domain root but now can run in subfolder
				if (path.endsWith('.html')) {
					const sourceHtml = await readReadable(targetFile.Body)

					// calculate base path without html file on the end
					const targetPathParts = path.split('/')

					const targetPath = targetPathParts.length === 1
						? '/'
						: targetPathParts.slice(0, targetPathParts.length - 1).join('/') + '/'

					res.end(
						this.preprocessHtmlIndexFiles(sourceHtml, targetPath),
					)
				} else {
					// simply steam-line file directly to response without any additional changes
					targetFile.Body.pipe(res)
				}

				return true
			}

			res.writeHead(500)
			res.end('Internal issue with file serving')

			return true
		} catch (e) {
			// check if we should try another s3 search but with directory closer to root
			// this is done mainly because PAW apps that supports pretty urls but contains only single index.html file in root

			// fallback is activated only when request it not in root directory -> "index.html" is ignored but "xyz/index.html" will try "index.html"
			const fallbackNeeded = path.endsWith('/index.html')
			const fallbackPath = path
				.split('/')
				.slice(0, -2)
				.join('/')
				.substring(0)

			const fallbackFilePath = fallbackPath === ''
				? 'index.html' : `${fallbackPath}/index.html`

			if (fallbackNeeded && fallbackFilePath !== path) {
				return await this.handleAssetsFromS3(req, res, fallbackFilePath, params)
			}

			return false
		}
	}


	private async handleAssetsFromFileSystem(req: IncomingMessage, res: ServerResponse, params: ProjectParams){
		const filedProcessor = async (path: string, content: Buffer, req: IncomingMessage) => {
			// specially for our auth entrypoint page we need to propagate custom configuration into served HTML file
			if (path === 'index.html') {
				const customConfig = await this.configResolver.getConfig(params.projectGroup)
				const customConfigJson = JSON.stringify(customConfig.login ?? {})

				return content
					.toString('utf8')
					.replace(CONTEMBER_CONFIG_PLACEHOLDER, customConfigJson)
			}

			return content
		}

		// handles serving from file system, if file is not found automatically returns 404 header
		await this.staticFileHandler.serve(req, res, { fileProcessor: filedProcessor })
	}


	private async tryFiles(project: string | undefined, projectGroup: string | undefined, path: string): Promise<GetObjectCommandOutput> {
		return await this.s3.getObject({ project, projectGroup, path })
	}


	/** goes through html file and replaces relative "./" imports (css, js...) with proper base path */
	private preprocessHtmlIndexFiles(htmlContent: string, basePath: string): string {
		return htmlContent.replaceAll(
			/(src|href)="\.\//g, ((substring, attrName) =>  `${attrName}="${basePath}`),
		)
	}


	/**
	 * checks if current request handles standard project-only deployment
	 * or its advanced structure with project-group wide deploy
	 */
	private async tryCheckAdvancedStructure(projectGroup: string | undefined): Promise<boolean> {
		// todo: lets find out better way to diagnose advanced structure,
		// 	this check can be expensive in case of checkin for every file served.

		try {
			// checks if there is "index.html" file in project group root
			await this.s3.getObject(
				{ projectGroup: projectGroup, project: undefined, path: 'index.html' },
			)

			return true
		} catch (e) {
			return false
		}
	}
}
