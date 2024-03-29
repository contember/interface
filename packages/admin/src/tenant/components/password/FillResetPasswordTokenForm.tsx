import { Button, FieldContainer, Stack, TextInput } from '@contember/ui'
import { FC, useCallback } from 'react'
import { RoutingLinkTarget, useRedirect } from '../../../routing'
import { useForm } from '../../lib'

export interface FillResetPasswordTokenFormProps {
	resetLink: RoutingLinkTarget
}

const initialValues = {
	token: '',
}

export const FillResetPasswordTokenForm: FC<FillResetPasswordTokenFormProps> = ({ resetLink }) => {
	const redirect = useRedirect()

	const { register, isSubmitting, onSubmit } = useForm<typeof initialValues>(initialValues, useCallback(
			async (values: typeof initialValues) => {
				redirect(resetLink, { token: values.token })
			},
			[redirect, resetLink],
		),
	)

	return (
		<form onSubmit={onSubmit}>
			<Stack gap="large">
				<FieldContainer label="Token">
					<TextInput {...register('token')} required={true} />
				</FieldContainer>
				<FieldContainer label={undefined}>
					<Button distinction="primary" type={'submit'} disabled={isSubmitting}>
						Continue
					</Button>
				</FieldContainer>
			</Stack>
		</form>
	)
}
