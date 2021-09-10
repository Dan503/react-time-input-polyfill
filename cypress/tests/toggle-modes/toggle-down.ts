import { a11yHasExpectedHtml, loadTestPage, use } from "../../support"

export const toggleModeDown = () => {
	describe('DOWN mode toggle', () => {
		it('DOWN Updates mode correctly', () => {
			loadTestPage({ segment: 'mode' })
				.then(use.downArrow)
				.should('have.value', '08:30 AM')
				.then(a11yHasExpectedHtml(`<p>AM.</p>`))
		})
		it('DOWN DOWN Updates mode correctly', () => {
			loadTestPage({ segment: 'mode' })
				.then(use.downArrow)
				.then(use.downArrow)
				.should('have.value', '08:30 PM')
				.then(a11yHasExpectedHtml(`<p>PM.</p>`))
		})
		it('DOWN UP Updates mode correctly', () => {
			loadTestPage({ segment: 'mode' })
				.then(use.downArrow)
				.then(use.upArrow)
				.should('have.value', '08:30 PM')
				.then(a11yHasExpectedHtml(`<p>PM.</p>`))
		})
	})
}
