import { Segment } from "@time-input-polyfill/utils"
import { cyInput, cySelectSegment, hasReturnVal, loadTestPage, use } from "../../support"

const clickToggleButton = (segment: Segment) => () => cy.get('#Polyfill-demo-toggle-polyfill').click().wait(10).then(() => cySelectSegment(segment))

export function toggleButton() {
	describe('Toggle polyfill button', () => {
		it('can toggle on and off', () => {
			loadTestPage()
				.should('have.value', '08:30 PM')
				.then(clickToggleButton('hrs12'))
				.should('have.value', '20:30')
				.then(clickToggleButton('hrs12'))
				.should('have.value', '08:30 PM')
		})

		it('hrs: up > toggle > up > toggle > up', () => {
			loadTestPage({ segment: 'hrs12' })
				.then(use.upArrow)
				.should('have.value', '09:30 PM')
				.then(clickToggleButton('hrs12'))
				.should('have.value', '21:30')
				.then(use.upArrow)
				.should('have.value', '22:30')
				.then(clickToggleButton('hrs12'))
				.should('have.value', '10:30 PM')
				.then(use.upArrow)
				.should('have.value', '11:30 PM')
		})

		it('minutes: up > toggle > up > toggle > up', () => {
			loadTestPage({ segment: 'minutes' })
				.then(use.upArrow)
				.should('have.value', '08:31 PM')
				.then(clickToggleButton('minutes'))
				.should('have.value', '20:31')
				.then(use.upArrow)
				.should('have.value', '20:32')
				.then(clickToggleButton('minutes'))
				.should('have.value', '08:32 PM')
				.then(use.upArrow)
				.should('have.value', '08:33 PM')
		})

		it('mode: up > toggle > up > toggle > up', () => {
			loadTestPage({ segment: 'mode' })
				.then(use.upArrow)
				.should('have.value', '08:30 AM')
				.then(clickToggleButton('mode'))
				.should('have.value', '08:30')
				.then(clickToggleButton('mode'))
				.should('have.value', '08:30 AM')
				.then(use.upArrow)
				.should('have.value', '08:30 PM')
		})

	})
}