import { a11yHasExpectedHtml, hasReturnVal, loadTestPage, use } from "../../support"

export const toggleModeUp = () => {
	describe('UP mode toggle', () => {
		it('UP Updates mode correctly', () => {
			loadTestPage({ segment: 'mode' })
				.then(use.upArrow)
				.should('have.value', '08:30 AM')
				.then(a11yHasExpectedHtml(`<p>AM.</p>`))
				.then(hasReturnVal('08:30'))
		})
		it('UP UP Updates mode correctly', () => {
			loadTestPage({ segment: 'mode' })
				.then(use.upArrow)
				.then(use.upArrow)
				.should('have.value', '08:30 PM')
				.then(a11yHasExpectedHtml(`<p>PM.</p>`))
				.then(hasReturnVal('20:30'))
		})
		it('UP DOWN Updates mode correctly', () => {
			loadTestPage({ segment: 'mode' })
				.then(use.upArrow)
				.then(use.upArrow)
				.should('have.value', '08:30 PM')
				.then(a11yHasExpectedHtml(`<p>PM.</p>`))
				.then(hasReturnVal('20:30'))
		})
	})
}
