import { ComponentType, forwardRef, ReactNode, useCallback } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { useEntity, useMutationState, usePersist } from '@contember/admin'


const SlotButton = Slot as ComponentType<React.ButtonHTMLAttributes<HTMLButtonElement>>

export interface ClearFieldTriggerProps {
	immediatePersist?: true
	children: ReactNode
}

export const DeleteEntityTrigger = forwardRef<HTMLElement, ClearFieldTriggerProps>(({ immediatePersist, ...props }) => {
	const parentEntity = useEntity()
	const triggerPersist = usePersist()
	const isMutating = useMutationState()
	const onClick = useCallback(() => {
		parentEntity.deleteEntity()

		if (immediatePersist) {
			triggerPersist().catch(() => {
			})
		}
	}, [triggerPersist, immediatePersist, parentEntity])

	return (
		<SlotButton
			onClick={onClick}
			disabled={isMutating ? true : undefined}
			{...props}
		/>
	)
})
