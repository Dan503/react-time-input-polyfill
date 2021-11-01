import { Segment } from "@time-input-polyfill/utils"
import { cyInput, cySelectSegment, hasReturnVal, loadTestPage, use } from "../../support"

const clickToggleButton = (segment: Segment) => () => cy.get('#Polyfill-demo-toggle-polyfill').click().wait(10).then(() => cySelectSegment(segment))

/** Time inputs can't be automated other than through direct input like this :( */
const setNonPolyTime = (newTime: string) => () => cyInput().type(newTime)

export function toggleButton() {
	describe('Toggle polyfill button', () => {
		testToggleWorks()
		testToggleUp()
		testToggleDown()

		function testToggleWorks() {
			it('can toggle on and off', () => {
				loadTestPage()
					.should('have.value', '08:30 PM')
					.then(hasReturnVal('20:30'))
					.then(clickToggleButton('hrs12'))
					.should('have.value', '20:30')
					.then(hasReturnVal('20:30'))
					.then(clickToggleButton('hrs12'))
					.should('have.value', '08:30 PM')
			})
		}

		function testToggleUp() {
			describe('up > toggle > up', () => {
				testHrs()
				testMinutes()
				testMode()

				function testHrs() {
					it('hrs: up > toggle > up > toggle > up', () => {
						loadTestPage({ segment: 'hrs12' })
							.then(use.upArrow)
							.should('have.value', '09:30 PM')
							.then(hasReturnVal('21:30'))
							.then(clickToggleButton('hrs12'))
							.should('have.value', '21:30')
							.then(setNonPolyTime('22:30'))
							.should('have.value', '22:30')
							.then(hasReturnVal('22:30'))
							.then(clickToggleButton('hrs12'))
							.should('have.value', '10:30 PM')
							.then(hasReturnVal('22:30'))
							.then(use.upArrow)
							.should('have.value', '11:30 PM')
							.then(hasReturnVal('23:30'))
					})
				}

				function testMinutes() {
					it('minutes: up > toggle > up > toggle > up', () => {
						loadTestPage({ segment: 'minutes' })
							.then(use.upArrow)
							.should('have.value', '08:31 PM')
							.then(hasReturnVal('20:31'))
							.then(clickToggleButton('minutes'))
							.should('have.value', '20:31')
							.then(setNonPolyTime('20:32'))
							.should('have.value', '20:32')
							.then(hasReturnVal('20:32'))
							.then(clickToggleButton('minutes'))
							.should('have.value', '08:32 PM')
							.then(use.upArrow)
							.should('have.value', '08:33 PM')
							.then(hasReturnVal('20:33'))
					})
				}

				function testMode() {
					it('mode: up > toggle > up > toggle > up', () => {
						loadTestPage({ segment: 'mode' })
							.then(use.upArrow)
							.should('have.value', '08:30 AM')
							.then(hasReturnVal('08:30'))
							.then(clickToggleButton('mode'))
							.should('have.value', '08:30')
							.then(setNonPolyTime('20:30'))
							.then(hasReturnVal('20:30'))
							.then(clickToggleButton('mode'))
							.should('have.value', '08:30 PM')
							.then(hasReturnVal('20:30'))
							.then(use.upArrow)
							.should('have.value', '08:30 AM')
							.then(hasReturnVal('08:30'))
					})
				}
			})
		}

		function testToggleDown() {
			describe('down > toggle > down', () => {
				testHrs()
				testMinutes()
				testMode()

				function testHrs() {
					it('hrs: down > toggle > down > toggle > down', () => {
						loadTestPage({ segment: 'hrs12' })
							.then(use.downArrow)
							.should('have.value', '07:30 PM')
							.then(hasReturnVal('19:30'))
							.then(clickToggleButton('hrs12'))
							.should('have.value', '19:30')
							.then(hasReturnVal('19:30'))
							.then(setNonPolyTime('18:30'))
							.should('have.value', '18:30')
							.then(hasReturnVal('18:30'))
							.then(clickToggleButton('hrs12'))
							.should('have.value', '06:30 PM')
							.then(hasReturnVal('18:30'))
							.then(use.downArrow)
							.should('have.value', '05:30 PM')
							.then(hasReturnVal('17:30'))
					})
				}

				function testMinutes() {
					it('minutes: down > toggle > down > toggle > down', () => {
						loadTestPage({ segment: 'minutes' })
							.then(use.downArrow)
							.should('have.value', '08:29 PM')
							.then(hasReturnVal('20:29'))
							.then(clickToggleButton('minutes'))
							.should('have.value', '20:29')
							.then(hasReturnVal('20:29'))
							.then(setNonPolyTime('20:28'))
							.should('have.value', '20:28')
							.then(hasReturnVal('20:28'))
							.then(clickToggleButton('minutes'))
							.should('have.value', '08:28 PM')
							.then(hasReturnVal('20:28'))
							.then(use.downArrow)
							.should('have.value', '08:27 PM')
							.then(hasReturnVal('20:27'))
					})
				}

				function testMode() {
					it('mode: down > toggle > down > toggle > down', () => {
						loadTestPage({ segment: 'mode' })
							.then(use.downArrow)
							.should('have.value', '08:30 AM')
							.then(hasReturnVal('08:30'))
							.then(clickToggleButton('mode'))
							.should('have.value', '08:30')
							.then(hasReturnVal('08:30'))
							.then(setNonPolyTime('20:30'))
							.then(clickToggleButton('mode'))
							.should('have.value', '08:30 PM')
							.then(hasReturnVal('20:30'))
							.then(use.downArrow)
							.should('have.value', '08:30 AM')
							.then(hasReturnVal('08:30'))
					})
				}
			})
		}
	})
}