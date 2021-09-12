import { Segment } from "@time-input-polyfill/utils"

export const forcedPolyfillId = 'Forced-polyfill-input'
export const _forcedPolyfillId = `#${forcedPolyfillId}`

export const a11yId = 'time-input-polyfill-accessibility-block'
export const _a11yId = `#${a11yId}`

export const cyInput = () => cy.get(_forcedPolyfillId)
export const cyA11y = () => cy.get(_a11yId)
export const $input = (jQueryInput: JQuery<HTMLElement>) => jQueryInput[0] as HTMLInputElement

export const hasReturnVal = (expectation: string) => () => cy.get('#Forced-polyfill-return-value').wait(10).should('have.text', expectation)

interface A11yInitialHtmlReturn {
	hrs12: string
	minutes: string,
	mode: string,
	focus: string
}

export const a11yInitialHtml = (value?: number | string): A11yInitialHtmlReturn => {
	const hrs12 = `<p>Hours spin button ${value || 8}.</p>`
	return ({
		hrs12,
		minutes: `<p>Minutes spin button ${value || 30}.</p>`,
		mode: `<p>AM/PM spin button ${value || 'PM'}.</p>`,
		focus: '<p>Forced polyfill time input grouping 08:30 PM.</p>' + hrs12
	})
}

export const a11yHasExpectedHtml = (expectedHtml: string) => () => cyA11y().wait(10).should('have.html', expectedHtml).then(cyInput)

export const sendFocus = () => {
	return cyInput().focus().wait(100)
}

export const setTime = (string12hr: string, finishingSegment: Segment = 'hrs12') => {
	const regex = /(\d\d):(\d\d) ([AP]M)/i
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_match, hrs12, minutes, mode] = regex.exec(string12hr) || []
	const inputSelection = cySelectSegment('hrs12').type(`${hrs12}${minutes}${mode}`)

	const targets = {
		hrs12: () => inputSelection.then(use.leftArrow).then(use.leftArrow),
		minutes: () => inputSelection.then(use.leftArrow),
		mode: () => inputSelection,
	}

	return targets[finishingSegment]()
}

export const use = {
	upArrow: () => cyInput().type('{uparrow}'),
	downArrow: () => cyInput().type('{downarrow}'),
	leftArrow: () => cyInput().type('{leftarrow}'),
	rightArrow: () => cyInput().type('{rightarrow}'),
	tab: () => cyInput().tab(),
	shiftTab: () => cyInput().tab({ shift: true }),
	del: () => cyInput().type('{del}').wait(10),
	backspace: () => cyInput().type('{backspace}').wait(10)
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
