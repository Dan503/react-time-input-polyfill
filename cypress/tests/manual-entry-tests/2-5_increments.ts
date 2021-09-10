import { a11yHasExpectedHtml, a11yInitialHtml, loadTestPage } from "../../support"

export const increments_2_5 = () => {
	describe('increments 2-5', () => {
		for (let i = 2; i <= 5; i++) {
			it(`08:30 PM >> [${i}] >> 0${i}:30 PM`, () => {
				loadTestPage({ segment: 'hrs12' })
					.type(`${i}`)
					.should('have.value', `0${i}:30 PM`)
					.then(a11yHasExpectedHtml(a11yInitialHtml().minutes))
			})
			it(`08:30 PM >> [${i} ${i}] >> 0${i}:0${i} PM`, () => {
				loadTestPage({ segment: 'hrs12' })
					.type(`${i}${i}`)
					.should('have.value', `0${i}:0${i} PM`)
					.then(a11yHasExpectedHtml(`<p>${i}.</p>`))
			})
			it(`08:30 PM >> [${i} ${i} ${i}] >> 0${i}:${i}${i} PM`, () => {
				loadTestPage({ segment: 'hrs12' })
					.type(`${i}${i}${i}`)
					.should('have.value', `0${i}:${i}${i} PM`)
					.then(a11yHasExpectedHtml(a11yInitialHtml().mode))
			})
			it(`08:30 PM >> [${i} ${i} ${i} A] >> 0${i}:${i}${i} PM`, () => {
				loadTestPage({ segment: 'hrs12' })
					.type(`${i}${i}${i}a`)
					.should('have.value', `0${i}:${i}${i} AM`)
					.then(a11yHasExpectedHtml(`<p>AM.</p>`))
			})
		}
	})
}