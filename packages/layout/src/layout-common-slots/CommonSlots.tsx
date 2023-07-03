import { createLayoutSlotComponent, createLayoutSlotTargetComponent } from '../layout-slots'

export const commonSlotTargets = Object.freeze({
	Actions: 'actions',
	Back: 'back',
	Content: 'content',
	Logo: 'logo',
	Navigation: 'navigation',
	Sidebar: 'sidebar',
	Title: 'title',
	Profile: 'profile',
	Switchers: 'switchers',
})

export type CommonSlotsType = Record<keyof typeof commonSlotTargets, ReturnType<typeof createLayoutSlotComponent>>

export const CommonSlots: CommonSlotsType = {
	Actions: createLayoutSlotComponent(commonSlotTargets.Actions, 'Actions'),
	Back: createLayoutSlotComponent(commonSlotTargets.Back, 'Back'),
	Content: createLayoutSlotComponent(commonSlotTargets.Content, 'Content'),
	Logo: createLayoutSlotComponent(commonSlotTargets.Logo, 'Logo'),
	Navigation: createLayoutSlotComponent(commonSlotTargets.Navigation, 'Navigation'),
	Sidebar: createLayoutSlotComponent(commonSlotTargets.Sidebar, 'Sidebar'),
	Title: createLayoutSlotComponent(commonSlotTargets.Title, 'Title'),
	Profile: createLayoutSlotComponent(commonSlotTargets.Profile, 'Profile'),
	Switchers: createLayoutSlotComponent(commonSlotTargets.Switchers, 'Switchers'),
}

export type SlotTargetsType = Record<keyof typeof commonSlotTargets, ReturnType<typeof createLayoutSlotTargetComponent>>

export const CommonSlotTargets: SlotTargetsType = {
	Actions: createLayoutSlotTargetComponent(commonSlotTargets.Actions, 'Actions'),
	Back: createLayoutSlotTargetComponent(commonSlotTargets.Back, 'Back'),
	Content: createLayoutSlotTargetComponent(commonSlotTargets.Content, 'Content'),
	Logo: createLayoutSlotTargetComponent(commonSlotTargets.Logo, 'Logo'),
	Navigation: createLayoutSlotTargetComponent(commonSlotTargets.Navigation, 'Navigation'),
	Sidebar: createLayoutSlotTargetComponent(commonSlotTargets.Sidebar, 'Sidebar'),
	Title: createLayoutSlotTargetComponent(commonSlotTargets.Title, 'Title'),
	Profile: createLayoutSlotTargetComponent(commonSlotTargets.Profile, 'Profile'),
	Switchers: createLayoutSlotTargetComponent(commonSlotTargets.Switchers, 'Switchers'),
}