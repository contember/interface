import { useProjectSlug } from '@contember/react-client'
import { Button, FieldContainer, LayoutPage, Stack, TextInput, useShowToast } from '@contember/ui'
import { FC, memo, SyntheticEvent, useCallback, useRef, useState } from 'react'
import { NavigateBackButton, RoutingLinkTarget, useRedirect } from '../../../routing'
import { InviteMethod, useInvite } from '../../mutations'
import { Membership } from '../../types'
import { EditMembership, RolesConfig } from '../member'

interface InviteUserProps {
	project: string
	rolesConfig?: RolesConfig
	userListLink: RoutingLinkTarget
	method?: InviteMethod
}

export const InviteUser: FC<InviteUserProps> = ({ project, rolesConfig, userListLink, method }) => {
	const [email, setEmailInner] = useState('')
	const redirect = useRedirect()
	const addToast = useShowToast()
	const [isSubmitting, setSubmitting] = useState(false)
	const [emailNotValidError, setEmailNotValidError] = useState(false)
	const setEmail = useCallback((email: string) => {
		setEmailNotValidError(false)
		setEmailInner(email)
	}, [])
	const [memberships, setMemberships] = useState<(Membership | undefined)[]>([undefined])

	const invite = useInvite()

	const submit = useCallback(
		async (e: SyntheticEvent) => {
			e.preventDefault()
			setEmailNotValidError(false)
			setSubmitting(true)
			const membershipsToSave = memberships.filter((it: Membership | undefined): it is Membership => it !== undefined)
			if (!email.match(/^.+@.+$/)) {
				return setEmailNotValidError(true)
			}
			const inviteResult = await invite({ email, memberships: membershipsToSave, projectSlug: project, method })
			setSubmitting(false)
			if (inviteResult.ok) {
				addToast({
					type: 'success',
					message: `User has been invited to this project and credentials have been sent to the given email.`,
					dismiss: true,
				})
				redirect(userListLink)
			} else {
				switch (inviteResult.error.code) {
					case 'ALREADY_MEMBER':
						return addToast({ message: `User is already member `, type: 'error', dismiss: true })
					case 'INVALID_MEMBERSHIP':
						return addToast({ message: `Invalid membership definition`, type: 'error', dismiss: true })
					case 'PROJECT_NOT_FOUND':
						return addToast({ message: `Project not found`, type: 'error', dismiss: true })
				}
			}
		},
		[memberships, email, invite, project, method, redirect, userListLink, addToast],
	)

	const editUserMembershipProps = { project, rolesConfig, memberships, setMemberships }

	const emailInput = useRef<HTMLInputElement>(null)

	return (
		<form onSubmit={submit}>
			<Stack direction="vertical" gap="large">
				<FieldContainer label="E-mail" errors={emailNotValidError ? [{ message: 'Email is not valid.' }] : undefined}>
					<TextInput
						ref={emailInput}
						validationState={emailNotValidError ? 'invalid' : 'default'}
						value={email}
						onChange={useCallback((value?: string | null) => setEmail?.(value ?? ''), [setEmail])}
					/>
				</FieldContainer>

				<EditMembership {...editUserMembershipProps} />

				<Button distinction="primary" type="submit" disabled={isSubmitting}>
					Invite
				</Button>
			</Stack>
		</form>
	)
}

export const InviteUserToProject: FC<{ rolesConfig: RolesConfig }> = memo(({ rolesConfig }) => {
	const project = useProjectSlug()
	if (!project) {
		return <>Not in project.</>
	}
	return (
		<LayoutPage
			title="Invite user"
			navigation={<NavigateBackButton to={'tenantUsers'}>Back to list of users</NavigateBackButton>}
		>
			<InviteUser project={project} rolesConfig={rolesConfig} userListLink={'tenantUsers'} />
		</LayoutPage>
	)
})
