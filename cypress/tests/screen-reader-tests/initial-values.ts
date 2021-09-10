import { a11yHasExpectedHtml, cyInput, cySelectSegment, loadTestPage, use } from "../../support"


const initialHtml = {
	hrs12: '<p>Hours spin button 8.</p>',
	minutes: '<p>Minutes spin button 30.</p>',
	mode: '<p>AM/PM spin button PM.</p>'
}

export const initialValues = () => {
	describe('Initial values', () => {
		it('reads label, then time, then hours segment', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				const expectedHtml = [
					'<p>Forced polyfill time input grouping 08:30 PM.</p>',
					initialHtml.hrs12,
				].join('')
				cyInput().focus().then(a11yHasExpectedHtml(expectedHtml))
			})
		})
		it('hrs [>] min', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').then(use.rightArrow).then(a11yHasExpectedHtml(initialHtml.minutes))
			})
		})
		it('min [>] mode', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('minutes').then(use.rightArrow).then(a11yHasExpectedHtml(initialHtml.mode))
			})
		})
		it('mode [<] min', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('mode').then(use.leftArrow).then(a11yHasExpectedHtml(initialHtml.minutes))
			})
		})
		it('min [<] hrs', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('mode').then(use.leftArrow).then(use.leftArrow).then(a11yHasExpectedHtml(initialHtml.hrs12))
			})
		})
	})
}