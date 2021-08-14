import { selectSegment, toLeadingZero } from "@time-input-polyfill/utils"
import { loadTestPage } from "../support/loadTestPage"
import { cyInput } from "../support/utils"

describe('hour segment', () => {
	incrementHours()
	decrementHours()
	deleteHours()
	blankHours()

	function incrementHours() {
		it('Should increment hours as expected on up key press', () => {
			loadTestPage().then(({ $input }) => {
				selectSegment($input, 'hrs12')

				cyInput().type('{uparrow}').should('have.value', '09:30 PM')
				cyInput().type('{uparrow}').should('have.value', '10:30 PM')
				cyInput().type('{uparrow}').should('have.value', '11:30 PM')
				cyInput().type('{uparrow}').should('have.value', '12:30 PM')
				let i = 1
				while (i < 10) {
					cyInput().type('{uparrow}').should('have.value', `0${i}:30 PM`)
					i++
				}
			})
		})
	}

	function decrementHours() {
		it('Should decrement hours as expected on down key press', () => {
			loadTestPage().then(({ $input }) => {
				selectSegment($input, 'hrs12')
				let a = 7
				while (a > 0) {
					cyInput().type('{downarrow}').should('have.value', `0${a}:30 PM`)
					a--
				}
				let b = 12
				while (b > 7) {
					cyInput().type('{downarrow}').should('have.value', `${toLeadingZero(b)}:30 PM`)
					b--
				}
			})
		})
	}

	function deleteHours() {
		it('Should clear hours on delete key press', () => {
			loadTestPage().then(({ $input }) => {
				selectSegment($input, 'hrs12')
				cyInput().type('{del}').should('have.value', '--:30 PM')
			})
		})
		it('Should clear hours on backspace key press', () => {
			loadTestPage().then(({ $input }) => {
				selectSegment($input, 'hrs12')
				cyInput().type('{backspace}').should('have.value', '--:30 PM')
			})
		})
	}
	function blankHours() {
		it('Should populate blank hours as expected', () => {
			loadTestPage().then(({ $input }) => {
				selectSegment($input, 'hrs12')
				cyInput().type('{del}').should('have.value', '--:30 PM')
			})
		})
		it('Should clear hours on backspace key press', () => {
			loadTestPage().then(({ $input }) => {
				selectSegment($input, 'hrs12')
				cyInput().type('{backspace}').should('have.value', '--:30 PM')
			})
		})
	}
})

export {}
