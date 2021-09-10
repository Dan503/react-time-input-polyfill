import { a11yHasExpectedHtml, a11yInitialHtml, cySelectSegment, loadTestPage } from "../../support"

export const increments_0_1 = () => {
	describe('increments 0-1', () => {
		it('08:30 PM >> [0] >> 12:30 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('0').should('have.value', '12:30 PM').then(a11yHasExpectedHtml('<p>12.</p>'))
			})
		})
		it('08:30 PM >> [0 0] >> 12:30 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('00').should('have.value', '12:30 PM').then(a11yHasExpectedHtml(a11yInitialHtml().minutes))
			})
		})
		it('08:30 PM >> [0 0 0] >> 12:00 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('000').should('have.value', '12:00 PM').then(a11yHasExpectedHtml('<p>0.</p>'))
			})
		})
		it('08:30 PM >> [0 0 0 0] >> 12:00 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('0000').should('have.value', '12:00 PM').then(a11yHasExpectedHtml(a11yInitialHtml().mode))
			})
		})
		it('08:30 PM >> [0 0 0 0 A] >> 12:00 AM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('0000a').should('have.value', '12:00 AM').then(a11yHasExpectedHtml('<p>AM.</p>'))
			})
		})
		it('08:30 PM >> [1] >> 01:30 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('1').should('have.value', '01:30 PM').then(a11yHasExpectedHtml('<p>1.</p>'))
			})
		})
		it('08:30 PM >> [1 1] >> 11:30 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('11').should('have.value', '11:30 PM').then(a11yHasExpectedHtml(a11yInitialHtml().minutes))
			})
		})
		it('08:30 PM >> [1 1 1] >> 11:01 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('111').should('have.value', '11:01 PM').then(a11yHasExpectedHtml('<p>1.</p>'))
			})
		})
		it('08:30 PM >> [1 1 1 1] >> 11:11 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('1111').should('have.value', '11:11 PM').then(a11yHasExpectedHtml(a11yInitialHtml().mode))
			})
		})
		it('08:30 PM >> [1 1 1 1 A] >> 11:11 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('1111a').should('have.value', '11:11 AM').then(a11yHasExpectedHtml('<p>AM.</p>'))
			})
		})
	})
}