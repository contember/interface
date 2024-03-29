import { Box, Button, TextInput, TextareaInput } from '@contember/ui'
import { SendHorizontalIcon, TrashIcon } from 'lucide-react'
import { SlotSources } from '../components/Slots'

export default () => (
	<>
		<SlotSources.Title>Boxes</SlotSources.Title>

		A basic box with various paddings:
		<Box padding={false}>A box content</Box>
		<Box padding="gap">A box content</Box>
		<Box padding="gutter">A box content</Box>
		<Box padding="padding">A box content</Box>

		Box with various paddings without borders:
		<Box border={false} padding={false}>A box content</Box>
		<Box border={false} padding="gap">A box content</Box>
		<Box border={false} padding="gutter">A box content</Box>
		<Box border={false} padding="padding">A box content</Box>


		Box with label and delete action:
		<Box label="Label" actions={<Button square borderRadius="full" distinction="seamless" intent="danger"><TrashIcon /></Button>}>A box content</Box>

		Box with a custom header, content and footer:
		<Box header={<h3>Header</h3>} footer={<Button display="block" distinction="primary">Continue</Button>}>
			Lorem ipsum dolor sit amet
		</Box>

		Box simulating a message input with a send button:
		<Box horizontal focusRing padding="double" align="end">
			<TextareaInput placeholder="Send new message..." minRows={1} maxRows={10} distinction="seamless" />
			<Button>Send <SendHorizontalIcon /></Button>
		</Box>

		<Box horizontal>
			<TextInput placeholder="Start..." />
			<TextInput placeholder="Center..." />
			<TextInput placeholder="End..." />
		</Box>
	</>
)
