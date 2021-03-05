import * as fs from 'fs'
import Koa from 'koa'
import koaStatic from 'koa-static'
import { Server as HttpServer } from 'net'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)

export interface Configuration {
	port: number
	indexFile: string
	apiBaseUrl: string
	loginToken: string
	configPlaceholder: string
	envVariables: Record<string, string>
}

export default class Server {
	async run({
		indexFile,
		apiBaseUrl,
		loginToken,
		configPlaceholder,
		port,
		envVariables,
	}: Configuration): Promise<HttpServer> {
		let file: string
		const koa = new Koa()
		koa.use(koaStatic(process.cwd() + '/public', { index: false }))
		koa.use(async (ctx, next) => {
			if (ctx.accepts('html')) {
				if (!file) {
					file = await readFile(indexFile, { encoding: 'utf8' })
				}
				ctx.body = file.replace(configPlaceholder, JSON.stringify({ apiBaseUrl, loginToken, envVariables }))
			} else {
				await next()
			}
		})
		return koa.listen(port, () => {
			console.log(`Listening on http://localhost:${port}`)
		})
	}
}
