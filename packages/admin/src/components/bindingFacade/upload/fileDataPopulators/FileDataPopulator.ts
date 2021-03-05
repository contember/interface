import { EntityAccessor, Environment } from '@contember/binding'
import {
	ReactNode,
	ComponentType,
	ReactElement,
	memo,
	useCallback,
	useMemo,
	useRef,
	useState,
	FC,
	FunctionComponent,
	Fragment,
	PureComponent,
	useEffect,
} from 'react'

export interface FileDataPopulatorOptions<UploadResult = any> {
	file: File
	previewUrl: string
	uploadResult: UploadResult
	batchUpdates: EntityAccessor['batchUpdates']
	environment: Environment
}

export interface FileDataPopulator<FileData = any, UploadResult = any> {
	getStaticFields: (environment: Environment) => ReactNode
	canHandleFile?: (file: File) => boolean // Considered true if the method is absent
	prepareFileData?: (file: File, previewUrl: string) => Promise<FileData>
	populateFileData: (options: FileDataPopulatorOptions<UploadResult>, fileData: FileData) => void
}
