import { cyInput, cySelectSegment, hasReturnVal, loadTestPage, use } from "../../support"

const clickBtn1 = () => cy.get('#Forced-polyfill-button-1').click().wait(10).then(cyInput)

export function button_1() {
	describe('Button 1 - "07:15 AM"', () => {
		it('Arrow key functions', () => {
			loadTestPage()
				.then(clickBtn1)
				.should('have.value', '07:15 AM')
				.then(hasReturnVal('07:15'))
				.then(() =>
					// Need to make sure the basic functions still work after clicking a button
					cySelectSegment('hrs12')
						.then(use.upArrow)
						.should('have.value', '08:15 AM')
						.then(use.downArrow)
						.then(use.downArrow)
						.should('have.value', '06:15 AM')
						.then(use.rightArrow)
						.then(use.upArrow)
						.should('have.value', '06:16 AM')
						.then(use.downArrow)
						.then(use.downArrow)
						.should('have.value', '06:14 AM')
						.then(use.rightArrow)
						.then(use.upArrow)
						.should('have.value', '06:14 PM')
						.then(use.downArrow)
						.should('have.value', '06:14 AM')
						.then(use.del)
						.should('have.value', '06:14 --')
						.then(use.leftArrow)
						.then(use.backspace)
						.should('have.value', '06:-- --')
						.then(use.leftArrow)
						.then(use.del)
						.should('have.value', '--:-- --')
				)
		})
		it('Can press button twice', () => {
			loadTestPage()
				.then(clickBtn1)
				.should('have.value', '07:15 AM')
				.then(hasReturnVal('07:15'))
				.then(() =>
					// Need to make sure the basic functions still work after clicking a button
					cySelectSegment('hrs12')
						.then(use.upArrow)
						.should('have.value', '08:15 AM')
						.then(use.rightArrow)
						.then(use.upArrow)
						.should('have.value', '08:16 AM')
						.then(use.rightArrow)
						.then(use.upArrow)
						.should('have.value', '08:16 PM')
						.then(clickBtn1)
						.should('have.value', '07:15 AM')
				)
		})
	})
}