import { EntityListAccessor, ErrorAccessor } from '../../accessors'
import { EntityListSubTreeMarker, HasManyRelationMarker } from '../../markers'
import { EntityId, EntityName, RemovalType } from '../../treeParameters'
import { BijectiveIndexedMap } from '../structures'
import { EntityRealmState, EntityRealmStateStub } from './EntityRealmState'
import { StateType } from './StateType'

export type EntityListBlueprint =
	| {
			readonly marker: HasManyRelationMarker
			readonly parent: EntityRealmState
	  }
	| {
			readonly marker: EntityListSubTreeMarker
			readonly parent: undefined
	  }

export interface EntityListState {
	type: StateType.EntityList

	blueprint: EntityListBlueprint
	children: BijectiveIndexedMap<EntityId, EntityRealmState | EntityRealmStateStub>
	childrenWithPendingUpdates: Set<EntityRealmState> | undefined
	entityName: EntityName
	errors: ErrorAccessor | undefined
	eventListeners: {
		[Type in EntityListAccessor.EntityListEventType]:
			| Set<EntityListAccessor.EntityListEventListenerMap[Type]>
			| undefined
	}
	getAccessor: () => EntityListAccessor
	hasStaleAccessor: boolean
	plannedRemovals: Map<EntityRealmState | EntityRealmStateStub, RemovalType> | undefined
	unpersistedChangesCount: number

	addError: EntityListAccessor.AddError
	addEventListener: EntityListAccessor.AddEntityListEventListener
	batchUpdates: EntityListAccessor.BatchUpdates
	connectEntity: EntityListAccessor.ConnectEntity
	createNewEntity: EntityListAccessor.CreateNewEntity
	disconnectEntity: EntityListAccessor.DisconnectEntity
	getChildEntityById: EntityListAccessor.GetChildEntityById
}
