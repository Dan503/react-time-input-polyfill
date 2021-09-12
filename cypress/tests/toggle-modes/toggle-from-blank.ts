import { a11yHasExpectedHtml, hasReturnVal, loadTestPage, use } from "../../support"

export const toggleModeFromBlank = () => {
	describe('BLANK mode toggle', () => {
		it('UP from blank mode', () => {
			loadTestPage({ segment: 'mode' })
				.then(use.del)
				.then(use.upArrow)
				.should('have.value', '08:30 AM')
				.then(a11yHasExpectedHtml(`<p>AM.</p>`))
				.then(hasReturnVal('08:30'))
		})
		it('DOWN from blank mode', () => {
			loadTestPage({ segment: 'mode' })
				.then(use.del)
				.then(use.downArrow)
				.should('have.value', '08:30 PM')
				.then(a11yHasExpectedHtml(`<p>PM.</p>`))
				.then(hasReturnVal('20:30'))
		})
	})
}
