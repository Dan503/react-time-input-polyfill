
export const forcedPolyfillId = 'Forced-polyfill-input'
export const _forcedPolyfillId = `#${forcedPolyfillId}`

export const cyInput = () => cy.get(_forcedPolyfillId)

export const sendFocus = () => {
	return cyInput().focus().wait(100)
}

export const use = {
	upArrow: () => cyInput().type('{uparrow}'),
	downArrow: () => cyInput().type('{downarrow}'),
	leftArrow: () => cyInput().type('{leftarrow}'),
	rightArrow: () => cyInput().type('{rightarrow}'),
	tab: () => cyInput().tab(),
	shiftTab: () => cyInput().tab({ shift: true }),
}
