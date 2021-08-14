import { selectSegment } from "@time-input-polyfill/utils"
import { loadTestPage } from "../../support/loadTestPage"
import { clearAllSegments, cyInput, use } from "../../support/utils"

export function fromBlankHours() {
	describe('from blank hours', () => {
		incrementBlankHours()
		decrementBlankHours()

		function incrementBlankHours() {
			describe('increment blank hours', () => {
				it('Should increment blank hours --:30 PM to 01:30 PM', () => {
					loadTestPage().then(({ $input }) => {
						selectSegment($input, 'hrs12')
						cyInput().type('{del}').should('have.value', '--:30 PM')
							.then(() => use.upArrow().should('have.value', '01:30 PM'))
					})
				})

				it('Should increment blank hours from --:-- -- to 01:-- --', () => {
					loadTestPage().then(() => {
						clearAllSegments('hrs12').then(() =>
							use.upArrow().should('have.value', '01:-- --')
						)
					})
				})
			})
		}

		function decrementBlankHours() {
			describe('decrement blank hours', () => {
				it('Should decrement blank hours --:30 PM to 12:30 PM', () => {
					loadTestPage().then(({ $input }) => {
						selectSegment($input, 'hrs12')
						cy.wait(100)
						cyInput().type('{del}').should('have.value', '--:30 PM')
							.then(() => use.downArrow().should('have.value', '12:30 PM'))
					})
				})

				it('Should decrement blank hours from --:-- -- to 12:-- --', () => {
					loadTestPage().then(() => {
						clearAllSegments('hrs12')
							.then(() => use.downArrow().should('have.value', '12:-- --'))
					})
				})
			})
		}
	})
}
