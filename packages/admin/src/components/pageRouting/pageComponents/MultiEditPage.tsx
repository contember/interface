import {
	DataBindingProvider,
	EntityListSubTree,
	EntityListSubTreeAdditionalProps,
	SugaredQualifiedEntityList,
} from '@contember/react-binding'
import { ReactNode } from 'react'
import { FeedbackRenderer, MutableEntityListPageRenderer, MutableEntityListPageRendererProps } from '../../bindingFacade'
import { pageComponent } from './pageComponent'

export type MultiEditPageProps<ContainerExtraProps, ItemExtraProps> =
	& SugaredQualifiedEntityList
	& EntityListSubTreeAdditionalProps
	& {
		pageName?: string
		children?: ReactNode
		rendererProps?: Omit<MutableEntityListPageRendererProps<ContainerExtraProps, ItemExtraProps>, 'accessor' | 'children'>
	}

/**
 * @example
 * ```
 * <MultiEditPage
 *   entities="BottleVolume"
 *   rendererProps={{ title: 'Bottle volumes', sortableBy: 'order' }}
 * >
 * 	<TextField field="volume" label="Volume" />
 * </MultiEditPage>
 * ```
 *
 * @group Pages
 */
export const MultiEditPage = pageComponent(
	<ContainerExtraProps, ItemExtraProps>({
		children,
		rendererProps,
		pageName,
		...entityListProps
	}: MultiEditPageProps<ContainerExtraProps, ItemExtraProps>) => (
		<DataBindingProvider stateComponent={FeedbackRenderer}>
			<EntityListSubTree {...entityListProps} listComponent={MutableEntityListPageRenderer} listProps={rendererProps}>
				{children}
			</EntityListSubTree>
		</DataBindingProvider>
	),
	'MultiEditPage',
)
