import { useIdentity } from '../../../components'
import { useMemo, useState } from 'react'
import { DisableOtpForm } from './DisableOtpForm'
import { Button } from '@contember/ui'
import { PrepareOtpForm } from './PrepareOtpForm'
import { ConfirmOtpForm } from './ConfirmOtpForm'
import qrcode from 'qrcode-generator'

export const OtpManagement = () => {
	const identity = useIdentity()
	const [initializingOtp, setInitializingOtp] = useState(false)
	const [otpUri, setOtpUri] = useState<string>()

	const person = identity.person

	if (!person) {
		return <>
			Cannot setup OTP for API key.
		</>
	}

	if (initializingOtp) {
		return (
			<>
				<PrepareOtpForm
					onPrepared={({ otpUri }) => {
						setInitializingOtp(false)
						setOtpUri(otpUri)
					}}
					isReSetup={person.otpEnabled}
					onCancel={() => setInitializingOtp(false)}
				/>
			</>
		)
	}
	if (otpUri) {
		return <>
			<p>
				Now scan the following QR code in you application:
			</p>
			<QrCode data={otpUri} />
			<p>
				After registering to you application, write down a code from the application.
			</p>
			<ConfirmOtpForm onSuccess={() => {
				setOtpUri(undefined)
			}} />
		</>
	}

	if (person.otpEnabled) {
		return <>
			<p>
				Two factor authentication is ENABLED.
			</p>
			<DisableOtpForm />
			<p>You already have two-factor authentication active. By enabling a new code, the old one will no longer work.</p>
			<Button onClick={() => setInitializingOtp(true)}>Setup again</Button>
		</>
	}
	return <>
		<p>
			2-Step Verification provides stronger security for your account by requiring a second step of
			verification when you sign in. In addition to your password, you’ll also need a code generated by an application
			on your phone.
		</p>
		<Button onClick={() => setInitializingOtp(true)}>Setup two-factor authentication</Button>
	</>
}

const QrCode = ({ data }: { data: string }) => {
	const code = useMemo(() => {
		const qr = qrcode(0, 'L')
		qr.addData(data)
		qr.make()
		return qr.createDataURL(4)
	}, [data])
	return <img src={code} />
}
