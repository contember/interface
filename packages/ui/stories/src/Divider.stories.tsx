import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { Divider } from '../../src'
import { Block, DirectionStack } from './Helpers'

export default {
	title: 'Layout/Divider',
	component: Divider,
} as ComponentMeta<typeof Divider>

const Template: ComponentStory<typeof Divider> = args => <DirectionStack>
	<Block />
	<Divider {...args} />
	<Block />
	<Divider {...args} />
	<Block />
	<Divider {...args} />
	<Block />
	<Divider {...args} />
	<Block />
</DirectionStack>

export const Default = Template.bind({})

Default.args = {
}
