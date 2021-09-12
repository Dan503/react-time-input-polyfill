import { cyInput, cySelectSegment, hasReturnVal, loadTestPage, use } from "../../support"

export function button_3() {
	it('Button 3', () => {
		loadTestPage().then(() => cy.get('#Forced-polyfill-button-3').click().then(() =>
			cyInput().should('have.value', '--:-- --').then(hasReturnVal('')).then(() =>
				cySelectSegment('hrs12')
					.then(use.upArrow)
					.should('have.value', '01:-- --')
					.then(use.downArrow)
					.should('have.value', '12:-- --')
					.then(use.rightArrow)
					.then(use.upArrow)
					.should('have.value', '12:01 --')
					.then(use.downArrow)
					.then(use.downArrow)
					.should('have.value', '12:59 --')
					.then(use.rightArrow)
					.then(use.upArrow)
					.should('have.value', '12:59 AM')
					.then(use.downArrow)
					.should('have.value', '12:59 PM')
					.then(use.del)
					.should('have.value', '12:59 --')
					.then(use.leftArrow)
					.then(use.backspace)
					.should('have.value', '12:-- --')
					.then(use.leftArrow)
					.then(use.del)
					.should('have.value', '--:-- --')
			)
		))
	})
}