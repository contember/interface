import { Button, EditScope, PersistButton, useEntity } from '@contember/admin'
import { AddContent } from '../components/AddContent'
import { ContentField } from '../components/ContentField'
import { Title } from '../components/Directives'
import { SlotSources } from '../components/Slots'

const DeleteBlocks = () => {
	const entity = useEntity()
	return <Button onClick={() => {
		Array.from(entity.getEntityList('content.blocks')).forEach(it => {
			it.getField('json').updateValue(JSON.stringify({
				'formatVersion': 1,
				'children': [{ 'type': 'paragraph', 'children': [{ text: '' }] }],
			}))
		})
		setTimeout(() => {
			entity.getEntityList('content.blocks').deleteAll()
		}, 10)

	}}>delete all</Button>
}

export default (
	<EditScope entity="Homepage(unique = One)" setOnCreate="(unique = One)">
		<Title>Home Page</Title>

		<SlotSources.Content>
			<ContentField field="content" />
			<AddContent field="content" />
			<DeleteBlocks />
		</SlotSources.Content>

		<SlotSources.HeaderActions>
			<PersistButton />
		</SlotSources.HeaderActions>
	</EditScope>
)
