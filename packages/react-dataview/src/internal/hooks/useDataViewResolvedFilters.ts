import { Filter, QualifiedEntityList } from '@contember/binding'
import { useMemo } from 'react'
import { useEnvironment } from '@contember/react-binding'
import { DataViewFilterHandlerRegistry, DataViewFilteringArtifacts } from '../../types'
import { replaceGraphQlLiteral } from '@contember/client'

export type UseDataViewResolvedFiltersArgs = {
	filters: DataViewFilteringArtifacts
	filterTypes?: DataViewFilterHandlerRegistry
	entities: QualifiedEntityList
}

export const useDataViewResolvedFilters = ({
	entities,
	filterTypes,
	filters,
}: UseDataViewResolvedFiltersArgs) => {
	const environment = useEnvironment()
	const customFilters = useMemo((): Filter[] => {
		const ands: Filter[] = []
		for (const [key, value] of Object.entries(filters)) {
			const handler = filterTypes?.[key]
			if (handler === undefined) {
				continue
			}
			const filter = handler(value, { environment })
			if (filter === undefined) {
				continue
			}
			ands.push(filter)
		}
		return ands
	}, [environment, filters, filterTypes])

	return useMemo((): Filter<never> => {
		return resolveFilter({ and: [...customFilters, entities.filter ?? {}] })
	}, [entities.filter, customFilters])
}


const resolveFilter = (input?: Filter): Filter<never> => {
	return replaceGraphQlLiteral<unknown>(input) as Filter<never>
}
