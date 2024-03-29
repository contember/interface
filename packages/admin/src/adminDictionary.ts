import type {
	BlockRepeaterDictionary,
	EditorDictionary,
	OutdatedApplicationDictionary,
	RepeaterDictionary,
	UploadDictionary,
} from './components'
import { DataGridCellsDictionary, DataGridDictionary } from '@contember/react-datagrid-ui'
import { ErrorCodeDictionary, FieldViewDictionary, PersistFeedbackDictionary } from '@contember/react-binding-ui'
import { ChoiceFieldDictionary } from '@contember/react-choice-field-ui'

// This isn't in i18n in order to avoid unnecessary circular imports.

// This should ideally be a complete list of all individual dictionaries throughout the entire package.
// That way, translation packages can implement this and have TS warn them about missing messages.
export type AdminDictionary =
	& BlockRepeaterDictionary
	& DataGridCellsDictionary
	& DataGridDictionary
	& ErrorCodeDictionary
	& EditorDictionary
	& FieldViewDictionary
	& PersistFeedbackDictionary
	& RepeaterDictionary
	& UploadDictionary
	& ChoiceFieldDictionary
	& OutdatedApplicationDictionary
