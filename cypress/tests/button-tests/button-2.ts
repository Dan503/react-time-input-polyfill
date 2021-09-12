import { cyInput, cySelectSegment, hasReturnVal, loadTestPage, use } from "../../support"

export function button_2() {
	it('Button 2', () => {
		loadTestPage().then(() => cy.get('#Forced-polyfill-button-2').click().then(() =>
			cyInput().should('have.value', '03:45 PM').then(hasReturnVal('15:45')).then(() =>
				cySelectSegment('hrs12')
					.then(use.upArrow)
					.should('have.value', '04:45 PM')
					.then(use.downArrow)
					.then(use.downArrow)
					.should('have.value', '02:45 PM')
					.then(use.rightArrow)
					.then(use.upArrow)
					.should('have.value', '02:46 PM')
					.then(use.downArrow)
					.then(use.downArrow)
					.should('have.value', '02:44 PM')
					.then(use.rightArrow)
					.then(use.upArrow)
					.should('have.value', '02:44 AM')
					.then(use.downArrow)
					.should('have.value', '02:44 PM')
					.then(use.del)
					.should('have.value', '02:44 --')
					.then(use.leftArrow)
					.then(use.backspace)
					.should('have.value', '02:-- --')
					.then(use.leftArrow)
					.then(use.del)
					.should('have.value', '--:-- --')
			)
		))
	})
}
