import { a11yHasExpectedHtml, loadTestPage, use } from "../../../support"

export function incrementScreenReaderHours() {
	it('UP key should update a11y with hours value', () => {
		loadTestPage({ segment: 'hrs12' }).then(() => {
			use.upArrow().then(a11yHasExpectedHtml('<p>9.</p>'))
			use.upArrow().then(a11yHasExpectedHtml('<p>10.</p>'))
			use.upArrow().then(a11yHasExpectedHtml('<p>11.</p>'))
			use.upArrow().then(a11yHasExpectedHtml('<p>12.</p>'))
			let i = 1
			while (i < 10) {
				use.upArrow().then(a11yHasExpectedHtml(`<p>${i}.</p>`))
				i++
			}
		})
	})
}
