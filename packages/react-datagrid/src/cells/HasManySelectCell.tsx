import {
	Component,
	Entity,
	HasMany,
	QueryLanguage,
	SugaredRelativeEntityList,
	useEntityList,
	wrapFilterInHasOnes,
} from '@contember/react-binding'
import { ComponentType, Fragment, FunctionComponent, ReactElement, ReactNode, useMemo } from 'react'
import {
	BaseDynamicChoiceField,
	renderDynamicChoiceFieldStatic,
	useCurrentlyChosenEntities,
	useDesugaredOptionPath,
	useSelectOptions,
} from '@contember/react-choice-field'
import { DataGridColumnCommonProps, FilterRendererProps } from '../types'
import { DataGridColumn } from '../grid'
import { RelationFilterArtifacts, createHasManyFilter } from '@contember/react-dataview'
import { SelectCellFilterExtraProps } from './common'

export type HasManySelectRendererProps =
	& SugaredRelativeEntityList
	& BaseDynamicChoiceField
	& {
		initialFilter?: RelationFilterArtifacts
	}


export type HasManySelectProps =
	& HasManySelectRendererProps
	& DataGridColumnCommonProps


export const createHasManySelectCell = <ColumnProps extends {}, ValueRendererProps extends {}>({ FilterRenderer, ValueRenderer }: {
	FilterRenderer: ComponentType<FilterRendererProps<RelationFilterArtifacts, SelectCellFilterExtraProps>>,
	ValueRenderer: ComponentType<HasManySelectRendererProps & ValueRendererProps>
}): FunctionComponent<HasManySelectProps & ColumnProps & ValueRendererProps> => Component(props => {
	return (
		<DataGridColumn<RelationFilterArtifacts>
			{...props}
			enableOrdering={false}
			getNewFilter={createHasManyFilter(props.field)}
			emptyFilter={{
				id: [],
				nullCondition: false,
			}}
			filterRenderer={filterProps => {
				const optionProps = {
					lazy: { initialLimit: 0 },
					...props,
				}
				const currentlyChosenEntities = useCurrentlyChosenEntities(optionProps, filterProps.filter.id ?? [])
				const selectProps = useSelectOptions(optionProps, currentlyChosenEntities)

				return <FilterRenderer {...selectProps}  {...filterProps} />
			}}
		>
			<ValueRenderer lazy={{ initialLimit: 0 }} {...props} />
		</DataGridColumn>
	)
}, 'HasManySelectField')

export type HasManySelectCellElementsRenderer = (elements: ReactNode[]) => ReactElement

export const createHasManySelectCellRenderer = <FallbackProps extends {}>({ renderElements = defaultElementsRenderer, FallbackRenderer = () => null }: {
	renderElements?: HasManySelectCellElementsRenderer
	FallbackRenderer?: ComponentType<FallbackProps>
}) => Component<HasManySelectRendererProps & {
	renderElements?: (elements: ReactNode[]) => ReactElement
} & FallbackProps>(
	props => {
		const desugaredOptionPath = useDesugaredOptionPath(props, undefined)
		const entities = useEntityList(props)
		const entitiesArray = useMemo(
			() => Array.from(entities, it => it.getEntity({ field: desugaredOptionPath.hasOneRelationPath })),
			[desugaredOptionPath.hasOneRelationPath, entities],
		)

		const elementsRenderer = props.renderElements ?? renderElements
		if ('renderOption' in props) {
			return elementsRenderer(entitiesArray.map(it => props.renderOption(it)))
		}

		if ('field' in desugaredOptionPath) {
			if (entitiesArray.length === 0) {
				return <FallbackRenderer {...props} />
			}
			return elementsRenderer(entitiesArray.map(it => {
				const val = it.getField<string | number>(desugaredOptionPath.field).value
				if (val !== null) {
					return <Fragment key={it.key}>{val}</Fragment>
				}
				return <FallbackRenderer key={it.key} {...props} />
			}))
		}

		if ('optionLabel' in props) {
			return elementsRenderer(entitiesArray.map(it => (
				<Entity key={it.key} accessor={it}>{props.optionLabel}</Entity>
			)))
		}

		return <></>

	},
	(props, environment) => {
		const { listSubTree, renderedOption } = renderDynamicChoiceFieldStatic(props, environment)
		const { listSubTree: currentValuesSubtree } = renderDynamicChoiceFieldStatic(props, environment, { id: { in: [] } })

		return (
			<>
				{listSubTree}
				{currentValuesSubtree}
				<HasMany field={props.field} expectedMutation="none">
					{renderedOption}
				</HasMany>
			</>
		)
	})


const defaultElementsRenderer = (elements: ReactNode[]): ReactElement => (
	<>
		{elements.map((it, index, arr) => <Fragment key={typeof it === 'object' && it !== null && 'key' in it ? it.key : index}>{it}{index < (arr.length - 1) ? ', ' : ''}</Fragment>)}
	</>
)
