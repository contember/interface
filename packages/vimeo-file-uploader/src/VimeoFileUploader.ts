import type { FileUploader, FileUploaderInitializeOptions, UploadedFileMetadata } from '@contember/client'
import { FileUploadError } from '@contember/client'
import { Upload } from 'tus-js-client'

interface VimeoFileUploaderState {
	upload?: Upload
	alias: number
}

class VimeoFileUploader implements FileUploader {
	private readonly uploadState: WeakMap<File, VimeoFileUploaderState> = new WeakMap()

	public constructor(private readonly options: VimeoFileUploader.Options = {}) { }

	private generateNewAlias = (() => {
		let alias = 1
		return () => alias++
	})()

	private static formatFullAlias(alias: number) {
		return `file${alias}`
	}

	public async upload(
		files: Map<File, UploadedFileMetadata>,
		{ contentApiClient, onError, onProgress, onSuccess }: FileUploaderInitializeOptions,
	) {
		if (!files.size) {
			return
		}

		const parameters: Map<string, { size: number }> = new Map()

		for (const [file, metadata] of files) {
			if (this.uploadState.has(file)) {
				const uploadState = this.uploadState.get(file)!
				uploadState.upload?.abort(true)
			}

			const alias = this.generateNewAlias()
			this.uploadState.set(file, {
				alias,
			})

			parameters.set(VimeoFileUploader.formatFullAlias(alias), {
				size: file.size,
			})

			metadata.abortSignal.addEventListener('abort', () => {
				this.uploadState.get(file)?.upload?.abort(true)
			})
		}

		const mutation = this.buildAPIQuery(parameters)
		try {
			const response = await contentApiClient.sendRequest<{
				data: {
					[fileAlias: string]: {
						ok: boolean
						errors: {
							endUserMessage: string
							developerMessage: string
							code: string
						}
						result: {
							uploadUrl: string
							vimeoId: string
						}
					}
				}
			}>(mutation)
			const responseData = response.data

			for (const [file] of files) {
				const fileState = this.uploadState.get(file)!
				const datumBody = responseData[VimeoFileUploader.formatFullAlias(fileState.alias)]

				if (!datumBody.ok) {
					onError([[file, new FileUploadError({ endUserMessage: datumBody.errors.endUserMessage })]])
				}

				const { vimeoId, uploadUrl } = datumBody.result

				const upload = new Upload(file, {
					endpoint: 'none',
					retryDelays: [0, 3000, 5000, 10000, 20000],
					onError: (error: Error) => {
						onError([[file, new FileUploadError({ developerMessage: error.message })]])
					},
					onProgress: (bytesUploaded, bytesTotal) => {
						const progress = bytesUploaded / bytesTotal
						onProgress([[file, { progress }]])
					},
					onSuccess: () => {
						const successMetadata = this.options.mapVimeoIdToResult
							? this.options.mapVimeoIdToResult(vimeoId)
							: {
								// Structurally piggybacking on the stock S3FileUploader.
								// This is kind of crap but it means we don't have to force the user to write a custom populator.
								fileUrl: vimeoId,
							}
						onSuccess([[file, successMetadata]])
					},
				})
				upload.url = uploadUrl
				fileState.upload = upload
				upload.start()
			}
		} catch (error) {
			onError(files.keys())
		}
	}

	private buildAPIQuery(parameters: Map<string, { size: number }>): string {
		return `
mutation {
	${Array.from(parameters)
				.map(
					([alias, { size }]) =>
						`${alias}: generateVimeoUploadUrl(size: ${size}) {
		ok
		errors {
			endUserMessage
			developerMessage
			code
		}
		result {
			uploadUrl
			vimeoId
		}
	}`,
				)
				.join('\n')}
}
`
	}
}

namespace VimeoFileUploader {
	export interface Options {
		mapVimeoIdToResult?: (vimeoId: string) => any
	}
}

export { VimeoFileUploader }
