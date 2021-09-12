import { cyInput, hasReturnVal, loadTestPage } from "../support"

describe('Button tests', () => {
	button_1()
	button_2()
	button_3()

	function button_1() {
		it('Button 1', () => {
			loadTestPage().then(() => cy.get('#Forced-polyfill-button-1').click().then(() =>
				cyInput().should('have.value', '07:15 AM').then(hasReturnVal('07:15'))
			))
		})
	}
	function button_2() {
		it('Button 2', () => {
			loadTestPage().then(() => cy.get('#Forced-polyfill-button-2').click().then(() =>
				cyInput().should('have.value', '03:45 PM').then(hasReturnVal('15:45'))
			))
		})
	}
	function button_3() {
		it('Button 3', () => {
			loadTestPage().then(() => cy.get('#Forced-polyfill-button-3').click().then(() =>
				cyInput().should('have.value', '--:-- --').then(hasReturnVal(''))
			))
		})
	}
})