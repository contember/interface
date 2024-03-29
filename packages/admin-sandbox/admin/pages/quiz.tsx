import { Block, DiscriminatedBlocks, MultiEditScope, NumberField, PersistButton, TextField } from '@contember/admin'
import { SlotSources } from '../components/Slots'

export default () => (
	<>
		<SlotSources.Title>Quiz!</SlotSources.Title>

		<MultiEditScope entities="QuizResult" listProps={{
			beforeContent: <SlotSources.Actions><PersistButton /></SlotSources.Actions>,
		}}>
			<TextField label="Answer" field="answer" />
			<DiscriminatedBlocks field={'state'} label={undefined}>
				<Block discriminateBy={'pending'} label={'Pending'} />
				<Block discriminateBy={'failed'} label={'Failed'}>
					<TextField field={'failReason'} label={'Reason'} />
				</Block>
				<Block discriminateBy={'succeed'} label={'Succeed'}>
					<NumberField field={'successRating'} label={'Rating'} />
				</Block>
			</DiscriminatedBlocks>
		</MultiEditScope>
	</>
)
