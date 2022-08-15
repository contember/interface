import { Component, EntityAccessor, HasMany, HasOne, SugaredField } from '@contember/binding'
import type { FunctionComponent } from 'react'
import type { ChoiceFieldData } from './ChoiceFieldData'
import { DynamicMultipleChoiceFieldProps, useDynamicMultipleChoiceField } from './hooks/useDynamicMultipleChoiceField'
import { renderDynamicChoiceFieldStatic } from './renderDynamicChoiceFieldStatic'
import { useDynamicMultipleChoiceWithConnectingEntityField } from './hooks/useDynamicMultipleChoiceWithConnectingEntityField'

export const DynamicMultiChoiceField: FunctionComponent<DynamicMultipleChoiceFieldProps & ChoiceFieldData.MultiChoiceFieldProps<EntityAccessor>> =
	Component(
		props => {
			const choiceFieldMetadata = 'connectingEntityField' in props
				? useDynamicMultipleChoiceWithConnectingEntityField(props)
				: useDynamicMultipleChoiceField(props)
			return props.children(choiceFieldMetadata)
		},
		(props, environment) => {
			let { subTree, renderedOption } = renderDynamicChoiceFieldStatic(props, environment)

			if ('connectingEntityField' in props) {
				const hasOneProps = typeof props.connectingEntityField === 'string'
					? { field: props.connectingEntityField }
					: props.connectingEntityField

				renderedOption = <>
					{props.sortableBy && <SugaredField field={props.sortableBy} />}
					<HasOne {...hasOneProps} expectedMutation={'connectOrDisconnect'}>
						{renderedOption}
					</HasOne>
				</>
			}

			return (
				<>
					{subTree}
					<HasMany
						field={props.field}
						expectedMutation={'connectingEntityField' in props ? 'anyMutation' : 'connectOrDisconnect'}
						initialEntityCount={0}
					>
						{renderedOption}
					</HasMany>
				</>
			)
		},
		'DynamicMultiChoiceField',
	)
