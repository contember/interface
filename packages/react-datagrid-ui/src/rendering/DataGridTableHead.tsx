import { DataGridHeaderCell } from './DataGridHeaderCell'
import { TableRow } from '@contember/ui'
import { useDataGridColumns, useDataGridHidingState } from '@contember/react-datagrid'

export const DataGridTableHead = () => {
	const columns = useDataGridColumns()
	const hiddenColumns = useDataGridHidingState()
	return (
		<TableRow>
			{Array.from(columns)
				// We use desired state here to give immediate feedback about column changes.
				.filter(([columnKey]) => !hiddenColumns[columnKey])
				.map(([columnKey, column]) => {
					return (
						<DataGridHeaderCell
							key={columnKey}
							columnKey={columnKey}
							column={column}
						/>
					)
				})}
		</TableRow>
	)
}
