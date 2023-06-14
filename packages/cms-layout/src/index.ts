import * as Constants from './Constants'
import { Content } from './Content'
import { Root } from './Root'
import { Sidebar } from './Sidebar'
import * as Slots from './Slots'
export * from './Types'

export const CMSLayout = {
	Constants,
	Content,
	Root,
	Sidebar,
	...Slots,
}
