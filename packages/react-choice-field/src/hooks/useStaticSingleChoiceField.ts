import { FieldValue, useEnvironment, useField, VariableInputTransformer } from '@contember/react-binding'
import { useCallback, useMemo, useState } from 'react'
import { OptionallyVariableStaticOption, StaticSingleChoiceFieldProps } from '../StaticSingleChoiceField'
import { useFuseFilteredOptions } from './useFuseFilteredOptions'
import { SingleChoiceFieldRendererProps } from '../Renderers'
import { ChoiceFieldSingleOption } from '../ChoiceFieldOptions'

export const useStaticSingleChoiceField = (
	props: StaticSingleChoiceFieldProps,
): SingleChoiceFieldRendererProps<FieldValue> => {
	const [input, setSearchInput] = useState('')
	const field = useField(props)
	const data = useNormalizedOptions(props.options)
	const filteredData = useFuseFilteredOptions(props, data, input)

	const currentValue = useMemo(() => data.find(it => field.hasValue(it.value)) ?? null, [data, field])

	const onSelect = useCallback((value: FieldValue) => {
		field.updateValue(value)
	}, [field])
	const onClear = useCallback(() => {
		field.updateValue(null)
	}, [field])

	return {
		currentValue,
		data: filteredData,
		onSelect: onSelect,
		onClear: onClear,
		errors: field.errors?.errors,
		onSearch: setSearchInput,
	}
}


const useNormalizedOptions = (options: OptionallyVariableStaticOption[]) => {
	const environment = useEnvironment()
	return useMemo(
		() =>
			options.map(({ label, description, value, searchKeywords }, i): ChoiceFieldSingleOption<FieldValue> => {
				const transformValue = VariableInputTransformer.transformValue(value, environment)
				return ({
					key: i.toString(),
					searchKeywords: searchKeywords ?? `${label} ${transformValue}`,
					label,
					description,
					value: transformValue,
				})
			}),
		[environment, options],
	)
}
