import { a11yHasExpectedHtml, hasReturnVal, loadTestPage, use } from "../../support"

export function incrementHours() {
	it('Should increment hours as expected on up key press', () => {
		loadTestPage({ segment: 'hrs12' }).then(() => {
			use.upArrow().should('have.value', '09:30 PM').then(a11yHasExpectedHtml('<p>9.</p>')).then(hasReturnVal('21:30'))
			use.upArrow().should('have.value', '10:30 PM').then(a11yHasExpectedHtml('<p>10.</p>')).then(hasReturnVal('22:30'))
			use.upArrow().should('have.value', '11:30 PM').then(a11yHasExpectedHtml('<p>11.</p>')).then(hasReturnVal('23:30'))
			use.upArrow().should('have.value', '12:30 PM').then(a11yHasExpectedHtml('<p>12.</p>')).then(hasReturnVal('12:30'))
			let i = 1
			while (i < 10) {
				use.upArrow().should('have.value', `0${i}:30 PM`).then(a11yHasExpectedHtml(`<p>${i}.</p>`)).then(hasReturnVal(`${i + 12}:30`))
				i++
			}
		})
	})
}
