import { Segment, toLeadingZero } from "@time-input-polyfill/utils"

export const forcedPolyfillId = 'Polyfill-demo-input'
export const _forcedPolyfillId = `#${forcedPolyfillId}`

export const a11yId = 'time-input-polyfill-accessibility-block'
export const _a11yId = `#${a11yId}`

export const cyInput = () => cy.get(_forcedPolyfillId)
export const cyA11y = () => cy.get(_a11yId)
export const $input = (jQueryInput: JQuery<HTMLElement>) => jQueryInput[0] as HTMLInputElement

export const hasReturnVal = (expectation: string) => () => cy.get('#Polyfill-demo-return-value').wait(10).should('have.text', expectation).then(cyInput)

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
		focus: `<p>Polyfill demo grouping ${toLeadingZero(value || 8)}:30 PM.</p>` + hrs12
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
	upArrow: () => cyInput().trigger('keydown', { key: 'ArrowUp' }).trigger('keyup', { key: 'ArrowUp' }).wait(10),
	downArrow: () => cyInput().trigger('keydown', { key: 'ArrowDown' }).trigger('keyup', { key: 'ArrowDown' }).wait(10),
	leftArrow: () => cyInput().trigger('keydown', { key: 'ArrowLeft' }).trigger('keyup', { key: 'ArrowLeft' }).wait(10),
	rightArrow: () => cyInput().trigger('keydown', { key: 'ArrowRight' }).trigger('keyup', { key: 'ArrowRight' }).wait(10),
	tab: () => cyInput().tab(),
	shiftTab: () => cyInput().tab({ shift: true }),
	del: () => cyInput().trigger('keydown', { key: 'Delete' }).trigger('keyup', { key: 'Delete' }).wait(10),
	backspace: () => cyInput().trigger('keydown', { key: 'Backspace' }).trigger('keyup', { key: 'Backspace' }).wait(10)
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
