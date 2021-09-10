import { a11yHasExpectedHtml, a11yInitialHtml, cyInput, cySelectSegment, loadTestPage, use } from "../../support"

export const otherManualEntryTests = () => {
	describe('other manual entry tests', () => {
		it('08:30 PM >> [ 1 > < 2 ] >> 02:30 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12')
					.type('1')
					.then(a11yHasExpectedHtml('<p>1.</p>'))
					.then(use.rightArrow)
					.then(a11yHasExpectedHtml(a11yInitialHtml().minutes))
					.then(use.leftArrow)
					.then(a11yHasExpectedHtml(a11yInitialHtml(1).hrs12))
					.then(cyInput)
					.type('2')
					.should('have.value', '02:30 PM')
					.then(a11yHasExpectedHtml(a11yInitialHtml().minutes))
			})
		})
		it('08:30 PM >> [ > 1 > < 2 ] >> 08:02 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12')
					.then(use.rightArrow)
					.then(a11yHasExpectedHtml(a11yInitialHtml().minutes))
					.then(cyInput)
					.type('1')
					.then(a11yHasExpectedHtml('<p>1.</p>'))
					.then(use.rightArrow)
					.then(a11yHasExpectedHtml(a11yInitialHtml().mode))
					.then(use.leftArrow)
					.then(a11yHasExpectedHtml(a11yInitialHtml(1).minutes))
					.then(cyInput)
					.type('2')
					.should('have.value', '08:02 PM')
					.then(a11yHasExpectedHtml('<p>2.</p>'))
			})
		})
		it('08:30 PM >> [ > > AM ] >> 08:30 AM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12')
					.then(use.rightArrow)
					.then(use.rightArrow)
					.then(a11yHasExpectedHtml(a11yInitialHtml().mode))
					.then(cyInput)
					.type('AM')
					.should('have.value', '08:30 AM')
					.then(a11yHasExpectedHtml('<p>AM.</p>'))
			})
		})
		it('08:30 PM >> [ > > AM PM ] >> 08:30 AM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12')
					.type('{rightarrow}{rightarrow}ampm')
					.should('have.value', '08:30 PM')
					.then(a11yHasExpectedHtml('<p>PM.</p>'))
			})
		})
	})
}