import { useClassName } from '@contember/react-utils'
import { createElement, ReactNode } from 'react'
import { HTMLHeadingElementProps } from '../../types'
import { toViewClass } from '../../utils'

export interface EditorHeadingProps {
	level: 1 | 2 | 3 | 4 | 5 | 6
	isNumbered?: boolean
	attributes: HTMLHeadingElementProps
	align?: 'start' | 'end' | 'center' | 'justify'
	children: ReactNode
}

export function EditorHeading({ level, isNumbered, attributes, align, children }: EditorHeadingProps) {
	return createElement(
		`h${level}` as 'h1', // Casting just to type-check the rest better.
		{
			...attributes,
			style: {
				textAlign: align,
			},
			className: useClassName('editorHeading', toViewClass('numbered', isNumbered)),
		},
		children,
	)
}
