import { selectSegment } from "@time-input-polyfill/utils"
import { loadTestPage } from "../../support/loadTestPage"
import { cyInput } from "../../support/utils"

export function blankHours() {
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