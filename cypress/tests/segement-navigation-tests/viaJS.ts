import { getCursorSegment, Segment } from "@time-input-polyfill/utils"
import { $input, a11yHasExpectedHtml, a11yInitialHtml, cyInput, loadTestPage } from "../../support"

export function viaJS() {
	describe('Via JS', () => {
		it('Should send focus to hours segment', () => {
			loadTestPage()
				.focus()
				.wait(100)
				.then((jQueryInputElem) => {
					const segment = getCursorSegment($input(jQueryInputElem))
					const expectation: Segment = 'hrs12'
					expect(segment).to.eq(expectation)
					return jQueryInputElem
				})
				.blur()
				.focus()
				.then(a11yHasExpectedHtml(a11yInitialHtml().focus))
		})
	})
}
