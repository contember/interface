import { useProjectSlug } from '@contember/react-client'
import { Schema } from '@contember/schema'
import { InputValidation, PermissionsBuilder, SchemaDefinition } from '@contember/schema-definition'
import { CSSProperties, ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
	ApplicationEntrypoint,
	Link,
	MiscPageLayout,
	PageModule,
	Pages,
	SpinnerContainer,
	runReactApp,
	useCurrentRequest,
} from '../../../src'
import './index.css'
import { emptySchema } from '@contember/schema-utils'

const projectSlug = window.location.pathname.split('/')[1]
const pages = import.meta.glob<PageModule>('../cases/**/*.tsx')
const models = import.meta.glob<PageModule>('../cases/**/*.model.ts')

function buildSchema(definitions: SchemaDefinition.ModelDefinition<{}>): Schema {
	const model = SchemaDefinition.createModel(definitions)
	const permissions = PermissionsBuilder.create(model).allowAll().allowCustomPrimary().permissions

	const acl = {
		roles: {
			admin: {
				variables: {},
				stages: '*' as const,
				entities: permissions,
			},
		},
	}

	const validation = InputValidation.parseDefinition(definitions)
	return { ...emptySchema, acl, model, validation }
}

const SetProjectSlugContext = createContext<(slug: string | undefined) => void>(() => {
	throw new Error()
})

const ProjectSlugProvider = ({ children }: { children: (projectSlug?: string) => ReactNode }) => {
	const [projectSlug, setProjectSlug] = useState<string | undefined>(undefined)
	return (
		<SetProjectSlugContext.Provider value={setProjectSlug}>
			{children(projectSlug)}
		</SetProjectSlugContext.Provider>
	)
}

const ProjectInitializingLayout = ({ children }: { children?: ReactNode }) => {
	const request = useCurrentRequest()
	const projectSlug = useProjectSlug()
	const setProjectSlug = useContext(SetProjectSlugContext)
	const pageName = request?.pageName

	useEffect(
		() => {
			setProjectSlug(undefined)

			if (pageName === undefined) {
				return
			}

			(async () => {
				const modelPath = `../cases/${pageName}.model.ts`
				const model = models[modelPath] ? await models[modelPath]() : {}

				const initResponse = await fetch('/_init', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(buildSchema(model)),
				})

				const { projectSlug } = await initResponse.json()
				setProjectSlug(projectSlug)
			})()
		},
		[pageName, setProjectSlug],
	)

	return (
		<SpinnerContainer enabled={projectSlug === undefined}>
			{children}
		</SpinnerContainer>
	)
}

const IndexPage = () => {
	const pageNames = Object.keys(pages).map(it => it.slice(9, -4))

	return (
		<MiscPageLayout>
			<ul>
				{pageNames.map(it => (
					<li key={it}>
						<Link to={it}>{it.replace(/([A-Z])/g, ' $1').toLowerCase()}</Link>
					</li>
				))}
			</ul>
		</MiscPageLayout>
	)
}

if (import.meta.env.DEV) {
	runReactApp(
		<div data-localhost>
			<ProjectSlugProvider>
				{slug => (
					<ApplicationEntrypoint
						apiBaseUrl={import.meta.env.VITE_CONTEMBER_ADMIN_API_BASE_URL as string}
						sessionToken={import.meta.env.VITE_CONTEMBER_ADMIN_SESSION_TOKEN as string}
						stage={'live'}
						project={slug}
						basePath={'/'}
						children={<Pages layout={ProjectInitializingLayout} children={{ index: IndexPage, ...pages }} />}
					/>
				)}
			</ProjectSlugProvider>
		</div>,
		null,
		(dom, react, onRecoverableError) => createRoot(dom, { onRecoverableError }).render(react),
	)

} else {
	runReactApp(
		<ApplicationEntrypoint
			apiBaseUrl={import.meta.env.VITE_CONTEMBER_ADMIN_API_BASE_URL as string}
			sessionToken={import.meta.env.VITE_CONTEMBER_ADMIN_SESSION_TOKEN as string}
			project={projectSlug}
			stage={'live'}
			basePath={'/' + projectSlug + '/'}
			children={<Pages children={pages} />}
		/>,
		null,
		(dom, react, onRecoverableError) => createRoot(dom, { onRecoverableError }).render(react),
	)
}
