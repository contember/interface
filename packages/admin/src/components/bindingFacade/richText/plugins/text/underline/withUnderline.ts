import isHotkey from 'is-hotkey'
import { createElement } from 'react'
import type { BaseEditor } from '../../../baseEditor'

export const underlineMark = 'isUnderlined'

export const withUnderline = <E extends BaseEditor>(editor: E): E => {
	const { onKeyDown, renderLeafChildren, processAttributesPaste, processInlinePaste } = editor

	const isUnderlinedHotkey = isHotkey('mod+u')

	editor.renderLeafChildren = props => {
		const children = renderLeafChildren(props)

		if (props.leaf[underlineMark] === true) {
			return createElement('u', undefined, children)
		}
		return children
	}

	editor.onKeyDown = event => {
		// TODO use onDOMBeforeInput for this
		if (isUnderlinedHotkey(event.nativeEvent)) {
			editor.toggleMarks({ [underlineMark]: true })
			event.preventDefault()
		}
		onKeyDown(event)
	}

	editor.processAttributesPaste = (element, cta) => {
		if (element.style.textDecoration === 'underline') {
			cta = { ...cta, [underlineMark]: true }
		}
		return processAttributesPaste(element, cta)
	}

	editor.processInlinePaste = (element, next, cumulativeTextAttrs) => {
		if (element.nodeName === 'U') {
			return next(element.childNodes, { ...cumulativeTextAttrs, [underlineMark]: true })
		}
		return processInlinePaste(element, next, cumulativeTextAttrs)
	}

	return editor
}
