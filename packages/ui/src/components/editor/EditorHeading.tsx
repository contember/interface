import cn from 'classnames'
import { createElement, ReactNode } from 'react'
import { useClassNamePrefix } from '../../auxiliary'
import { toViewClass } from '../../utils'
import { HTMLHeadingElementProps } from '../../types'

export interface EditorHeadingProps {
	level: 1 | 2 | 3 | 4 | 5 | 6
	isNumbered?: boolean
	attributes: HTMLHeadingElementProps
	align?: 'start' | 'end' | 'center' | 'justify'
	children: ReactNode
}

export function EditorHeading({ level, isNumbered, attributes, align, children }: EditorHeadingProps) {
	const prefix = useClassNamePrefix()
	return createElement(
		`h${level}` as 'h1', // Casting just to type-check the rest better.
		{
			...attributes,
			style: {
				textAlign: align,
			},
			className: cn(`${prefix}editorHeading`, toViewClass('numbered', isNumbered)),
		},
		children,
	)
}
