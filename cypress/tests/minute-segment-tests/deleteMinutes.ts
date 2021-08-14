import { selectSegment } from "@time-input-polyfill/utils"
import { cyInput, loadTestPage } from "../../support"

export function deleteMinutes() {
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