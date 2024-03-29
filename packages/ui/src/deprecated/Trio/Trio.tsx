import { useClassNameFactory } from '@contember/react-utils'
import { deprecate } from '@contember/utilities'
import type { ReactNode } from 'react'
import { toViewClass } from '../../utils'

/** @deprecated No alternative since 1.4.0 */
export function Trio({
	className,
	column,
	start,
	center,
	end,
	clickThroughSpace,
}: {
	column?: boolean
	className?: string
	start?: ReactNode
	center?: ReactNode
	end?: ReactNode
	clickThroughSpace?: boolean
}) {
	deprecate('1.4.0', true, 'Trio', null)

	const componentClassName = useClassNameFactory('trio')

	if (!start && !center && !end) {
		return null
	}
	return (
		<div
			className={componentClassName(null, [
				className,
				toViewClass('column', column),
				toViewClass('clickThroughSpace', clickThroughSpace),
			])}
		>
			<div className={componentClassName('start')}>{start}</div>
			<div className={componentClassName('center')}>{center}</div>
			<div className={componentClassName('end')}>{end}</div>
		</div>
	)
}
Trio.displayName = 'Trio'
