import { Anchor, isSpecialLinkClick } from '@contember/ui'
import {
	AnchorHTMLAttributes,
	ComponentType, MouseEvent as ReactMouseEvent,
	ReactNode,
	memo,
	useCallback,
} from 'react'
import { RequestParameters, RoutingLinkTarget, RoutingParameterResolver } from './types'
import { useRoutingLink } from './useRoutingLink'

/**
 * Low level link. Usually, you should use {@link Link}
 *
 * @group Routing
 */
export const RoutingLink = memo<RoutingLinkProps & PublicAnchorProps>(({ onClick, to, parametersResolver, parameters, Component, componentProps, target, ...props }) => {
	const { navigate, isActive: active, href } = useRoutingLink(to, parametersResolver, parameters)

	const innerOnClick = useCallback((e?: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => {
		if (e) {
			if (onClick) {
				onClick(e)
			}
			if (e.isDefaultPrevented() || isSpecialLinkClick(e.nativeEvent) || target) {
				return
			}
		}
		navigate(e)
	}, [navigate, onClick, target])

	const InnerComponent = Component ?? Anchor
	return <InnerComponent active={active} href={href} target={target} {...componentProps} {...props} onClick={innerOnClick} />
})
RoutingLink.displayName = 'RoutingLink'

export type PublicAnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>


export interface InnerRoutingLinkProps extends Omit<PublicAnchorProps, 'onClick'> {
	href: string
	active: boolean
	onClick: (e?: ReactMouseEvent<HTMLAnchorElement>) => void
}


export interface RoutingLinkProps<T = {}> {
	Component?: ComponentType<InnerRoutingLinkProps & T>
	componentProps?: T
	children?: ReactNode
	to: RoutingLinkTarget
	parametersResolver?: RoutingParameterResolver
	parameters?: RequestParameters
}
