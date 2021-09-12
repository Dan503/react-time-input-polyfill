import { loadTestPage } from "../../support/loadTestPage"
import { a11yHasExpectedHtml, use, hasReturnVal } from "../../support/utils"

export function deleteHours() {
	describe('delete hours', () => {
		it('Should clear hours on delete key press', () => {
			loadTestPage({ segment: 'hrs12' })
				.then(use.del)
				.should('have.value', '--:30 PM')
				.then(a11yHasExpectedHtml(`<p>blank.</p>`))
				.then(hasReturnVal(''))
		})
		it('Should clear hours on backspace key press', () => {
			loadTestPage({ segment: 'hrs12' })
				.then(use.backspace)
				.should('have.value', '--:30 PM')
				.then(a11yHasExpectedHtml(`<p>blank.</p>`))
				.then(hasReturnVal(''))
		})
	})
}