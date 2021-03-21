import { createContext } from 'react'
import { BindingOperations } from '../accessors'
import { BindingError } from '../BindingError'

const getRejecter = (operation: string) => () => {
	throw new BindingError(
		`Trying to ${operation} but data binding is unavailable. You likely used a bound component outside ` +
			`<DataBindingProvider /> or it tried to reach its accessor whilst the tree was in an non-interactive state ` +
			`(e.g. still loading).`,
	)
}

export const defaultBindingOperations = Object.freeze<BindingOperations>({
	get contentClient() {
		return getRejecter('retrieve the content api client')()
	},
	getEntityListSubTree: getRejecter('retrieve an entity list sub tree'),
	getEntitySubTree: getRejecter('retrieve a single entity sub tree'),
	getEntityByKey: getRejecter('retrieve an entity by key'),
	getTreeFilters: getRejecter('retrieve tree filters'),
	batchDeferredUpdates: getRejecter('batch deferred updates'),
	extendTree: getRejecter('extendTree'),
	persist: getRejecter('persist'),
})

export const BindingOperationsContext = createContext<BindingOperations>(defaultBindingOperations)
