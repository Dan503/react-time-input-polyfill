import { toLeadingZero } from "@time-input-polyfill/utils"
import { a11yHasExpectedHtml, hasReturnVal, loadTestPage, setTime, use } from "../../support"

export function incrementMinutes() {
	it('Should increment as expected on up key press', () => {
		loadTestPage({ segment: 'minutes' }).then(() => {
			setTime('12:59 AM', 'minutes').then(() => {
				let a = 0
				while (a < 60) {
					use.upArrow()
						.should('have.value', `12:${toLeadingZero(a)} AM`)
						.then(a11yHasExpectedHtml(`<p>${a}.</p>`))
						.then(hasReturnVal(`00:${toLeadingZero(a)}`))
					a++
				}
				// Testing that it loops back around at the end
				use.upArrow()
					.should('have.value', `12:00 AM`)
					.then(a11yHasExpectedHtml(`<p>0.</p>`))
					.then(hasReturnVal(`00:00`))
			})
		})
	})
}