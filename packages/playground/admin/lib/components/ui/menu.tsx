import { Link, RoutingLinkTarget } from '@contember/react-routing'
import { ReactNode } from 'react'
import { uic } from '../../../lib/utils/uic'

export type MenuItem = {
	icon?: ReactNode
	label: ReactNode
	to?: RoutingLinkTarget
	subItems?: MenuItem[]
	lvl?: number
}

export interface MenuProps {
	items: MenuItem[]
	lvl?: number
}

export const MenuList = ({ items, lvl = 0 }: MenuProps) => {
	return (
		<div className={'flex flex-col'}>
			{items.map((item, index) => (
				<MenuItem key={index} {...item} lvl={lvl} />
			))}
		</div>
	)
}

export const MenuItem = ({ icon, label, to, subItems, lvl = 0 }: MenuItem) => {
	return (
		<div>
			{to ? (
				<Link to={to}>
					<MenuLink className={'hover:bg-gray-100 cursor-pointer '}>
						<span className={'w-4 text-gray-400 inline-flex items-center justify-center'}>{icon}</span>
						<span className={lvl === 0 ? 'font-semibold' : ''}>{label}</span>
						<span className={'ml-auto'}></span>
					</MenuLink>
				</Link>
			) : (
				<MenuLink>
					<span className={'w-4 text-gray-400 items-center justify-center'}>{icon}</span>
					<span className={lvl === 0 ? 'font-semibold' : ''}>{label}</span>
					<span className={'ml-auto'}></span>
				</MenuLink>
			)}
			{subItems && (
				<div className={'ml-2'}>
					<MenuList items={subItems} lvl={lvl + 1} />
				</div>
			)}
		</div>
	)
}

export const MenuLink = uic('a', {
	baseClass: 'flex justify-start py-2.5 px-2.5 w-full gap-1 rounded text-sm items-center transition-all duration-200',
})