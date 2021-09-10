import { loadTestPage } from "../../support/loadTestPage"
import { cyInput, a11yHasExpectedHtml } from "../../support/utils"

export function deleteHours() {
	describe('delete hours', () => {
		it('Should clear hours on delete key press', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cyInput().type('{del}').should('have.value', '--:30 PM').then(a11yHasExpectedHtml(`<p>blank.</p>`))
			})
		})
		it('Should clear hours on backspace key press', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cyInput().type('{backspace}').should('have.value', '--:30 PM').then(a11yHasExpectedHtml(`<p>blank.</p>`))
			})
		})
	})
}