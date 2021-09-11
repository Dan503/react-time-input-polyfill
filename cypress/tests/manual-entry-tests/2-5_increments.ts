import { a11yHasExpectedHtml, a11yInitialHtml, loadTestPage } from "../../support"

export const increments_2_5 = () => {
	describe('increments 2-5', () => {
		for (let i = 2; i <= 5; i++) {
			it(`${i} ${i} ${i} A`, () => {
				loadTestPage({ segment: 'hrs12' })
					.type(`${i}`)
					.should('have.value', `0${i}:30 PM`)
					.then(a11yHasExpectedHtml(a11yInitialHtml().minutes))
					.type(`${i}`)
					.should('have.value', `0${i}:0${i} PM`)
					.then(a11yHasExpectedHtml(`<p>${i}.</p>`))
					.type(`${i}`)
					.should('have.value', `0${i}:${i}${i} PM`)
					.then(a11yHasExpectedHtml(a11yInitialHtml().mode))
					.type(`a`)
					.should('have.value', `0${i}:${i}${i} AM`)
					.then(a11yHasExpectedHtml(`<p>AM.</p>`))
			})
		}
	})
}