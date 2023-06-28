import { DataBindingProvider } from '@contember/binding'
import { ReactNode } from 'react'
import {
	DataGrid,
	DataGridPageRenderer,
	DataGridProps,
	FeedbackRenderer,
	LayoutRendererProps,
} from '../../bindingFacade'
import { pageComponent } from './pageComponent'

export type DataGridPageProps =
	& DataGridProps<{}>
	& {
		/** @deprecated Use `DataGridScope` instead */
		pageName?: never;
		children?: ReactNode
		rendererProps?: Omit<LayoutRendererProps, 'children'>
	}

/**
 * @group Pages
 * @deprecated Use `DataGridScope` instead
 */
export const DataGridPage = pageComponent(({
		children,
		rendererProps,
		pageName,
		...dataGridProps
	}: DataGridPageProps) => (
		<DataBindingProvider stateComponent={FeedbackRenderer}>
			<DataGrid {...dataGridProps} component={DataGridPageRenderer} componentProps={rendererProps}>
				{children}
			</DataGrid>
		</DataBindingProvider>
	),
	'DataGridPage',
)
