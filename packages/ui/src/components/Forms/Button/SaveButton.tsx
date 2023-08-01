import { forwardRef, memo } from 'react'
import { Button, ButtonProps } from '.'

export type SaveButtonProps =
	& {
		isPrimary?: boolean
		labelSave?: string
		labelSaved?: string
		isDirty: boolean
	}
	& ButtonProps

// TODO: Save i18n

/**
 * @group UI
 */
export const SaveButton = memo(forwardRef<HTMLButtonElement, SaveButtonProps>(({
	distinction,
	flow,
	isDirty,
	isPrimary = true,
	labelSave,
	labelSaved,
	scheme,
	size,
	...rest
}, ref) => (
	<Button
		ref={ref}
		componentClassName={['button', 'save-button']}
		className={[rest.className]}
		distinction={isPrimary ? 'primary' : distinction}
		flow={flow}
		scheme={scheme}
		size={size}
		{...rest}
	>
		{isDirty
			? (labelSave ?? 'Save')
			: (labelSaved ?? 'Save')
		}
	</Button>
)))

SaveButton.displayName = 'SaveButton'
