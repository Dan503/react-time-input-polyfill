import { toLeadingZero } from "@time-input-polyfill/utils"
import { a11yHasExpectedHtml, loadTestPage, use } from "../../support"

export function decrementHours() {
	it('Should decrement hours as expected on down key press', () => {
		loadTestPage({ segment: 'hrs12' }).then(() => {
			let a = 7
			while (a > 0) {
				use.downArrow().should('have.value', `0${a}:30 PM`).then(a11yHasExpectedHtml(`<p>${a}.</p>`))
				a--
			}
			let b = 12
			while (b > 7) {
				use.downArrow().should('have.value', `${toLeadingZero(b)}:30 PM`).then(a11yHasExpectedHtml(`<p>${b}.</p>`))
				b--
			}
		})
	})
}
