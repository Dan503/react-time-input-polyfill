import { a11yHasExpectedHtml, loadTestPage, use } from "../../support"

export const toggleScreenReaderMode = () => {
	describe('Toggling Mode updates a11y correctly', () => {
		it('UP Updates mode correctly', () => {
			loadTestPage({ segment: 'mode' }).then(() => {
				use.upArrow().then(a11yHasExpectedHtml(`<p>AM.</p>`))
			})
		})
		it('UP UP Updates mode correctly', () => {
			loadTestPage({ segment: 'mode' }).then(() => {
				use.upArrow().then(use.upArrow).then(a11yHasExpectedHtml(`<p>PM.</p>`))
			})
		})
		it('DOWN Updates mode correctly', () => {
			loadTestPage({ segment: 'mode' }).then(() => {
				use.downArrow().then(a11yHasExpectedHtml(`<p>AM.</p>`))
			})
		})
		it('DOWN DOWN Updates mode correctly', () => {
			loadTestPage({ segment: 'mode' }).then(() => {
				use.downArrow().then(use.downArrow).then(a11yHasExpectedHtml(`<p>PM.</p>`))
			})
		})
	})
}