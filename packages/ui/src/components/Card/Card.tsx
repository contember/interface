import { useClassName } from '@contember/react-utils'
import { MouseEvent, ReactNode, memo } from 'react'
import { HTMLAnchorElementProps, HTMLDivElementProps } from '../../types'
import { toEnumViewClass, toFeatureClass, toStateClass } from '../../utils'
import { VisuallyDependentControlProps, useInputClassName } from '../Forms'
import { Label } from '../Typography'

const CardInner = ({
	className,
	children,
	src,
}: {
	className: string,
	children: ReactNode,
	src?: string | null,
}) => (
	<div className={`${className}-inner`}>
		<div
			className={`${className}-thumbnail`}
			style={{ backgroundImage: src ? `url('${encodeURI(src)}')` : undefined }}
		/>
		{children && <div className={`${className}-content`}>
			<Label>{children}</Label>
		</div>}
	</div>
)

export interface LinkCompatibleProps {
	active?: boolean
	href?: string
	onClick?: (e?: MouseEvent<HTMLAnchorElement>) => void
}

export type CommonCardProps =
	& VisuallyDependentControlProps
	& {
		active?: boolean
		// onRemove?: () => void // TODO: Implement when Actionable box is enhanced
		// onEdit?: () => void // TODO: Implement when Actionable box is enhanced
		src?: string | null
		children?: ReactNode
		layout?: 'label-below' | 'label-inside'
	}

export type CardProps =
	& Omit<CommonCardProps, 'type'>
	& Omit<HTMLDivElementProps, 'onClick'>
	& {
		href?: never
		onClick?: () => void
	}

export type LinkCardProps =
	& Omit<CommonCardProps, 'active' | 'type'>
	& Omit<HTMLAnchorElementProps, 'href' | 'onClick'>
	& LinkCompatibleProps

/**
 * @group UI
 */
export const LinkCard = memo<LinkCardProps>(({
	href,
	target,
	onClick,
	active,
	children,
	className,
	layout = 'label-below',
	src,
	...props
}) => (
	<a
		href={href}
		target={target}
		onClick={onClick}
		{...props}
		className={useClassName('card', [
			toEnumViewClass(layout),
			toFeatureClass('focus', true),
			toFeatureClass('hover', true),
			toFeatureClass('press', true),
			toStateClass('active', active),
			useInputClassName(props as VisuallyDependentControlProps),
			className,
		])}
	>
		<CardInner src={src} className={useClassName('card')}>{children}</CardInner>
	</a>
))
LinkCard.displayName = 'LinkCard'

/**
 * @group UI
 */
export const Card = memo<CardProps>(({
	children,
	className,
	layout = 'label-below',
	onClick,
	active,
	src,
	...props
}) => (
	<div {...props} onClick={onClick} className={useClassName('card', [
		toEnumViewClass(layout),
		toFeatureClass('focus', !!onClick),
		toFeatureClass('hover', !!onClick),
		toFeatureClass('press', !!onClick),
		toStateClass('active', active),
		useInputClassName(props as VisuallyDependentControlProps),
		className,
	])}>
		<CardInner src={src} className={useClassName('card')}>{children}</CardInner>
	</div>
))
Card.displayName = 'Card'
