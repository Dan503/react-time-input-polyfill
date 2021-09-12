import { cyInput, cySelectSegment, hasReturnVal, loadTestPage, use } from "../../support"

export function button_1() {
	it('Button 1', () => {
		loadTestPage().then(() => cy.get('#Forced-polyfill-button-1').click().then(() =>
			cyInput().should('have.value', '07:15 AM').then(hasReturnVal('07:15')).then(() =>
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
		))
	})
}