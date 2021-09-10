import { getCursorSegment, Segment } from "@time-input-polyfill/utils"
import { a11yHasExpectedHtml, a11yInitialHtml, cyInput, loadTestPage, sendFocus } from "../../support"

export function viaJS() {
	describe('Via JS', () => {
		it('Should send focus to hours segment', () => {
			loadTestPage({ segment: 'mode' }).then(({ $input }) => {
				cyInput().focus().then(() => {
					const segment = getCursorSegment($input)
					const expectation: Segment = 'hrs12'
					expect(segment).to.eq(expectation)
				})
			})
		})
		it('reads label, then time, then hours', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cyInput().focus().then(a11yHasExpectedHtml(a11yInitialHtml().focus))
			})
		})
	})
}
