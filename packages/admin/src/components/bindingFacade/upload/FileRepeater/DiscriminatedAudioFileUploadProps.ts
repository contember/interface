import { Scalar } from '@contember/binding'
import * as React from 'react'
import { SugaredDiscriminateBy } from '../../blocks'

export type DiscriminatedAudioFileUploadProps = {
	renderAudioFile?: () => React.ReactNode
	renderAudioFilePreview?: (file: File, previewUrl: string) => React.ReactNode
} & (
	| {
			discriminateAudioBy?: SugaredDiscriminateBy
	  }
	| {
			discriminateAudioByScalar?: Scalar
	  }
)

