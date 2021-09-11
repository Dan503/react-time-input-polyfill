import { a11yHasExpectedHtml, a11yInitialHtml, loadTestPage } from "../../support"

export const increments_6_9 = () => {
	describe('increments 6-9', () => {
		for (let i = 6; i <= 9; i++) {
			it(`${i} ${i} A`, () => {
				loadTestPage({ segment: 'hrs12' })
					.type(`${i}`)
					.should('have.value', `0${i}:30 PM`)
					.then(a11yHasExpectedHtml(a11yInitialHtml().minutes))
					.type(`${i}`)
					.should('have.value', `0${i}:0${i} PM`)
					.then(a11yHasExpectedHtml(a11yInitialHtml().mode))
					.type(`a`)
					.should('have.value', `0${i}:0${i} AM`)
					.then(a11yHasExpectedHtml('<p>AM.</p>'))
			})
		}
	})
}