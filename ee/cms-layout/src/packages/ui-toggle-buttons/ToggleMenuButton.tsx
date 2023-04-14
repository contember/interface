import { Button } from '@contember/admin'
import { MenuIcon, XIcon } from 'lucide-react'
import { memo } from 'react'
import { classNameForFactory, NestedClassName } from '../class-name'
import { useEvent } from '../react-hooks'
import { useGetLayoutPanelsStateContext, useSetLayoutPanelsStateContext } from '../ui-layout'

interface ToggleMenuButtonProps {
	className?: NestedClassName;
	componentClassName?: string;
	panel: string;
}

export const ToggleMenuButton = memo<ToggleMenuButtonProps>(({
	className,
	componentClassName = 'toggle-menu-button',
	panel,
}) => {
	const { show, hide } = useSetLayoutPanelsStateContext()
	const { panels } = useGetLayoutPanelsStateContext()
	const panelState = panels.get(panel)

	return (
		<Button
			distinction="seamless"
			className={classNameForFactory(componentClassName, [className, 'layout-slot', 'synthetic-layout-slot'])()}
			flow="squarish"
			onClick={useEvent(() => {
				panelState?.visibility === 'visible' ? hide(panel) : show(panel)
			})}
		>
			{panelState?.visibility === 'visible'
				? <XIcon />
				: <MenuIcon />
			}
		</Button>
	)
})
ToggleMenuButton.displayName = 'ToggleMenuButton'
