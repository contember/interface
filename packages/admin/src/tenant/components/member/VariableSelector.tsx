import { Box, Button, FieldContainer, Icon, Stack, TextareaInput, TextInput } from '@contember/ui'
import { FC, useCallback, useState } from 'react'
import { RoleVariableDefinition } from '../../queries'
import { Membership } from '../../types'
import { RolesConfig } from './EditMembership'

export interface VariableSelectorProps {
	rolesConfig?: RolesConfig
	membership: Membership
	variable: RoleVariableDefinition
	onChange: (newMembership: Membership) => void
}

const GenericVariableEdit = ({ label, value, onChange }: { label?: React.ReactNode, value: string[]; onChange: (newValues: string[]) => void }) => {
	const [localValues, setLocalValues] = useState(value.length > 0 ? value : [''])

	const onChangeCallback = useCallback((index: number, newValue: string | null) => {
		const newValues = newValue !== null
			? localValues.map((v, i) => i === index ? newValue : v)
			: localValues.filter((_, i) => i !== index)
		setLocalValues(newValues)
		onChange(newValues.map(it => it.trim()).filter(it => !!it))
	}, [localValues, onChange, setLocalValues])


	return (
		<FieldContainer label={label} gap="gap" style={{ margin: '1em' }}>
			{localValues.map((v, i) => (
				<Box key={i} padding={false} horizontal gap={false}>
					<TextInput
						notNull
						value={v}
						distinction="seamless"
						onChange={newValue => {
							onChangeCallback(i, newValue ?? '')
						}}
						style={{ marginLeft: '0.5em' }}
					/>
					<Button
						distinction="seamless"
						onClick={() => {
							onChangeCallback(i, null)
						}}
					>
						<Icon blueprintIcon="trash" />
					</Button>
				</Box>
			))}
			<Button
				distinction="seamless"
				justify="start"
				onClick={() => {
					setLocalValues(prev => [...prev, ''])
				}}
			>
				<Icon
					blueprintIcon="add"
					style={{
						marginRight: '0.2em',
						position: 'relative',
						top: '0.05em',
					}}
				/>
				Add
			</Button>
		</FieldContainer>
	)
}

/**
 * @group Tenant
 */
export const VariableSelector: FC<VariableSelectorProps> = ({ rolesConfig, membership, variable, onChange }) => {
	const innerOnChange = useCallback(
		(newValues: string[]) => {
			const newMembership: Membership = {
				...membership,
				variables: [
					...membership.variables.filter(membershipVariable => membershipVariable.name !== variable.name),
					{
						name: variable.name,
						values: newValues,
					},
				],
			}
			onChange(newMembership)
		},
		[membership, onChange, variable.name],
	)

	const roleConfig = rolesConfig?.[membership.role]
	const variableConfig = roleConfig?.variables[variable.name]
	if (roleConfig && variableConfig === undefined) {
		return <>Unknown variable</>
	}

	const variableInMembership = membership.variables.find(
		membershipVariable => membershipVariable.name === variable.name,
	)
	const values = variableInMembership !== undefined ? variableInMembership.values : []

	if (variableConfig?.render) {
		const Component = variableConfig.render
		return <Component value={values} onChange={innerOnChange} />
	} else {
		return <GenericVariableEdit label={variable.name} value={values} onChange={innerOnChange} />
	}
}
