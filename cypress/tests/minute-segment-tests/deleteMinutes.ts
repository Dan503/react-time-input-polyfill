import { cyInput, loadTestPage } from "../../support"

export function deleteMinutes() {
	describe('Delete minutes', () => {
		it('Should clear minutes on delete key press', () => {
			loadTestPage({ segment: 'minutes' }).then(() => {
				cyInput().type('{del}').should('have.value', '08:-- PM')
			})
		})
		it('Should clear minutes on backspace key press', () => {
			loadTestPage({ segment: 'minutes' }).then(() => {
				cyInput().type('{backspace}').should('have.value', '08:-- PM')
			})
		})
	})
}