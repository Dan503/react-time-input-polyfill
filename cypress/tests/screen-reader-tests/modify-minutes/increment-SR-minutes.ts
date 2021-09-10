import { a11yHasExpectedHtml, loadTestPage, use } from "../../../support"

export function incrementScreenReaderMinutes() {
	it('UP key should update a11y with minutes value', () => {
		loadTestPage({ segment: 'minutes' }).then(() => {
			let a = 31
			while (a < 60) {
				use.upArrow().then(a11yHasExpectedHtml(`<p>${a}.</p>`))
				a++
			}
			let b = 0
			while (b < 31) {
				use.upArrow().then(a11yHasExpectedHtml(`<p>${b}.</p>`))
				b++
			}
		})
	})
}
