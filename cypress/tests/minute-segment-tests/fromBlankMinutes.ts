import { selectSegment } from "@time-input-polyfill/utils"
import { loadTestPage } from "../../support/loadTestPage"
import { clearAllSegments, cyInput, use } from "../../support/utils"

export function fromBlankMinutes() {
	describe('from blank minutes', () => {
		incrementBlankMinutes()
		decrementBlankMinutes()

		function incrementBlankMinutes() {
			describe('increment blank minutes', () => {
				it('Should increment blank minutes 08:-- PM to 01:30 PM', () => {
					loadTestPage().then(({ $input }) => {
						selectSegment($input, 'minutes')
						cyInput().type('{del}').should('have.value', '08:-- PM')
							.then(() => use.upArrow().should('have.value', '08:00 PM'))
					})
				})

				it('Should increment blank minutes from --:-- -- to --:00 --', () => {
					loadTestPage().then(() => {
						clearAllSegments('minutes').then(() =>
							use.upArrow().should('have.value', '--:00 --')
						)
					})
				})
			})
		}

		function decrementBlankMinutes() {
			describe('decrement blank minutes', () => {
				it('Should decrement blank minutes 08:-- PM to 08:59 PM', () => {
					loadTestPage().then(({ $input }) => {
						selectSegment($input, 'minutes')
						cy.wait(100)
						cyInput().type('{del}').should('have.value', '08:-- PM')
							.then(() => use.downArrow().should('have.value', '08:59 PM'))
					})
				})

				it('Should decrement blank minutes from --:-- -- to --:59 --', () => {
					loadTestPage().then(() => {
						clearAllSegments('minutes')
							.then(() => use.downArrow().should('have.value', '--:59 --'))
					})
				})
			})
		}
	})
}
