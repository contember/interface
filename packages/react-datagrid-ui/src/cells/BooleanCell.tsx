import { createBooleanCell } from '@contember/react-datagrid'
import { BooleanCellFilter } from '../filters'
import { BooleanFieldView, BooleanFieldViewProps } from '@contember/react-binding-ui'
import { DataGridColumnPublicProps } from '../types'
import { Component, SugarableRelativeSingleField } from '@contember/react-binding'

/**
 * DataGrid cell for displaying a content of boolean field.
 *
 * @example
 * ```
 * <BooleanCell field="isPublished" header="Is published?" />
 * ```
 *
 * @group Data grid
 */
export const BooleanCell = createBooleanCell<DataGridColumnPublicProps, BooleanFieldViewProps>({
	FilterRenderer: BooleanCellFilter,
	ValueRenderer: Component<Omit<BooleanFieldViewProps, 'field'> & {
		field: string | SugarableRelativeSingleField
	}>(({ field, ...props }) => {
		return <BooleanFieldView field={{ field }} {...props} />
	}),
})
