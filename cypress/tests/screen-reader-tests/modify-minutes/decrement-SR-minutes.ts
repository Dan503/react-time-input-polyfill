import { a11yHasExpectedHtml, cyInput, loadTestPage, use } from "../../../support"

export function decrementScreenReaderMinutes() {
	it('DOWN key should update a11y with minutes value', () => {
		loadTestPage({ segment: 'minutes' }).then(() => {
			let a = 29
			while (a > -1) {
				cyInput().then(use.downArrow).then(a11yHasExpectedHtml(`<p>${a}.</p>`))
				a--
			}
			let b = 59
			while (b > 1) {
				cyInput().then(use.downArrow).then(a11yHasExpectedHtml(`<p>${b}.</p>`))
				b--
			}
		})
	})
}
