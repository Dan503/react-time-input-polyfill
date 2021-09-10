import { loadTestPage } from "../support"

describe('Miscellaneous tests', () => {
	it('Should start with value of 08:30 PM', () => {
		loadTestPage().should('have.value', '08:30 PM')
	})
})

export {}
