import { getCursorSegment, Segment, selectSegment } from "@time-input-polyfill/utils"
import { loadTestPage, cyInput, use } from "../../support"

export function viaTabKey() {
	describe('Via Tab key', () => {
		it('hours [tab] minutes', () => {
			loadTestPage({ segment: 'hrs12' }).then(({ $input }) => {
				use.tab().then(() => {
					const segment = getCursorSegment($input)
					const expectation: Segment = 'minutes'
					cyInput().should('have.focus')
					expect(segment).to.eq(expectation)
				})
			})
		})
		it('minutes [tab] mode', () => {
			loadTestPage({ segment: 'minutes' }).then(({ $input }) => {
				use.tab().then(() => {
					const segment = getCursorSegment($input)
					const expectation: Segment = 'mode'
					cyInput().should('have.focus')
					expect(segment).to.eq(expectation)
				})
			})
		})
		it('mode [tab] off', () => {
			loadTestPage({ segment: 'mode' }).then(({ $input }) => {
				use.tab().then(() => {
					cyInput().should('not.have.focus')
				})
			})
		})
		it('mode [shift + tab] minutes', () => {
			loadTestPage({ segment: 'mode' }).then(({ $input }) => {
				selectSegment($input, 'mode')
				use.shiftTab().then(() => {
					const segment = getCursorSegment($input)
					const expectation: Segment = 'minutes'
					cyInput().should('have.focus')
					expect(segment).to.eq(expectation)
				})
			})
		})
		it('minutes [shift + tab] hours', () => {
			loadTestPage({ segment: 'minutes' }).then(({ $input }) => {
				selectSegment($input, 'minutes')
				use.shiftTab().then(() => {
					const segment = getCursorSegment($input)
					const expectation: Segment = 'hrs12'
					cyInput().should('have.focus')
					expect(segment).to.eq(expectation)
				})
			})
		})
		it('hours [shift + tab] off', () => {
			loadTestPage({ segment: 'hrs12' }).then(({ $input }) => {
				selectSegment($input, 'hrs12')
				use.shiftTab().then(() => {
					cyInput().should('not.have.focus')
				})
			})
		})
	})
}