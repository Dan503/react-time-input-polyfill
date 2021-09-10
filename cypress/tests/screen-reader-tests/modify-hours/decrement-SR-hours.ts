import { a11yHasExpectedHtml, loadTestPage, use } from "../../../support"

export function decrementScreenReaderHours() {
	it('DOWN key should update a11y with hours value', () => {
		loadTestPage({ segment: 'hrs12' }).then(() => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				let a = 7
				while (a > 0) {
					use.downArrow().then(a11yHasExpectedHtml(`<p>${a}.</p>`))
					a--
				}
				let b = 12
				while (b > 7) {
					use.downArrow().then(a11yHasExpectedHtml(`<p>${b}.</p>`))
					b--
				}
			})
		})
	})
}
