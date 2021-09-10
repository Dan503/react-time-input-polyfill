import { Segment } from "@time-input-polyfill/utils"

export const forcedPolyfillId = 'Forced-polyfill-input'
export const _forcedPolyfillId = `#${forcedPolyfillId}`

export const a11yId = 'time-input-polyfill-accessibility-block'
export const _a11yId = `#${a11yId}`

export const cyInput = () => cy.get(_forcedPolyfillId)
export const cyA11y = () => cy.get(_a11yId)

export const a11yHasExpectedHtml = (expectedHtml: string) => () => cyA11y().should('have.html', expectedHtml)

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

export const cySelectSegment = (segmentToEndOn: Segment) => {
	const inputSelection = sendFocus()

	const targets = {
		hrs12: () => inputSelection,
		minutes: () => inputSelection.then(use.rightArrow),
		mode: () => inputSelection.then(use.rightArrow).then(use.rightArrow),
	}

	return targets[segmentToEndOn]().wait(100)
}

export const clearAllSegments = (segmentToEndOn: Segment) => {
	return cyInput().focus().type('{del}').should('have.value', '--:30 PM')
		.then(() => use.rightArrow())
		.then(() => cyInput().type('{del}').should('have.value', '--:-- PM'))
		.then(() => use.rightArrow())
		.then(() => cyInput().type('{del}').should('have.value', '--:-- --'))
		.then(() => cyInput().blur())
		.then(() => cySelectSegment(segmentToEndOn))
}
