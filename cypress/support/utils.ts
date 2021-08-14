
export const forcedPolyfillId = 'Forced-polyfill-input'
export const _forcedPolyfillId = `#${forcedPolyfillId}`

export const cyInput = () => cy.get(_forcedPolyfillId)

export const sendFocus = () => {
	return cyInput().focus().wait(100)
}
