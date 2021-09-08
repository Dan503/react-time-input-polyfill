import { getCursorSegment, Segment } from "@time-input-polyfill/utils"
import { loadTestPage, sendFocus } from "../../support"

export function viaJS() {
	describe('Via JS', () => {
		it('Should send focus to hours segment', () => {
			loadTestPage({ segment: 'mode' }).then(({ $input }) => {
				$input.blur()
				sendFocus().then(() => {
					const segment = getCursorSegment($input)
					const expectation: Segment = 'hrs12'
					expect(segment).to.eq(expectation)
				})
			})
		})
	})
}
