import * as ReactDOM from 'react-dom'
import { Buffer } from 'buffer'
import { DevErrorManager, ErrorBus } from './DevErrorManager'
import { ReactElement } from 'react'

export type ErrorReactRenderer = (domElement: Element, reactElement: ReactElement, onRecoverableError: (e: any) => void) => void

const getErrorContainer = () => {
	const errorElementId = '__contember__dev__error__container__element'
	let errorContainer = document.getElementById(errorElementId)

	if (errorContainer) {
		// eslint-disable-next-line react/no-deprecated
		ReactDOM.unmountComponentAtNode(errorContainer)

	} else {
		errorContainer = document.createElement('div')
		errorContainer.id = errorElementId
		document.body.appendChild(errorContainer)
	}

	return errorContainer
}

const devErrorHandler = (renderer: ErrorReactRenderer): TryRun => {
	const errorBus = new ErrorBus()

	;(window as any).Buffer = Buffer
	window.addEventListener('error', e => {
		if (e.message.startsWith('ResizeObserver')) {
			// Apparently, this can be ignored: https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
			return
		}
		errorBus.handleError('Unhandled error', e.error)
	})

	window.addEventListener('unhandledrejection', e => errorBus.handleError('Unhandled promise rejection', e.reason))

	const origOnError = console.error
	console.error = (...args) => {
		origOnError(...args)
		for (const arg of args) {
			if (arg instanceof Error) {
				errorBus.handleError('Logged error', arg)
			}
		}
	}
	renderer(getErrorContainer(), <DevErrorManager bus={errorBus} />, () => {})

	return async cb => {
		try {
			await cb(e => errorBus.handleError('Recoverable React error', e))
		} catch (e) {
			errorBus.handleError('Entrypoint crash', e)
		}
	}
}

type TryRun = <T>(cb: (onRecoverableError: (e: any) => void) => T | Promise<T>) => void
const prodErrorHandler = (renderer: ErrorReactRenderer): TryRun => {
	const renderError = () => {
		renderer(getErrorContainer(), <h1>Fatal error</h1>, () => {})
	}

	window.addEventListener('error', renderError)
	window.addEventListener('unhandledrejection', renderError)

	return async cb => {
		try {
			await cb(e => {
				console.warn(e)
			})
		} catch (e) {
			console.error(e)
			renderError()
		}
	}
}


export const createErrorHandler = (renderer: ErrorReactRenderer) => {
	if (import.meta.env.DEV) {
		return devErrorHandler(renderer)
	} else {
		return prodErrorHandler(renderer)
	}
}
