import { getCursorSegment, Segment, selectSegment } from "@time-input-polyfill/utils"
import { a11yHasExpectedHtml, a11yInitialHtml, loadTestPage, use } from "../../support"

export function viaArrowKeys() {
	describe('Via Arrow keys', () => {
		it('hours [->] minutes', () => {
			loadTestPage({ segment: 'hrs12' }).then(({ $input }) => {
				use.rightArrow().then(() => {
					const segment = getCursorSegment($input)
					const expectation: Segment = 'minutes'
					expect(segment).to.eq(expectation)
				}).then(a11yHasExpectedHtml(a11yInitialHtml().minutes))
			})
		})
		it('minutes [->] mode', () => {
			loadTestPage({ segment: 'minutes' }).then(({ $input }) => {
				selectSegment($input, 'minutes')
				use.rightArrow().then(() => {
					const segment = getCursorSegment($input)
					const expectation: Segment = 'mode'
					expect(segment).to.eq(expectation)
				}).then(a11yHasExpectedHtml(a11yInitialHtml().mode))
			})
		})
		it('mode [->] mode', () => {
			loadTestPage({ segment: 'mode' }).then(({ $input }) => {
				selectSegment($input, 'mode')
				use.rightArrow().then(() => {
					const segment = getCursorSegment($input)
					const expectation: Segment = 'mode'
					expect(segment).to.eq(expectation)
				}).then(a11yHasExpectedHtml(a11yInitialHtml().mode))
			})
		})
		it('mode [<-] minutes', () => {
			loadTestPage({ segment: 'mode' }).then(({ $input }) => {
				selectSegment($input, 'mode')
				use.leftArrow().then(() => {
					const segment = getCursorSegment($input)
					const expectation: Segment = 'minutes'
					expect(segment).to.eq(expectation)
				}).then(a11yHasExpectedHtml(a11yInitialHtml().minutes))
			})
		})
		it('minutes [<-] hours', () => {
			loadTestPage({ segment: 'minutes' }).then(({ $input }) => {
				selectSegment($input, 'minutes')
				use.leftArrow().then(() => {
					const segment = getCursorSegment($input)
					const expectation: Segment = 'hrs12'
					expect(segment).to.eq(expectation)
				}).then(a11yHasExpectedHtml(a11yInitialHtml().hrs12))
			})
		})
		it('hours [<-] hours', () => {
			loadTestPage({ segment: 'hrs12' }).then(({ $input }) => {
				selectSegment($input, 'hrs12')
				use.leftArrow().then(() => {
					const segment = getCursorSegment($input)
					const expectation: Segment = 'hrs12'
					expect(segment).to.eq(expectation)
				}).then(a11yHasExpectedHtml(a11yInitialHtml().hrs12))
			})
		})
	})
}
