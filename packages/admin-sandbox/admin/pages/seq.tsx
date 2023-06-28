import {
	AnchorButton,
	CreateScope, DataGridScope,
	DeleteEntityButton,
	EditScope,
	FieldView,
	GenericCell,
	LinkButton,
	PersistButton,
	Repeater,
	TextCell,
	TextField,
} from '@contember/admin'
import { Title } from '../components/Directives'
import { SlotSources } from '../components/Slots'

export const list = (
	<>
		<Title>List of Seqs</Title>
		<SlotSources.HeaderActions>
			<LinkButton to={'seq/create'}>New entity</LinkButton>
		</SlotSources.HeaderActions>

		<SlotSources.Content>
			<DataGridScope entities={'SeqEntity'}>
				<TextCell field={'value'} />
				<GenericCell canBeHidden={false} justification="justifyEnd">
					<LinkButton to={`seq/edit(id: $entity.id)`} Component={AnchorButton}>Edit</LinkButton>
					<DeleteEntityButton title="Delete" immediatePersist={true} />
				</GenericCell>
			</DataGridScope>
		</SlotSources.Content>
	</>
)

export const create = (
	<>
		<Title>Create a new Seq</Title>
		<CreateScope entity="SeqEntity" redirectOnSuccess="seq/edit(id: $entity.id)">
			<SlotSources.HeaderActions><PersistButton /></SlotSources.HeaderActions>

			<SlotSources.Content>
				<TextField field={'value'} label={'Value'} />
			</SlotSources.Content>
		</CreateScope>
	</>
)

export const edit = (
	<>
		<EditScope entity="SeqEntity(id = $id)">
			<FieldView field="value" render={title => (
				<Title>{`Edit ${title.getAccessor().value ? title.getAccessor().value : 'Article'}`}</Title>
			)} />

			<SlotSources.HeaderActions><PersistButton /></SlotSources.HeaderActions>

			<SlotSources.Content>
				<TextField field={'value'} label={'Value'} />
				<Repeater field={'sub'} label={'Sub'} orderBy={undefined}>
					<TextField field={'value'} label={'Value sub'} />
				</Repeater>
			</SlotSources.Content>
		</EditScope>
	</>
)
