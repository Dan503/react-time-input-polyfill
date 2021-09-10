import { getCursorSegment, Segment } from "@time-input-polyfill/utils"
import { loadTestPage, use, $input } from "../../support"

export function viaTabKey() {
	describe('Via Tab key', () => {
		it('hours [tab] minutes', () => {
			loadTestPage({ segment: 'hrs12' })
				.then(use.tab)
				.should('have.focus')
				.then((jQueryInputElem) => {
					const segment = getCursorSegment($input(jQueryInputElem))
					const expectation: Segment = 'minutes'
					expect(segment).to.eq(expectation)
					return jQueryInputElem
				})
		})
		it('minutes [tab] mode', () => {
			loadTestPage({ segment: 'minutes' })
				.then(use.tab)
				.should('have.focus')
				.then((jQueryInputElem) => {
					const segment = getCursorSegment($input(jQueryInputElem))
					const expectation: Segment = 'mode'
					expect(segment).to.eq(expectation)
					return jQueryInputElem
				})
		})
		it('mode [tab] off', () => {
			loadTestPage({ segment: 'mode' })
				.then(use.tab)
				.should('not.have.focus')
		})
		it('mode [shift + tab] minutes', () => {
			loadTestPage({ segment: 'mode' })
				.then(use.shiftTab)
				.should('have.focus')
				.then((jQueryInputElem) => {
					const segment = getCursorSegment($input(jQueryInputElem))
					const expectation: Segment = 'minutes'
					expect(segment).to.eq(expectation)
					return jQueryInputElem
				})
		})
		it('minutes [shift + tab] hours', () => {
			loadTestPage({ segment: 'minutes' })
				.then(use.shiftTab)
				.should('have.focus')
				.then((jQueryInputElem) => {
					const segment = getCursorSegment($input(jQueryInputElem))
					const expectation: Segment = 'hrs12'
					expect(segment).to.eq(expectation)
					return jQueryInputElem
				})
		})
		it('hours [shift + tab] off', () => {
			loadTestPage({ segment: 'hrs12' })
				.then(use.shiftTab)
				.should('not.have.focus')
		})
	})
}