import { a11yHasExpectedHtml, cyInput, loadTestPage, use } from "../../support"

export const toggleModeFromBlank = () => {
	describe('BLANK mode toggle', () => {
		it('UP from blank mode', () => {
			loadTestPage({ segment: 'mode' }).then(() => {
				cyInput()
					.type('{del}')
					.then(use.upArrow)
					.should('have.value', '08:30 AM')
					.then(a11yHasExpectedHtml(`<p>AM.</p>`))
			})
		})
		it('DOWN from blank mode', () => {
			loadTestPage({ segment: 'mode' }).then(() => {
				cyInput()
					.type('{del}')
					.then(use.downArrow)
					.should('have.value', '08:30 PM')
					.then(a11yHasExpectedHtml(`<p>PM.</p>`))
			})
		})
	})
}
