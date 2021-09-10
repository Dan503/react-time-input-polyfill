import { getCursorSegment, Segment } from "@time-input-polyfill/utils"
import { $input, a11yHasExpectedHtml, a11yInitialHtml, loadTestPage, use } from "../../support"

export function viaArrowKeys() {
	describe('Via Arrow keys', () => {
		it('hours [->] minutes', () => {
			loadTestPage({ segment: 'hrs12' })
				.then(use.rightArrow)
				.then((jQueryInputElem) => {
					const segment = getCursorSegment($input(jQueryInputElem))
					const expectation: Segment = 'minutes'
					expect(segment).to.eq(expectation)
					return jQueryInputElem
				})
				.then(a11yHasExpectedHtml(a11yInitialHtml().minutes))

		})
		it('minutes [->] mode', () => {
			loadTestPage({ segment: 'minutes' })
				.then(use.rightArrow)
				.then((jQueryInputElem) => {
					const segment = getCursorSegment($input(jQueryInputElem))
					const expectation: Segment = 'mode'
					expect(segment).to.eq(expectation)
					return jQueryInputElem
				})
				.then(a11yHasExpectedHtml(a11yInitialHtml().mode))
		})
		it('mode [->] mode', () => {
			loadTestPage({ segment: 'mode' })
				.then(use.rightArrow)
				.then((jQueryInputElem) => {
					const segment = getCursorSegment($input(jQueryInputElem))
					const expectation: Segment = 'mode'
					expect(segment).to.eq(expectation)
					return jQueryInputElem
				})
				.then(a11yHasExpectedHtml(a11yInitialHtml().mode))
		})
		it('mode [<-] minutes', () => {
			loadTestPage({ segment: 'mode' })
				.then(use.leftArrow)
				.then((jQueryInputElem) => {
					const segment = getCursorSegment($input(jQueryInputElem))
					const expectation: Segment = 'minutes'
					expect(segment).to.eq(expectation)
					return jQueryInputElem
				})
				.then(a11yHasExpectedHtml(a11yInitialHtml().minutes))
		})
		it('minutes [<-] hours', () => {
			loadTestPage({ segment: 'minutes' })
				.then(use.leftArrow)
				.then((jQueryInputElem) => {
					const segment = getCursorSegment($input(jQueryInputElem))
					const expectation: Segment = 'hrs12'
					expect(segment).to.eq(expectation)
					return jQueryInputElem
				})
				.then(a11yHasExpectedHtml(a11yInitialHtml().hrs12))
		})
		it('hours [<-] hours', () => {
			loadTestPage({ segment: 'hrs12' })
				.then(use.leftArrow)
				.then((jQueryInputElem) => {
					const segment = getCursorSegment($input(jQueryInputElem))
					const expectation: Segment = 'hrs12'
					expect(segment).to.eq(expectation)
					return jQueryInputElem
				})
				.then(a11yHasExpectedHtml(a11yInitialHtml().hrs12))
		})
	})
}
