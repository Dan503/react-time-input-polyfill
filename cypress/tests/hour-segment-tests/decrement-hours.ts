import { selectSegment, toLeadingZero } from "@time-input-polyfill/utils"
import { loadTestPage, use } from "../../support"

export function decrementHours() {
	it('Should decrement hours as expected on down key press', () => {
		loadTestPage().then(({ $input }) => {
			selectSegment($input, 'hrs12')
			let a = 7
			while (a > 0) {
				use.downArrow().should('have.value', `0${a}:30 PM`)
				a--
			}
			let b = 12
			while (b > 7) {
				use.downArrow().should('have.value', `${toLeadingZero(b)}:30 PM`)
				b--
			}
		})
	})
}
