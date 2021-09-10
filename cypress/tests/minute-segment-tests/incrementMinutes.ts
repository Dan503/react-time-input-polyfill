import { toLeadingZero } from "@time-input-polyfill/utils"
import { a11yHasExpectedHtml, loadTestPage, use } from "../../support"

export function incrementMinutes() {
	it('Should increment as expected on up key press', () => {
		loadTestPage({ segment: 'minutes' }).then(() => {
			let a = 31
			while (a < 60) {
				use.upArrow().should('have.value', `08:${a} PM`).then(a11yHasExpectedHtml(`<p>${a}.</p>`))
				a++
			}
			let b = 0
			while (b < 31) {
				use.upArrow().should('have.value', `08:${toLeadingZero(b)} PM`).then(a11yHasExpectedHtml(`<p>${b}.</p>`))
				b++
			}
		})
	})
}