import { a11yHasExpectedHtml, cyInput, loadTestPage } from "../../support"

export function deleteMinutes() {
	describe('Delete minutes', () => {
		it('Should clear minutes on delete key press', () => {
			loadTestPage({ segment: 'minutes' }).then(() => {
				cyInput().type('{del}').wait(10).should('have.value', '08:-- PM').then(a11yHasExpectedHtml(`<p>blank.</p>`))
			})
		})
		it('Should clear minutes on backspace key press', () => {
			loadTestPage({ segment: 'minutes' }).then(() => {
				cyInput().type('{backspace}').wait(10).should('have.value', '08:-- PM').then(a11yHasExpectedHtml(`<p>blank.</p>`))
			})
		})
	})
}