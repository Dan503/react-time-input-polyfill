import { a11yHasExpectedHtml, loadTestPage, use } from "../../support"

export function incrementHours() {
	it('Should increment hours as expected on up key press', () => {
		loadTestPage({ segment: 'hrs12' }).then(() => {
			use.upArrow().should('have.value', '09:30 PM').then(a11yHasExpectedHtml('<p>9.</p>'))
			use.upArrow().should('have.value', '10:30 PM').then(a11yHasExpectedHtml('<p>10.</p>'))
			use.upArrow().should('have.value', '11:30 PM').then(a11yHasExpectedHtml('<p>11.</p>'))
			use.upArrow().should('have.value', '12:30 PM').then(a11yHasExpectedHtml('<p>12.</p>'))
			let i = 1
			while (i < 10) {
				use.upArrow().should('have.value', `0${i}:30 PM`).then(a11yHasExpectedHtml(`<p>${i}.</p>`))
				i++
			}
		})
	})
}
