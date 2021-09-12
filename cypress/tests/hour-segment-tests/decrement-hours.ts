import { toLeadingZero } from "@time-input-polyfill/utils"
import { a11yHasExpectedHtml, hasReturnVal, loadTestPage, use } from "../../support"

export function decrementHours() {
	it('Should decrement hours as expected on down key press', () => {
		loadTestPage({ segment: 'hrs12' }).then(() => {
			let a = 7
			while (a > 0) {
				use.downArrow().should('have.value', `0${a}:30 PM`).then(a11yHasExpectedHtml(`<p>${a}.</p>`)).then(hasReturnVal(`${a + 12}:30`))
				a--
			}

			use.downArrow().should('have.value', `12:30 PM`).then(a11yHasExpectedHtml(`<p>12.</p>`)).then(hasReturnVal(`12:30`))

			let b = 11
			while (b > 7) {
				use.downArrow().should('have.value', `${toLeadingZero(b)}:30 PM`).then(a11yHasExpectedHtml(`<p>${b}.</p>`)).then(hasReturnVal(`${b + 12}:30`))
				b--
			}
		})
	})
}
