// @ts-check
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
	stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
	core: {
		builder: '@storybook/builder-vite',
	},
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	docs: {
		autodocs: 'tag',
	},
}
export default config
