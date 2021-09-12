import { a11yHasExpectedHtml, hasReturnVal, loadTestPage, use } from "../../support"

export const toggleModeDown = () => {
	describe('DOWN mode toggle', () => {
		it('DOWN Updates mode correctly', () => {
			loadTestPage({ segment: 'mode' })
				.then(use.downArrow)
				.should('have.value', '08:30 AM')
				.then(a11yHasExpectedHtml(`<p>AM.</p>`))
				.then(hasReturnVal('08:30'))
		})
		it('DOWN DOWN Updates mode correctly', () => {
			loadTestPage({ segment: 'mode' })
				.then(use.downArrow)
				.then(use.downArrow)
				.should('have.value', '08:30 PM')
				.then(a11yHasExpectedHtml(`<p>PM.</p>`))
				.then(hasReturnVal('20:30'))
		})
		it('DOWN UP Updates mode correctly', () => {
			loadTestPage({ segment: 'mode' })
				.then(use.downArrow)
				.then(use.upArrow)
				.should('have.value', '08:30 PM')
				.then(a11yHasExpectedHtml(`<p>PM.</p>`))
				.then(hasReturnVal('20:30'))
		})
	})
}
