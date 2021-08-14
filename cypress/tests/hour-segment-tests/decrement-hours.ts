import { selectSegment, toLeadingZero } from "@time-input-polyfill/utils"
import { loadTestPage } from "../../support/loadTestPage"
import { cyInput } from "../../support/utils"

export function decrementHours() {
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
