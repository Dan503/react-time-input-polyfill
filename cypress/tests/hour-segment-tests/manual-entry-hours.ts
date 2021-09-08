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
		it('08:30 PM >> [0 0 0 0] >> 12:00 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('0000').should('have.value', '12:00 PM')
			})
		})
		it('08:30 PM >> [0 0 0 0 A] >> 12:00 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('0000a').should('have.value', '12:00 AM')
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
		it('08:30 PM >> [1 1 1] >> 11:01 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('111').should('have.value', '11:01 PM')
			})
		})
		it('08:30 PM >> [1 1 1 1] >> 11:11 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('1111').should('have.value', '11:11 PM')
			})
		})
		it('08:30 PM >> [1 1 1 1 A] >> 11:11 PM', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cySelectSegment('hrs12').type('1111a').should('have.value', '11:11 AM')
			})
		})
		for (let i = 2; i <= 5; i++) {
			it(`08:30 PM >> [${i}] >> 0${i}:30 PM`, () => {
				loadTestPage({ segment: 'hrs12' }).then(() => {
					cySelectSegment('hrs12').type(`${i}`).should('have.value', `0${i}:30 PM`)
				})
			})
			it(`08:30 PM >> [${i} ${i}] >> 0${i}:0${i} PM`, () => {
				loadTestPage({ segment: 'hrs12' }).then(() => {
					cySelectSegment('hrs12').type(`${i}${i}`).should('have.value', `0${i}:0${i} PM`)
				})
			})
			it(`08:30 PM >> [${i} ${i} ${i}] >> 0${i}:${i}${i} PM`, () => {
				loadTestPage({ segment: 'hrs12' }).then(() => {
					cySelectSegment('hrs12').type(`${i}${i}${i}`).should('have.value', `0${i}:${i}${i} PM`)
				})
			})
			it(`08:30 PM >> [${i} ${i} ${i} A] >> 0${i}:${i}${i} PM`, () => {
				loadTestPage({ segment: 'hrs12' }).then(() => {
					cySelectSegment('hrs12').type(`${i}${i}${i}a`).should('have.value', `0${i}:${i}${i} AM`)
				})
			})
		}

		for (let i = 6; i <= 9; i++) {
			it(`08:30 PM >> [${i}] >> 0${i}:30 PM`, () => {
				loadTestPage({ segment: 'hrs12' }).then(() => {
					cySelectSegment('hrs12').type(`${i}`).should('have.value', `0${i}:30 PM`)
				})
			})
			it(`08:30 PM >> [${i} ${i}] >> 0${i}:0${i} PM`, () => {
				loadTestPage({ segment: 'hrs12' }).then(() => {
					cySelectSegment('hrs12').type(`${i}${i}`).should('have.value', `0${i}:0${i} PM`)
				})
			})
			it(`08:30 PM >> [${i} ${i} A] >> 0${i}:0${i} PM`, () => {
				loadTestPage({ segment: 'hrs12' }).then(() => {
					cySelectSegment('hrs12').type(`${i}${i}a`).should('have.value', `0${i}:0${i} AM`)
				})
			})
		}

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
