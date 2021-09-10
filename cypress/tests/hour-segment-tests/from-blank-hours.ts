import { selectSegment } from "@time-input-polyfill/utils"
import { loadTestPage } from "../../support/loadTestPage"
import { clearAllSegments, cyInput, use, a11yHasExpectedHtml } from "../../support/utils"

export function fromBlankHours() {
	describe('from blank hours', () => {
		incrementBlankHours()
		decrementBlankHours()

		function incrementBlankHours() {
			describe('increment blank hours', () => {
				it('Should increment blank hours --:30 PM to 01:30 PM', () => {
					loadTestPage({ segment: 'hrs12' }).then(() => {
						cyInput().type('{del}').should('have.value', '--:30 PM')
							.then(() => use.upArrow().should('have.value', '01:30 PM')).then(a11yHasExpectedHtml(`<p>1.</p>`))
					})
				})

				it('Should increment blank hours from --:-- -- to 01:-- --', () => {
					loadTestPage({ segment: 'hrs12' }).then(() => {
						clearAllSegments('hrs12').then(() =>
							use.upArrow().should('have.value', '01:-- --').then(a11yHasExpectedHtml(`<p>1.</p>`))
						)
					})
				})
			})
		}

		function decrementBlankHours() {
			describe('decrement blank hours', () => {
				it('Should decrement blank hours --:30 PM to 12:30 PM', () => {
					loadTestPage({ segment: 'hrs12' }).then(({ $input }) => {
						selectSegment($input, 'hrs12')
						cy.wait(100)
						cyInput().type('{del}').should('have.value', '--:30 PM')
							.then(() => use.downArrow().should('have.value', '12:30 PM')).then(a11yHasExpectedHtml(`<p>12.</p>`))
					})
				})

				it('Should decrement blank hours from --:-- -- to 12:-- --', () => {
					loadTestPage({ segment: 'hrs12' }).then(() => {
						clearAllSegments('hrs12')
							.then(() => use.downArrow().should('have.value', '12:-- --')).then(a11yHasExpectedHtml(`<p>12.</p>`))
					})
				})
			})
		}
	})
}
