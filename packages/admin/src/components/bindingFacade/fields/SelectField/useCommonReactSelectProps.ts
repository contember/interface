import { CommonReactSelectStylesProps, useCommonReactSelectStyles } from '@contember/ui'
import type { Props as SelectProps } from 'react-select'
import { StylesConfig, useStateManager } from 'react-select'
import type { ChoiceFieldData } from '../ChoiceField'
import { SearchInput } from './SearchInput'

export interface UseCommonReactSelectPropsProps<T> extends Omit<CommonReactSelectStylesProps, 'isInvalid'> {
	reactSelectProps: Partial<SelectProps<any>> | undefined
	placeholder: string | undefined
	data: ChoiceFieldData.Options<T>
	isInvalid: boolean
	onSearch?: (input: string) => void
}

export const useCommonReactSelectProps = <T>({
	reactSelectProps,
	placeholder,
	data,
	isInvalid,
	menuZIndex,
	onSearch,
}: UseCommonReactSelectPropsProps<T>): SelectProps<ChoiceFieldData.SingleOption<T>, boolean, never> => {
	const styles = useCommonReactSelectStyles<any, boolean, never>({ isInvalid, menuZIndex })
	const reactSelectState = useStateManager<ChoiceFieldData.SingleOption<T>, boolean, never, {}>({
		onInputChange: onSearch,
		onFocus: e => {
			onSearch?.(e.target.value)
		},
	})
	return {
		...reactSelectProps,
		...reactSelectState,
		placeholder,
		styles: {
			...styles,
			...(reactSelectProps?.styles as StylesConfig<ChoiceFieldData.SingleOption<T>, boolean, never> | undefined),
		},
		options: data,
		getOptionValue: datum => datum.key,
		components: {
			Input: SearchInput,
		},
		filterOption: () => true,
		menuPosition: 'fixed',
	}
}
