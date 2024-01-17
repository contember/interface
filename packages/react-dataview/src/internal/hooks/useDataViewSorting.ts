import { useCallback, useMemo } from 'react'
import { useSessionStorageState } from '@contember/react-utils'
import { DataViewSortingMethods, DataViewSortingProps, DataViewSortingState } from '../../types'
import { cycleOrderDirection } from '../helpers/cycleOrderDirection'
import { OrderBy, QueryLanguage, useEnvironment } from '@contember/react-binding'

export type UseDataViewSortingArgs =
	& {
		dataViewKey?: string
		resetPage: () => void
	}
	& DataViewSortingProps

export type UseDataViewSortingResult = {
	state: DataViewSortingState
	methods: DataViewSortingMethods
}

export const useDataViewSorting = ({ dataViewKey, initialSorting, resetPage }: UseDataViewSortingArgs): UseDataViewSortingResult => {
	const [directions, setDirections] = useSessionStorageState<DataViewSortingState['directions']>(
		`${dataViewKey}-orderBy`,
		val => val ?? initialSorting ?? {},
	)
	const environment = useEnvironment()

	const orderBy = useMemo((): OrderBy => {
		return Object.entries(directions).flatMap(([field, direction]) => {
			return QueryLanguage.desugarOrderBy(`${field} ${direction}`, environment)
		})
	}, [environment, directions])

	const setOrderBy = useCallback<DataViewSortingMethods['setOrderBy']>((columnKey, columnOrderBy, append) => {
		let didBailOut = false

		setDirections(orderBys => {
			const existingValue = orderBys[columnKey] ?? null

			if (existingValue === columnOrderBy) {
				didBailOut = true
				return orderBys
			}
			const resolvedValue = columnOrderBy === 'next' ? cycleOrderDirection(existingValue) : columnOrderBy
			if (resolvedValue === null) {
				const { [columnKey]: _, ...rest } = orderBys
				return rest
			}
			return append ? { ...orderBys, [columnKey]: resolvedValue } : { [columnKey]: resolvedValue }
		})
		if (!didBailOut) {
			resetPage()
		}
	}, [])

	return {
		state: useMemo(() => {
			return {
				directions,
				orderBy,
			}
		}, [directions, orderBy]),
		methods: useMemo(() => {
			return {
				setOrderBy,
			}
		}, [setOrderBy]),
	}
}
