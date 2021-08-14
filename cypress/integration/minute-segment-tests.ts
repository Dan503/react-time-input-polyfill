import { selectSegment, toLeadingZero } from "@time-input-polyfill/utils"
import { loadTestPage } from "../support/loadTestPage"
import { cyInput } from "../support/utils"

describe('Minute segment', () => {
	incrementMinutes()
	decrementMinutes()
	deleteMinutes()

	function incrementMinutes() {
		it('Should increment as expected on up key press', () => {
			loadTestPage().then(({ $input }) => {
				selectSegment($input, 'minutes')
				let a = 31
				while (a < 60) {
					cyInput().type('{uparrow}').should('have.value', `08:${a} PM`)
					a++
				}
				let b = 0
				while (b < 31) {
					cyInput().type('{uparrow}').should('have.value', `08:${toLeadingZero(b)} PM`)
					b++
				}
			})
		})
	}
	function decrementMinutes() {
		it('Should decrement as expected on down key press', () => {
			loadTestPage().then(({ $input }) => {
				selectSegment($input, 'minutes')
				let a = 29
				while (a > -1) {
					cyInput().type('{downarrow}').should('have.value', `08:${toLeadingZero(a)} PM`)
					a--
				}
				let b = 59
				while (b > 1) {
					cyInput().type('{downarrow}').should('have.value', `08:${toLeadingZero(b)} PM`)
					b--
				}
			})
		})
	}

	function deleteMinutes() {
		it('Should clear minutes on delete key press', () => {
			loadTestPage().then(({ $input }) => {
				selectSegment($input, 'minutes')
				cyInput().type('{del}').should('have.value', '08:-- PM')
			})
		})
		it('Should clear minutes on backspace key press', () => {
			loadTestPage().then(({ $input }) => {
				selectSegment($input, 'minutes')
				cyInput().type('{backspace}').should('have.value', '08:-- PM')
			})
		})
	}
})

export {}
