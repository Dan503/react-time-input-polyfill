import { toLeadingZero } from "@time-input-polyfill/utils"
import { a11yHasExpectedHtml, a11yInitialHtml, hasReturnVal, loadTestPage } from "../../support"

export const increments_6_9 = () => {
	describe('increments 6-9', () => {
		for (let i = 6; i <= 9; i++) {
			const hr24 = 12 + i
			it(`${i} ${i} A`, () => {
				loadTestPage({ segment: 'hrs12' })
					.type(`${i}`)
					.should('have.value', `0${i}:30 PM`)
					.then(a11yHasExpectedHtml(a11yInitialHtml().minutes))
					.then(hasReturnVal(`${hr24}:30`))
					.type(`${i}`)
					.should('have.value', `0${i}:0${i} PM`)
					.then(a11yHasExpectedHtml(a11yInitialHtml().mode))
					.then(hasReturnVal(`${hr24}:0${i}`))
					.type(`a`)
					.should('have.value', `0${i}:0${i} AM`)
					.then(a11yHasExpectedHtml('<p>AM.</p>'))
					.then(hasReturnVal(`${toLeadingZero(hr24 - 12)}:0${i}`))
			})
		}
	})
}