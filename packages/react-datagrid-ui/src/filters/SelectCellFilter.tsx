import { Checkbox, FieldContainer, Stack } from '@contember/ui'
import { useMemo } from 'react'
import { ChoiceFieldOptions } from '@contember/react-choice-field'
import { MultiSelectFieldInner } from '@contember/react-choice-field-ui'
import { dataGridCellsDictionary } from '../dict/dataGridCellsDictionary'
import { EntityAccessor } from '@contember/react-binding'

import { FilterRendererProps, SelectCellFilterExtraProps } from '@contember/react-datagrid'
import { useMessageFormatter } from '@contember/react-i18n'
import { RelationFilterArtifacts } from '@contember/react-dataview'

export type SelectCellFilterProps =
	& FilterRendererProps<RelationFilterArtifacts>
	& SelectCellFilterExtraProps

/**
 * DataGrid filter component for rendering selects in custom cells. Usually, you just use {@link HasManySelectCell} or {@link HasOneSelectCell}
 *
 * @group Data grid
 */
export const SelectCellFilter = ({ filter, setFilter, options, allOptions, onSearch, isLoading }: SelectCellFilterProps) => {
	const currentValues = useMemo<ChoiceFieldOptions<EntityAccessor>>(() => {
		return allOptions.filter(it => filter.id?.includes(it.value.id))
	}, [filter.id, allOptions])
	const formatMessage = useMessageFormatter(dataGridCellsDictionary)

	return (
		<Stack align="center" horizontal>
			<MultiSelectFieldInner
				label={undefined}
				data={options}
				onAdd={(val: EntityAccessor) => setFilter({ ...filter, id: [...filter.id ?? [], val.id] })}
				onRemove={val => setFilter({ ...filter, id: filter.id?.filter(it => it !== val.id) })}
				errors={undefined}
				currentValues={currentValues}
				onClear={() => {
					setFilter({ ...filter, id: [] })
				}}
				onSearch={onSearch}
				isLoading={isLoading}
			/>

			<FieldContainer
				display="inline"
				label={<span style={{ whiteSpace: 'nowrap' }}>
					{formatMessage('dataGridCells.textCell.includeNull', {
						strong: chunks => <strong>{chunks}</strong>,
					})}
				</span>}
				labelPosition="right"
			>
				<Checkbox
					notNull
					value={filter.nullCondition}
					onChange={checked => {
						setFilter({
							...filter,
							nullCondition: !!checked,
						})
					}}
				/>
			</FieldContainer>
	</Stack>
	)
}
