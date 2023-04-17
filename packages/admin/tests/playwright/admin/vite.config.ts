import react from '@vitejs/plugin-react'
import { Readable } from 'stream'
import { defineConfig } from 'vite'
import { initContemberProjectDev } from '../utils'

const packagesDir = __dirname + '/../../../..'

export default defineConfig({
	root: 'tests/playwright/admin',
	build: {
		minify: false,
		rollupOptions: {
			input: 'tests/playwright/admin/index.html',
			output: { dir: 'tests/playwright/admin/dist' },
			treeshake: { moduleSideEffects: true },
		},
	},
	css: {
		preprocessorOptions: {
			sass: {
				charset: false,
			},
		},
	},
	resolve: {
		alias: [
			{ find: '@contember/admin', replacement: `${packagesDir}/admin/src` },
			{ find: '@contember/admin-i18n', replacement: `${packagesDir}/admin-i18n/src` },
			{ find: '@contember/admin-sandbox', replacement: `${packagesDir}/admin-sandbox/src` },
			{ find: '@contember/binding', replacement: `${packagesDir}/binding/src` },
			{ find: '@contember/client', replacement: `${packagesDir}/client/src` },
			{ find: '@contember/react-client', replacement: `${packagesDir}/react-client/src` },
			{ find: '@contember/react-multipass-rendering', replacement: `${packagesDir}/react-multipass-rendering/src` },
			{ find: '@contember/react-utils', replacement: `${packagesDir}/react-utils/src` },
			{ find: '@contember/ui', replacement: `${packagesDir}/ui/src` },
			{ find: '@contember/vimeo-file-uploader', replacement: `${packagesDir}/vimeo-file-uploader/src` },
		],
	},
	preview: {
		port: 3333,
		host: '0.0.0.0',
	},
	server: {
		port: 3007,
		host: '0.0.0.0',
	},
	plugins: [react(), {
		name: 'initContemberProject',
		configureServer(server) {
			async function toJson(stream: Readable) {
				const chunks = []
				for await (const chunk of stream) chunks.push(chunk)
				return JSON.parse(Buffer.concat(chunks).toString())
			}

			server.middlewares.use('/_init', async (req, res) => {
				const projectSlug = await initContemberProjectDev(await toJson(req))
				res.setHeader('Content-Type', 'application/json')
				res.end(JSON.stringify({ projectSlug }))
			})
		},
	}],
})
