import { SchemaDefinition as def } from '@contember/schema-definition'
import { expect, test } from '@playwright/test'
import { expectNoConsoleErrors, initContemberProject } from '../utils'

namespace Model {
	export class Dummy {
		dummy = def.stringColumn()
	}
}

let projectSlug: string

test.beforeAll(async ({ }, testInfo) => {
	projectSlug = await initContemberProject(testInfo, Model)
})

test('basic test', async ({ page, userAgent }) => {
	test.skip(!!userAgent?.match(/\biPhone|iPad\b/), 'Unstable test on iPhone')

	expectNoConsoleErrors(page)

	await page.goto(`/${projectSlug}/fieldContainer`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('initial.png')
})
