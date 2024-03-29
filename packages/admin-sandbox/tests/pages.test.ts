import { testInterface } from '@contember/interface-tester'
import schema from '../api'

testInterface({
	schema,
	exclude: [
		'inputs.tsx/JsonField',
		'categories.tsx/CategoryForm',
		'article.tsx/EditOrCreateForm',
		'auto.tsx',
		'brand.tsx',
		'buttons.tsx',
		'actionableBoxes.tsx',
		'boxes.tsx',
		'slots.tsx',
		'chat.tsx',
		'textareas.tsx',
		'fieldContainers.tsx',
		'messages.tsx',
		'lorem.tsx',
		'examples.tsx',
		'settings.tsx',
		'nested/**',
		'random.tsx',
		'tenant**',
	],
	pagesDir: 'admin/pages',
	pages: {
		'**/{edit.tsx,edit}': {
			parameters: {
				id: '4e68a6dd-6106-4306-8344-2aa5549e6b45',
			},
		},
	},
})
