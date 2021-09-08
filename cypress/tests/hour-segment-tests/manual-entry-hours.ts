import { cySelectSegment, loadTestPage } from "../../support"

export function manualEntryHours() {
	describe('Manual Entry Hours', () => {
		it('08:30 PM >> [0] >> 12:30 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('0').should('have.value', '12:30 PM')
			})
		})
		it('08:30 PM >> [0 0] >> 12:30 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('00').should('have.value', '12:30 PM')
			})
		})
		it('08:30 PM >> [0 0 0] >> 12:00 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('000').should('have.value', '12:00 PM')
			})
		})
		it('08:30 PM >> [1] >> 01:30 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('1').should('have.value', '01:30 PM')
			})
		})
		it('08:30 PM >> [1 1] >> 11:30 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('11').should('have.value', '11:30 PM')
			})
		})
		it('08:30 PM >> [1 > < 2] >> 02:30 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('1{rightarrow}{leftarrow}2').should('have.value', '02:30 PM')
			})
		})
	})
}
