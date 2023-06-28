import { useClassNameFactory } from '@contember/utilities'
import { memo } from 'react'
import { HTMLDivElementProps } from '../../types'
import { toEnumClass } from '../../utils'

/** @deprecated Use `LayoutKit` from `@contember/layout` instead. */
export type LayoutPageContentProps =
	& {
		/** @deprecated Use `pageContentLayout` instead */
		layout?: 'default' | 'full-width'
		pageContentLayout?: 'center' | 'start' | 'end' | 'stretch'
	}
	& HTMLDivElementProps

/** @deprecated Use `LayoutKit` from `@contember/layout` instead. */
export const LayoutPageContent = memo(({ children, layout, pageContentLayout = 'center' }: LayoutPageContentProps) => {
	const componentClassName = useClassNameFactory('layout-page-content')

	if (import.meta.env.DEV && layout) {
		console.warn('The `layout` prop is deprecated, use `pageContentLayout` prop instead')
	}

	if (layout === 'full-width' && !pageContentLayout) {
		pageContentLayout = 'stretch'
	}

	return (
		<div className={componentClassName()}>
			<div className={componentClassName('container', [
				toEnumClass('layout-', pageContentLayout ?? layout),
			])}>
				{children}
			</div>
		</div>
	)
})
LayoutPageContent.displayName = 'LayoutPageContent'

/**
 * @deprecated Use `LayoutPageContent` instead
 */
export const PageLayoutContent = LayoutPageContent
