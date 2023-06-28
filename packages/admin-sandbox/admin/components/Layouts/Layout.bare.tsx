import { ComponentClassNameProps, pick, useClassNameFactory } from '@contember/utilities'
import { PropsWithChildren } from 'react'
import { SlotTargets } from '../Slots'

// const { Content, FooterActions, HeaderActions, Logo, Navigation, Sidebar, Title, Switchers, Back, Profile, ...rest } = SlotTargets
const LayoutSlots = pick(SlotTargets, [
	'Back',
	'Logo',
	'Navigation',
	'Switchers',
	'Title',
	'Profile',
	'Content',
	'HeaderActions',
	'FooterActions',
	'Sidebar',
])

export const Layout = ({ children, className: classNameProp, ...rest }: PropsWithChildren<ComponentClassNameProps>) => {
	const className = useClassNameFactory('test-layout')

	return (
		<div {...rest} className={className(null, classNameProp)} style={{
			backgroundColor: 'var(--cui-background-color)',
			color: 'var(--cui-color)',
			flexGrow: 1,
		}}>
			<div className={className('logo')}>
				<LayoutSlots.Logo />
			</div>

			<div className={className('title')}>
				<LayoutSlots.Title />
			</div>

			<div className={className('switchers')}>
				<LayoutSlots.Switchers />
			</div>

			<div className={className('navigation')}>
				<LayoutSlots.Navigation />
			</div>

			<div className={className('back-navigation')}>
				<LayoutSlots.Back />
			</div>

			<div className={className('profile')}>
				<LayoutSlots.Profile />
			</div>
			<div className={className('content')}>
				<LayoutSlots.Content />
				{children}
			</div>

			<div className={className('actions')}>
				<LayoutSlots.HeaderActions />
			</div>

			<div className={className('actions')}>
				<LayoutSlots.FooterActions />
			</div>

			<div className={className('sidebar')}>
				<LayoutSlots.Sidebar />
			</div>

			<div className={className('profile')}>
				<LayoutSlots.Profile />
			</div>
		</div>
	)
}
