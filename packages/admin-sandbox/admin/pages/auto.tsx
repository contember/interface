import {
	AutoForm,
	AutoGrid,
	DataBindingProvider,
	EntityId,
	FeedbackRenderer,
	Link,
	LinkButton,
	NavigateBackLink,
	PersistButton,
	RoutingParameter,
	useCurrentRequest,
	useEnvironment,
	LinkComponent,
	useOnPersistSuccess,
} from '@contember/admin'
import { Directive } from '../components/Directives'
import { SlotSources } from '../components/Slots'

const AutoGridList = () => {
	const env = useEnvironment()
	const schema = env.getSchema()
	const entities = schema.getEntityNames().sort()

	return (
		<>
			{entities.map(entity => (
				<Link key={entity} to={{ pageName: 'auto/grid', parameters: { entity } }}>{entity}</Link>
			))}
		</>
	)
}

export default (
	<>
		<SlotSources.Title>Auto Admin</SlotSources.Title>

		<DataBindingProvider stateComponent={FeedbackRenderer}>
			<AutoGridList />
		</DataBindingProvider>
	</>
)

const AutoLink: LinkComponent = ({ action, Component, children, entityId, entityName }) => (
	<Link
		to={`${action === 'edit' ? 'auto/form' : 'auto/grid'}(entity: $entityName, id: $entityId)`}
		parameters={{ entityId, entityName }} Component={Component}>
		{children}
	</Link>
)


export function Grid() {
	const request = useCurrentRequest()!
	const entity = request.parameters.entity as string
	const filter = request.parameters.id ? `[id = '${request.parameters.id}']` : ''

	const actions = (
		<>
			<LinkButton to={{ pageName: 'auto/form', parameters: { entity } }}>Create</LinkButton>
			<PersistButton />
		</>
	)

	return (
		<>
			<Directive name="content-max-width" content={null} />
			<DataBindingProvider stateComponent={FeedbackRenderer}>
				<SlotSources.Back>
					<NavigateBackLink to={{ pageName: 'auto' }}>Back to Auto</NavigateBackLink>
				</SlotSources.Back>

				<SlotSources.Title>{`List ${entity}`}</SlotSources.Title>
				<SlotSources.Actions>{actions}</SlotSources.Actions>

				<AutoGrid entities={entity + filter} LinkComponent={AutoLink} />
			</DataBindingProvider>
		</>
	)
}

export function Form() {
	const request = useCurrentRequest()!
	const entity = request.parameters.entity as string
	const id = request.parameters.id as EntityId | undefined
	const title = id ? `Edit ${entity}` : `Create ${entity}`

	const redirectOnSuccess = { pageName: 'auto/form', parameters: { entity, id: new RoutingParameter('entity.id') } }
	const onCreateSuccess = useOnPersistSuccess({ redirectOnSuccess })
	const createEditLink = (entity: string) => ({ pageName: 'auto/form', parameters: { entity, id: new RoutingParameter('entity.id') } })

	return (
		<>
			<SlotSources.Title>{title}</SlotSources.Title>
			<SlotSources.Back>
				<NavigateBackLink to={{ pageName: 'auto/grid', parameters: { entity } }}>Back to Grid</NavigateBackLink>
			</SlotSources.Back>

			<DataBindingProvider stateComponent={FeedbackRenderer} >
				<SlotSources.Actions>
					<PersistButton />
				</SlotSources.Actions>
				<AutoForm entity={entity} id={id} onCreateSuccess={onCreateSuccess} LinkComponent={AutoLink} />
			</DataBindingProvider>
		</>
	)
}
