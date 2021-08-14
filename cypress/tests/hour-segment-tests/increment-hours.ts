import { selectSegment } from "@time-input-polyfill/utils"
import { loadTestPage } from "../../support/loadTestPage"
import { cyInput } from "../../support/utils"

export function incrementHours() {
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
