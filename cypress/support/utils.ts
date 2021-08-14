import { Segment } from "@time-input-polyfill/utils"

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

export const clearAllSegments = (segmentToEndOn: Segment) => {
	const clearSegments = () => cyInput().focus().type('{del}').should('have.value', '--:30 PM')
		.then(() => use.rightArrow())
		.then(() => cyInput().type('{del}').should('have.value', '--:-- PM'))
		.then(() => use.rightArrow())
		.then(() => cyInput().type('{del}').should('have.value', '--:-- --'))

	if (segmentToEndOn === 'mode') {
		return clearSegments()
	}
	if (segmentToEndOn === 'minutes') {
		return clearSegments()
			.then(() => use.leftArrow())
	}

	return clearSegments()
		.then(() => use.leftArrow())
		.then(() => use.leftArrow())
}
