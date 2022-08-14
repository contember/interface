import { entriesFromObject, excludeFromArray, objectFromEntries, splitStringToStringList, toFlatArrayOfClassNameValues } from './Helpers'
import { toClassNameList } from './toClassNameList'
import { isRegularKey, isVariableKey, isVariableValue } from './TypePredicates'
import { ProcessedClassNameListValue, StyleSheetClassName, StyleSheetVariableKey, StyleSheetVariableValue, ToStyleSheet } from './Types'

export function variableEntries(entries: [string, any][]): [StyleSheetVariableKey, StyleSheetVariableValue][] {
  return excludeFromArray(null, entries.map(
    ([key, value]) => {
      if (isVariableKey(key)) {
        if (isVariableValue(value)) {
          return [key, value]
        } else if (import.meta.env.DEV) {
          throw new Error(`Unexpected '${key}' variable value: ${JSON.stringify(value)}. Use 'string', 'number', 'boolean', 'null' or 'undefined' value type.`)
        }
      }

      return null
    },
  ))
}

export function subComponentEntries(entries: [string, any][]): [string, any][] {
  return excludeFromArray(null, entries.map(
    ([key, value]) => isRegularKey(key)
      ? [key, toStyleSheet(value)]
      : null,
  ))
}

function toStyleSheetFromObject<T extends { [key: string]: any }>(value: T extends Iterable<any> ? never : T) {
  const entries = entriesFromObject<string, any>(value)

  const $: { $?: ProcessedClassNameListValue } = value.hasOwnProperty('$') ? { $: toClassNameList(value.$) } : {}
  const variables: [StyleSheetVariableKey, StyleSheetVariableValue][] = variableEntries(entries)
  const subComponents: [string, any][] = subComponentEntries(entries)

  return {
    ...$,
    ...objectFromEntries(variables),
    ...objectFromEntries(subComponents),
  }
}

export function toStyleSheet<T extends StyleSheetClassName>(value: T): ToStyleSheet<T> {
  if (typeof value === 'number' || value === null || value === undefined || typeof value === 'boolean') {
    return undefined as ToStyleSheet<T>
  } else if (typeof value === 'string') {
    return { $: splitStringToStringList(value) } as ToStyleSheet<T>
  } else if (Array.isArray(value)) {
    return { $: toFlatArrayOfClassNameValues(value) } as ToStyleSheet<T>
  } else if (typeof value === 'function') {
    return { $: [value] } as ToStyleSheet<T>
  } else if (typeof value === 'object') {
    return toStyleSheetFromObject(value as object) as ToStyleSheet<T>
  } else {
    const _exhaustiveCheck: never = value
    return undefined as ToStyleSheet<T>
  }
}