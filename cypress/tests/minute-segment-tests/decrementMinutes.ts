import { toLeadingZero } from "@time-input-polyfill/utils"
import { a11yHasExpectedHtml, cyInput, loadTestPage, use } from "../../support"

export function decrementMinutes() {
	it('Should decrement as expected on down key press', () => {
		loadTestPage({ segment: 'minutes' }).then(() => {
			let a = 29
			while (a > -1) {
				use.downArrow().should('have.value', `08:${toLeadingZero(a)} PM`).then(a11yHasExpectedHtml(`<p>${a}.</p>`))
				a--
			}
			let b = 59
			while (b > 1) {
				use.downArrow().should('have.value', `08:${toLeadingZero(b)} PM`).then(a11yHasExpectedHtml(`<p>${b}.</p>`))
				b--
			}
		})
	})
}