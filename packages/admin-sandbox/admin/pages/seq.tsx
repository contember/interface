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
import { SlotSources } from '../components/Slots'

export const list = (
	<>
		<SlotSources.Title>List of Seqs</SlotSources.Title>
		<SlotSources.Actions>
			<LinkButton to={'seq/create'}>New entity</LinkButton>
		</SlotSources.Actions>

		<DataGridScope entities={'SeqEntity'}>
			<TextCell field={'value'} />
			<GenericCell canBeHidden={false} justification="justifyEnd">
				<LinkButton to={`seq/edit(id: $entity.id)`} Component={AnchorButton}>Edit</LinkButton>
				<DeleteEntityButton title="Delete" immediatePersist={true} />
			</GenericCell>
		</DataGridScope>
	</>
)

export const create = (
	<>
		<SlotSources.Title>Create a new Seq</SlotSources.Title>
		<CreateScope entity="SeqEntity" redirectOnSuccess="seq/edit(id: $entity.id)">
			<SlotSources.Actions><PersistButton /></SlotSources.Actions>
			<TextField field={'value'} label={'Value'} />
		</CreateScope>
	</>
)

export const edit = (
	<>
		<EditScope entity="SeqEntity(id = $id)">
			<FieldView field="value" render={title => (
				<SlotSources.Title>{`Edit ${title.getAccessor().value ? title.getAccessor().value : 'Article'}`}</SlotSources.Title>
			)} />

			<SlotSources.Actions><PersistButton /></SlotSources.Actions>

			<TextField field={'value'} label={'Value'} />
			<Repeater field={'sub'} label={'Sub'} orderBy={undefined}>
				<TextField field={'value'} label={'Value sub'} />
			</Repeater>
		</EditScope>
	</>
)
