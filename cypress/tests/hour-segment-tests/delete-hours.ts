import { selectSegment } from "@time-input-polyfill/utils"
import { loadTestPage } from "../../support/loadTestPage"
import { cyInput } from "../../support/utils"

export function deleteHours() {
	describe('delete hours', () => {
		it('Should clear hours on delete key press', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cyInput().type('{del}').should('have.value', '--:30 PM')
			})
		})
		it('Should clear hours on backspace key press', () => {
			loadTestPage({ segment: 'hrs12' }).then(() => {
				cyInput().type('{backspace}').should('have.value', '--:30 PM')
			})
		})
	})
}