import type { S3FileUploader } from '@contember/client'
import { ImageFieldView } from '@contember/react-binding-ui'
import { defaultUploader } from '../../defaultUploader'
import type { FileDataExtractor, ImageFileDataExtractorProps } from '../../fileDataExtractors'
import {
	getFileUrlDataExtractor,
	getGenericFileMetadataExtractor,
	getImageFileDataExtractor,
} from '../../fileDataExtractors'
import { AcceptFileOptions, FullFileKind, RenderFilePreviewOptions } from '../FullFileKind'
import { CommonFileKindProps } from '../types'

export type StockImageFileKindProps<AcceptArtifacts = unknown> =
	& CommonFileKindProps<AcceptArtifacts>
	& ImageFileDataExtractorProps

export const acceptImageFile = ({ file }: AcceptFileOptions) => file.type.startsWith('image')
export const renderImageFilePreview = ({ objectUrl }: RenderFilePreviewOptions) => <img src={objectUrl} alt="" />

export const getStockImageFileKind = <AcceptArtifacts = unknown>({
	additionalExtractors = [],
	acceptMimeTypes = 'image/*',
	acceptFile = acceptImageFile,
	baseEntity,
	children,
	fileSizeField,
	fileTypeField,
	lastModifiedField,
	fileNameField,
	renderFilePreview = renderImageFilePreview,
	renderUploadedFile,
	heightField,
	widthField,
	uploader = defaultUploader,
	urlField,
	childrenOutsideBaseEntity,
}: StockImageFileKindProps<AcceptArtifacts>): FullFileKind<S3FileUploader.SuccessMetadata, AcceptArtifacts> => {
	const extractors: FileDataExtractor<any, S3FileUploader.SuccessMetadata, AcceptArtifacts>[] = [
		getFileUrlDataExtractor({ urlField }),
		getGenericFileMetadataExtractor({ fileNameField, fileSizeField, fileTypeField, lastModifiedField }),
		getImageFileDataExtractor({ heightField, widthField }),
		...additionalExtractors,
	]

	return {
		acceptMimeTypes,
		acceptFile,
		renderFilePreview,
		uploader,
		renderUploadedFile: renderUploadedFile ?? <ImageFieldView srcField={urlField} />,
		children,
		childrenOutsideBaseEntity,
		baseEntity,
		extractors,
	}
}
