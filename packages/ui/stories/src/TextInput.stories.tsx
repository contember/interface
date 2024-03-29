import { useCallback, useState } from '@storybook/addons'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import * as React from 'react'
import { TextInput } from '../../src'
import { Button } from '../ui/Button'
import { booleanControl, enumControl, stringControl } from './Helpers'

export default {
	title: 'Forms/TextInput',
	component: TextInput,
	argTypes: {
		active: booleanControl(false),
		className: stringControl(''),
		defaultValue: stringControl(''),
		disabled: booleanControl(false),
		distinction: enumControl(['default', 'seamless', 'seamless-with-padding'], 'radio', 'default'),
		focused: booleanControl(false),
		hovered: booleanControl(false),
		loading: booleanControl(false),
		notNull: booleanControl(false),
		placeholder: stringControl('Enter value...'),
		readOnly: booleanControl(false),
		required: booleanControl(false),
		value: stringControl(''),
		withTopToolbar: booleanControl(false),
	},
} as ComponentMeta<typeof TextInput>

const Template: ComponentStory<typeof TextInput> = (args: {
	value?: string | null | undefined;
}) => {
	const ref = React.useRef<HTMLInputElement>(null)
	const [value, setValue] = useState<string | null | undefined>(args.value)
	const [error, setError] = useState<string | undefined>(undefined)
	const [touched, setTouched] = useState<boolean | undefined>(undefined)

	const onChange = useCallback((value?: string | null) => {
		setValue(value)
	}, [])

	React.useEffect(() => {
		setValue(args.value)
	}, [args.value])

	return <>
		<TextInput
			ref={ref}
			validationState={touched && error ? 'invalid' : undefined}
			{...args}
			value={value}
			onChange={onChange}
			onBlur={React.useCallback(() => {
				setTouched(true)
			}, [setTouched])}
			onValidationStateChange={setError}
		/>
		<div>Validation error: {error ?? 'Valid'}</div>
		<div>Value set: {JSON.stringify(value)}</div>
		<div>touched: {touched ? 'yes' : 'no'}</div>
		<Button onClick={() => {
			setTouched(false)
		}}>Reset touched state</Button>
	</>
}

export const Default = Template.bind({})

Default.args = {}
