import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { Stack, StackOwnProps, StackProps } from '../../src'
import { Block, booleanControl, disabledControlsForAttributes } from './Helpers'

export default {
	title: 'Layout/Stack',
	component: Stack,
	argTypes: {
		...disabledControlsForAttributes<typeof Stack>('children'),
		evenly: booleanControl(false),
		wrap: booleanControl(false),
	},
} as ComponentMeta<typeof Stack>

const Template: ComponentStory<typeof Stack> = (args: StackProps) => <Stack {...args}>
	{args.children ?? <>
		<Block />
		<Block />
		<Block>Lorem ipsum</Block>
		<Block />
		<Block />
	</>}
</Stack>

export const Default = Template.bind({})

Default.args = {
}

export const Many_children = Template.bind({})

Many_children.args = {
	children: <>
		<Block />
		<Block />
		<Block />
		<Block>Lorem ipsum</Block>
		<Block />
		<Block />
		<Block />
		<Block />
		<Block />
		<Block />
		<Block />
		<Block />
	</>,
}
