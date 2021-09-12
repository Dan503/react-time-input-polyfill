import { loadTestPage } from "../../support/loadTestPage"
import { clearAllSegments, use, a11yHasExpectedHtml, hasReturnVal } from "../../support/utils"

export function fromBlankMinutes() {
	describe('from blank minutes', () => {
		incrementBlankMinutes()
		decrementBlankMinutes()

		function incrementBlankMinutes() {
			describe('increment blank minutes', () => {
				it('Should increment blank minutes 08:-- PM to 01:30 PM', () => {
					loadTestPage({ segment: 'minutes' })
						.then(use.del)
						.should('have.value', '08:-- PM')
						.then(hasReturnVal(''))
						.then(use.upArrow)
						.should('have.value', '08:00 PM')
						.then(a11yHasExpectedHtml(`<p>0.</p>`))
						.then(hasReturnVal('20:00'))
				})

				it('Should increment blank minutes from --:-- -- to --:00 --', () => {
					loadTestPage().then(() => {
						clearAllSegments('minutes')
							.then(use.upArrow)
							.should('have.value', '--:00 --')
							.then(a11yHasExpectedHtml(`<p>0.</p>`))
							.then(hasReturnVal(''))
					})
				})
			})
		}

		function decrementBlankMinutes() {
			describe('decrement blank minutes', () => {
				it('Should decrement blank minutes 08:-- PM to 08:59 PM', () => {
					loadTestPage({ segment: 'minutes' })
						.then(use.del)
						.should('have.value', '08:-- PM')
						.then(hasReturnVal(''))
						.then(use.downArrow)
						.should('have.value', '08:59 PM')
						.then(a11yHasExpectedHtml(`<p>59.</p>`))
						.then(hasReturnVal('20:59'))
				})

				it('Should decrement blank minutes from --:-- -- to --:59 --', () => {
					loadTestPage({ segment: 'minutes' }).then(() => {
						clearAllSegments('minutes')
							.then(use.downArrow)
							.should('have.value', '--:59 --')
							.then(a11yHasExpectedHtml(`<p>59.</p>`))
							.then(hasReturnVal(''))
					})
				})
			})
		}
	})
}
