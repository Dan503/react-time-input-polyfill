import { cySelectSegment, loadTestPage } from "../../support"

export const otherManualEntryTests = () => {
	describe('other manual entry tests', () => {
		it('08:30 PM >> [ 1 > < 2 ] >> 02:30 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('1{rightarrow}{leftarrow}2').should('have.value', '02:30 PM')
			})
		})
		it('08:30 PM >> [ > 1 > < 2 ] >> 08:02 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('{rightarrow}1{rightarrow}{leftarrow}2').should('have.value', '08:02 PM')
			})
		})
		it('08:30 PM >> [ > > AM ] >> 08:30 AM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('{rightarrow}{rightarrow}am').should('have.value', '08:30 AM')
			})
		})
		it('08:30 PM >> [ > > AM PM ] >> 08:30 AM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('{rightarrow}{rightarrow}ampm').should('have.value', '08:30 PM')
			})
		})
	})
}