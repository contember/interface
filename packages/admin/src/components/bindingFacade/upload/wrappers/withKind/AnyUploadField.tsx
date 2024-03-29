import { Component } from '@contember/react-binding'
import type { ReactElement } from 'react'
import { getStockAnyFileKind } from '../../fileKinds'
import { PublicSingleKindUploadFieldProps, SingleKindUploadField } from '../../internalComponents'

export type AnyUploadFieldProps<AcceptArtifacts = unknown, SFExtraProps extends {} = {}> =
	& PublicSingleKindUploadFieldProps<AcceptArtifacts, SFExtraProps>

/**
 * @example
 * ```
 * <AnyUploadField field="file" urlField="file.url" />
 * ```
 *
 * @group Uploads
 */
export const AnyUploadField = Component<AnyUploadFieldProps>(
	props => (
		<SingleKindUploadField {...props} kindFactory={getStockAnyFileKind}/>
	),
	'AnyUploadField',
) as <AcceptArtifacts = unknown, SFExtraProps extends {} = {}>(props: AnyUploadFieldProps<AcceptArtifacts, SFExtraProps>) => ReactElement | null
