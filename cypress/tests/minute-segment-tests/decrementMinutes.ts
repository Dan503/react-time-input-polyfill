import { selectSegment, toLeadingZero } from "@time-input-polyfill/utils"
import { cyInput, loadTestPage } from "../../support"

export function decrementMinutes() {
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