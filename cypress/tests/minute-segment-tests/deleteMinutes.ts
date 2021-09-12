import { a11yHasExpectedHtml, hasReturnVal, loadTestPage, use } from "../../support"

export function deleteMinutes() {
	describe('Delete minutes', () => {
		it('Should clear minutes on delete key press', () => {
			loadTestPage({ segment: 'minutes' })
				.then(use.del)
				.should('have.value', '08:-- PM')
				.then(a11yHasExpectedHtml(`<p>blank.</p>`))
				.then(hasReturnVal(''))
		})
		it('Should clear minutes on backspace key press', () => {
			loadTestPage({ segment: 'minutes' })
				.then(use.backspace)
				.should('have.value', '08:-- PM')
				.then(a11yHasExpectedHtml(`<p>blank.</p>`))
				.then(hasReturnVal(''))
		})
	})
}
