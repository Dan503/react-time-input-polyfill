import { a11yHasExpectedHtml, a11yInitialHtml, cySelectSegment, loadTestPage } from "../../support"

export const increments_6_9 = () => {
	describe('increments 6-9', () => {
		for (let i = 6; i <= 9; i++) {
			it(`08:30 PM >> [${i}] >> 0${i}:30 PM`, () => {
				loadTestPage({ segment: 'hrs12' }).then(() => {
					cySelectSegment('hrs12').type(`${i}`).should('have.value', `0${i}:30 PM`).then(a11yHasExpectedHtml(a11yInitialHtml().minutes))
				})
			})
			it(`08:30 PM >> [${i} ${i}] >> 0${i}:0${i} PM`, () => {
				loadTestPage({ segment: 'hrs12' }).then(() => {
					cySelectSegment('hrs12').type(`${i}${i}`).should('have.value', `0${i}:0${i} PM`).then(a11yHasExpectedHtml(a11yInitialHtml().mode))
				})
			})
			it(`08:30 PM >> [${i} ${i} A] >> 0${i}:0${i} PM`, () => {
				loadTestPage({ segment: 'hrs12' }).then(() => {
					cySelectSegment('hrs12').type(`${i}${i}a`).should('have.value', `0${i}:0${i} AM`).then(a11yHasExpectedHtml('<p>AM.</p>'))
				})
			})
		}
	})
}