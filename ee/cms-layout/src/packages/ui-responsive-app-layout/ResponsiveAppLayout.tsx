import { CSSProperties, ElementType, ReactNode, forwardRef, memo, useMemo, useRef } from 'react'
import { classNameForFactory } from '../class-name'
import { px } from '../css-utilities'
import { useComposeRef, useElementSize } from '../react-hooks'
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../typescript-utilities'
import { InsetsProvider, combineElementInsets, useContainerInsetsContext, useSafeAreaInsetsContext } from '../ui-insets'
import { Layout, OwnContainerProps } from '../ui-layout'

export interface OwnResponsiveAppLayoutProps extends OwnContainerProps {
	minimumFooterHeight?: number;
	minimumHeaderHeight?: number;
	header?: ReactNode;
	footer?: ReactNode;
}

export type ResponsiveAppLayoutProps<C extends ElementType> =
	PolymorphicComponentPropsWithRef<C, OwnResponsiveAppLayoutProps>

type ResponsiveAppLayoutComponentType = (<C extends ElementType = 'div'>(
	props: ResponsiveAppLayoutProps<C>,
) => React.ReactElement | null) & {
	displayName?: string | undefined;
}

export const ResponsiveAppLayout: ResponsiveAppLayoutComponentType = memo(forwardRef(
	<C extends ElementType = 'div'>({
		as,
		children,
		className,
		header,
		footer,
		componentClassName = 'responsive-app-layout',
		...rest
	}: ResponsiveAppLayoutProps<C>, forwardedRef: PolymorphicRef<C>) => {
		const layoutHeaderRef = useRef<HTMLDivElement>(null)
		const headerSize = useElementSize(layoutHeaderRef)
		const layoutFooterRef = useRef<HTMLDivElement>(null)
		const footerSize = useElementSize(layoutFooterRef)

		const headerHeight = (headerSize.height ?? 0) * (headerSize.width ?? 0) === 0 ? undefined : headerSize.height
		const footerHeight = (footerSize.height ?? 0) * (footerSize.width ?? 0) === 0 ? undefined : footerSize.height

		const classNameFor = classNameForFactory(componentClassName, className, {
			'responsive-app-layout-header-has-height': (headerHeight ?? 0) > 0,
			'responsive-app-layout-footer-has-height': (footerHeight ?? 0) > 0,
		})

		const elementRef = useRef<HTMLElement>(null)
		const composeRef = useComposeRef(elementRef, forwardedRef)

		const safeAreaInsets = useSafeAreaInsetsContext()
		const containerInsets = useContainerInsetsContext()

		const headerInsets = useMemo(() => ({
			...combineElementInsets(safeAreaInsets, containerInsets),
			bottom: 0,
		}), [containerInsets, safeAreaInsets])

		const footerInsets = useMemo(() => ({
			...combineElementInsets(safeAreaInsets, containerInsets),
			top: 0,
		}), [containerInsets, safeAreaInsets])

		const bodyInsets = useMemo(() => combineElementInsets(
			safeAreaInsets,
			containerInsets,
			{
				top: headerHeight,
				bottom: footerHeight,
			},
		), [safeAreaInsets, containerInsets, headerHeight, footerHeight])

		return (
			// TODO: Maybe fix any when possible
			<Layout.Root<any> as={as} ref={composeRef} className={classNameFor()} {...rest}>
				<Layout.ResponsiveContainer
					style={{
						'--header-height': `${px(headerHeight)}`,
						'--footer-height': `${px(footerHeight)}`,
					} as CSSProperties}
					className={classNameFor('main')}
				>
					<InsetsProvider
						ref={layoutHeaderRef}
						as="header"
						className={classNameFor('header')}
						bottom={headerInsets.bottom}
						left={headerInsets.left}
						right={headerInsets.right}
						top={headerInsets.top}
					>
						<div className={classNameFor('header-container')}>
							{header}
						</div>
					</InsetsProvider>

					<InsetsProvider
						className={classNameFor('body')}
						bottom={bodyInsets.bottom}
						left={bodyInsets.left}
						right={bodyInsets.right}
						top={bodyInsets.top}
					>
						<div className={classNameFor('body-container')}>
							{children}
						</div>
					</InsetsProvider>

					<InsetsProvider
						as="footer"
						ref={layoutFooterRef}
						className={classNameFor('footer')}
						bottom={footerInsets.bottom}
						left={footerInsets.left}
						right={footerInsets.right}
						top={footerInsets.top}
					>
						<div className={classNameFor('footer-container')}>
							{footer}
						</div>
					</InsetsProvider>
				</Layout.ResponsiveContainer>
			</Layout.Root>
		)
	},
))
ResponsiveAppLayout.displayName = 'ResponsiveAppLayout'
