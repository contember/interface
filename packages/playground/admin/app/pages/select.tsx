import { Slots } from '../../lib/components/slots'
import { Binding, PersistButton } from '../../lib/components/binding'
import { EntitySubTree } from '@contember/interface'
import * as React from 'react'
import { Field } from '@contember/react-binding'
import { InputField, MultiSelectField, SelectField, SortableMultiSelectField } from '../../lib/components/form'


export const hasOne = () => <>
	<Binding>
		<Slots.Actions>
			<PersistButton />
		</Slots.Actions>
		<EntitySubTree entity={'SelectRoot(unique=unique)'} setOnCreate={'(unique=unique)'}>
			<div className={'space-y-4'}>
				<SelectField field={'hasOne'} label="Has one value">
					<Field field={'name'} />
				</SelectField>
			</div>
		</EntitySubTree>
	</Binding>
</>
export const hasMany = () => <>
	<Binding>
		<Slots.Actions>
			<PersistButton />
		</Slots.Actions>
		<EntitySubTree entity={'SelectRoot(unique=unique)'} setOnCreate={'(unique=unique)'}>
			<div className={'space-y-4'}>
				<MultiSelectField field={'hasMany'} label="Has many values">
					<Field field={'name'} />
				</MultiSelectField>
			</div>
		</EntitySubTree>
	</Binding>
</>
export const hasManySortable = () => <>
	<Binding>
		<Slots.Actions>
			<PersistButton />
		</Slots.Actions>
		<EntitySubTree entity={'SelectRoot(unique=unique)'} setOnCreate={'(unique=unique)'}>
			<div className={'space-y-4'}>
				<SortableMultiSelectField field={'hasManySorted'} connectAt={'value'} sortableBy={'order'} label="Has many sortable values">
					<Field field={'name'} />
				</SortableMultiSelectField>
			</div>
		</EntitySubTree>
	</Binding>
</>

export const createNewForm = () => <>
	<Binding>
		<Slots.Actions>
			<PersistButton />
		</Slots.Actions>
		<EntitySubTree entity={'SelectRoot(unique=unique)'} setOnCreate={'(unique=unique)'}>
			<div className={'space-y-4'}>
				<SelectField
					field={'hasOne'}
					label="Has one value"
					createNewForm={<>
						<InputField field="name" />
						<InputField field="slug" />
					</>}
				>
					<Field field={'name'} />
				</SelectField>
			</div>
		</EntitySubTree>
	</Binding>
</>
