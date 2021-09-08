import { selectSegment, toLeadingZero } from "@time-input-polyfill/utils"
import { cyInput, loadTestPage } from "../../support"

export function incrementMinutes() {
	it('Should increment as expected on up key press', () => {
		loadTestPage({ segment: 'minutes' }).then(({ $input }) => {
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