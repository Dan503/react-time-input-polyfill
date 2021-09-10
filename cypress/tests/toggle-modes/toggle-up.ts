import { a11yHasExpectedHtml, loadTestPage, use } from "../../support"

export const toggleModeUp = () => {
	describe('UP mode toggle', () => {
		it('UP Updates mode correctly', () => {
			loadTestPage({ segment: 'mode' }).then(() => {
				use.upArrow().should('have.value', '08:30 AM').then(a11yHasExpectedHtml(`<p>AM.</p>`))
			})
		})
		it('UP UP Updates mode correctly', () => {
			loadTestPage({ segment: 'mode' }).then(() => {
				use.upArrow().then(use.upArrow).should('have.value', '08:30 PM').then(a11yHasExpectedHtml(`<p>PM.</p>`))
			})
		})
	})
}
