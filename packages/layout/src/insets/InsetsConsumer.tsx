import { useComposeRef } from '@contember/react-utils'
import { NestedClassName, PolymorphicComponentPropsWithRef, PolymorphicRef, useClassName } from '@contember/utilities'
import React, { ElementType, ReactNode, forwardRef, memo, useRef } from 'react'
import { useElementInsetCustomProperties } from './useElementInsetCustomProperties'

export type OwnInsetsConsumerProps = {
	children?: ReactNode;
	className?: NestedClassName;
	componentClassName?: string;
}

export type InsetsConsumerProps<C extends ElementType> =
	PolymorphicComponentPropsWithRef<C, OwnInsetsConsumerProps>

export type InsetsConsumerComponentType = (<C extends ElementType = 'div'>(
	props: InsetsConsumerProps<C>,
) => React.ReactElement | null) & {
	displayName?: string | undefined;
}

export const InsetsConsumer: InsetsConsumerComponentType = memo(forwardRef(
	<C extends ElementType = 'div'>({
		as,
		children,
		className,
		componentClassName = 'insets-consumer',
		style,
		...rest
	}: InsetsConsumerProps<C>, forwardedRef: PolymorphicRef<C>) => {
		const Container = as ?? 'div'
		const elementRef = useRef<HTMLElement>(null)
		const composeRef = useComposeRef(elementRef, forwardedRef)

		const insetsStyle = useElementInsetCustomProperties(elementRef, '--container-inset-')

		return (
			<Container
				as={typeof Container === 'string' ? undefined : 'div'}
				ref={composeRef}
				className={useClassName(componentClassName, className)}
				style={{
					...insetsStyle,
					...style,
				}}
				{...rest}
			>
				{children}
			</Container>
		)
	},
))
InsetsConsumer.displayName = 'InsetsConsumer'