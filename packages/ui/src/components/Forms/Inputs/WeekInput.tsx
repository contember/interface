import { useClassName } from '@contember/react-utils'
import { dataAttribute, deprecate } from '@contember/utilities'
import { forwardRef, memo } from 'react'
import { toViewClass } from '../../../utils'
import { useTextBasedInput } from '../Hooks'
import { assertWeekInputString } from '../Types'
import type { WeekInputProps } from './Types'

/**
 * @group Forms UI
 */
export const WeekInput = memo(forwardRef<HTMLInputElement, WeekInputProps>(({
	className,
	focusRing = true,
	withTopToolbar,
	...outerProps
}, forwardedRed) => {
	deprecate('1.4.0', withTopToolbar !== undefined, '`withTopToolbar` prop', null)

	outerProps.max && assertWeekInputString(outerProps.max)
	outerProps.min && assertWeekInputString(outerProps.min)
	outerProps.value && assertWeekInputString(outerProps.value)

	const props = useTextBasedInput<HTMLInputElement>({
		...outerProps,
		className: useClassName(['text-input', 'week-input'], [
			toViewClass('withTopToolbar', withTopToolbar),
			className,
		]),
	}, forwardedRed)

	return <input data-focus-ring={dataAttribute(focusRing)} {...props} type="week" />
}))
WeekInput.displayName = 'WeekInput'
