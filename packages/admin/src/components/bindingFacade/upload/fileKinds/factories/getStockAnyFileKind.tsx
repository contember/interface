import type { S3FileUploader } from '@contember/client'
import { FileUrlFieldView } from '@contember/react-binding-ui'
import { defaultUploader } from '../../defaultUploader'
import { FileDataExtractor, getFileUrlDataExtractor, getGenericFileMetadataExtractor } from '../../fileDataExtractors'
import { FullFileKind, RenderFilePreviewOptions } from '../FullFileKind'
import { CommonFileKindProps } from '../types'

export type StockAnyFileKindProps<AcceptArtifacts = unknown> =
	& CommonFileKindProps<AcceptArtifacts>

export const acceptAnyFile = () => true
export const renderAnyFilePreview = ({ objectUrl }: RenderFilePreviewOptions) => (
	<a
		style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', direction: 'rtl' }}
		href={objectUrl}
		onClick={e => e.stopPropagation()}
		download
	>
		{objectUrl.substring(Math.max(0, objectUrl.lastIndexOf('/') + 1))}
	</a>
)

export const getStockAnyFileKind = <AcceptArtifacts = unknown>({
	additionalExtractors = [],
	acceptMimeTypes = null,
	acceptFile = acceptAnyFile,
	baseEntity,
	children,
	fileSizeField,
	fileTypeField,
	lastModifiedField,
	fileNameField,
	renderFilePreview = renderAnyFilePreview,
	renderUploadedFile,
	uploader = defaultUploader,
	urlField,
	childrenOutsideBaseEntity,
}: StockAnyFileKindProps<AcceptArtifacts>): FullFileKind<S3FileUploader.SuccessMetadata, AcceptArtifacts> => {
	const extractors: FileDataExtractor<any, S3FileUploader.SuccessMetadata, AcceptArtifacts>[] = [
		getFileUrlDataExtractor({ urlField }),
		getGenericFileMetadataExtractor({ fileNameField, fileSizeField, fileTypeField, lastModifiedField }),
		...additionalExtractors,
	]

	return {
		acceptMimeTypes,
		acceptFile,
		renderFilePreview,
		renderUploadedFile: renderUploadedFile ?? <FileUrlFieldView fileUrlField={urlField} />,
		uploader,
		children,
		childrenOutsideBaseEntity,
		baseEntity,
		extractors,
	}
}
