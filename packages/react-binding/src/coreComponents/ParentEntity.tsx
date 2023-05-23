import type { ReactNode } from 'react'
import { MarkerFactory } from '@contember/binding'
import type { SugaredParentEntityParameters } from '@contember/binding'
import { Component } from './Component'

export interface ParentEntityProps extends SugaredParentEntityParameters {
	children?: ReactNode
}

/**
 * @group Data binding
 */
export const ParentEntity = Component<ParentEntityProps>(
	props => <>{props.children}</>,
	{
		generateBranchMarker: (props, fields, environment) =>
			MarkerFactory.createParentEntityMarker(props, fields, environment),
	},
	'ParentEntity',
)
