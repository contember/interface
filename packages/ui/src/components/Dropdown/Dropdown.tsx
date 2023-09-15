import { useClassNameFactory, useColorScheme, useId } from '@contember/react-utils'
import { assertNever, colorSchemeClassName, deprecate, fallback, isDefined } from '@contember/utilities'
import { Placement } from '@popperjs/core'
import {
	MouseEventHandler,
	ReactElement,
	MouseEvent as ReactMouseEvent,
	ReactNode,
	Ref, memo,
	useCallback,
	useMemo,
	useState,
} from 'react'
import { FocusScope } from 'react-aria'
import { usePopper } from 'react-popper'
import { useCloseOnClickOutside, useCloseOnEscape } from '../../auxiliary'
import type { DropdownAlignment } from '../../types'
import { toViewClass } from '../../utils'
import { Collapsible } from '../Collapsible'
import { Button, ButtonProps } from '../Forms'
import { Portal, usePortalProvider } from '../Portal'

export interface DropdownRenderProps {
	requestClose: () => void
	update: () => void
	forceUpdate: () => void
}

export interface DropdownProps {
	renderToggle?: (props: {
		ref: Ref<HTMLElement>
		onClick: (event: ReactMouseEvent<HTMLElement, MouseEvent>) => void
	}) => ReactNode
	renderContent?: (props: DropdownRenderProps) => ReactNode
	buttonProps?: ButtonProps
	/** @deprecated Use `placement` instead */
	alignment?: DropdownAlignment
	placement?: Placement
	strategy?: 'absolute' | 'fixed'
	contentContainer?: HTMLElement
	children?: ReactElement | ((props: DropdownRenderProps) => ReactNode)
	styledContent?: boolean
	onDismiss?: () => void
}

const alignmentToPlacement = (alignment: DropdownAlignment | undefined) => {
	if (alignment === 'start') {
		return 'bottom-start'
	} else if (alignment === 'end') {
		return 'bottom-end'
	} else if (alignment === 'center' || alignment === 'default' || alignment === undefined) {
		return 'bottom'
	} else if (alignment === 'top') {
		return 'top'
	} else if (alignment === 'right') {
		return 'right'
	} else {
		return assertNever(alignment)
	}
}

const noop = () => { }

/**
 * @group UI
 */
export const Dropdown = memo(({
	alignment,
	placement,
	...props
}: DropdownProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isTransitioning, setIsTransitioning] = useState(false)

	const onDismiss = props.onDismiss
	const isActive = isOpen || isTransitioning

	const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null)
	const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)

	deprecate('1.4.0', isDefined(alignment), '`alignment` prop', '`placement` prop')
	placement = fallback(placement, isDefined(alignment), alignmentToPlacement(alignment))

	const { styles, attributes, forceUpdate, update } = usePopper(
		isActive ? referenceElement : null,
		isActive ? popperElement : null,
		{ placement, strategy: props.strategy },
	)

	const suppliedButtonOnClickHandler = props.buttonProps && props.buttonProps.onClick
	const onButtonClick = useCallback<MouseEventHandler<HTMLElement>>(
		e => {
			forceUpdate?.()
			setIsOpen(isOpen => !isOpen)
			setIsTransitioning(true)
			suppliedButtonOnClickHandler && suppliedButtonOnClickHandler(e as ReactMouseEvent<HTMLButtonElement>)
		},
		[forceUpdate, suppliedButtonOnClickHandler],
	)
	const close = useCallback(() => {
		setIsOpen(false)
		setIsTransitioning(true)
	}, [])

	const dismiss = useCallback(() => {
		close()
		onDismiss?.()
	}, [close, onDismiss])

	useCloseOnEscape({ isOpen, close: dismiss })
	useCloseOnClickOutside({ isOpen, close: dismiss, contents: useMemo(() => [referenceElement, popperElement], [referenceElement, popperElement]) })

	const componentClassName = useClassNameFactory('dropdown')
	const colorScheme = useColorScheme()

	const { children, renderContent, renderToggle, styledContent = true } = props

	const renderProps: DropdownRenderProps = {
		requestClose: close,
		forceUpdate: forceUpdate ?? noop,
		update: update ?? noop,
	}

	const currentPortalContainer = usePortalProvider(props.contentContainer)
	const id = `dropdown${useId()}`

	return (
		<>
			{renderToggle ? (
				renderToggle({ ref: setReferenceElement, onClick: onButtonClick })
			) : (
				<Button
					active={isActive}
					{...props.buttonProps}
					onClick={onButtonClick}
					ref={setReferenceElement}
					aria-controls={id}
				/>
			)}
			{isActive && (
				<Portal to={currentPortalContainer}>
					<div
						id={id}
						ref={setPopperElement}
						style={styles.popper}
						{...attributes.popper}
						className={componentClassName('content', [colorSchemeClassName(colorScheme)])}
						data-placement={placement}
					>
						<Collapsible
							expanded={isOpen}
							transition="fade"
							onTransitionEnd={() => {
								if (isOpen) {
									return
								}
								setIsTransitioning(false)
							}}
						>
							<FocusScope autoFocus contain={isOpen} restoreFocus>
								{renderContent ? (
									renderContent(renderProps)
								) : (
									<div className={componentClassName('content-in', toViewClass('unstyled', !styledContent))}>
										{typeof children === 'function' ? children(renderProps) : children}
									</div>
								)}
							</FocusScope>
						</Collapsible>
					</div>
				</Portal>
			)}
		</>
	)
})
Dropdown.displayName = 'Dropdown'
