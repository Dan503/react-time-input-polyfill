/// <reference types="cypress" />

import { _forcedPolyfillId } from "../support/utils"

const cyVisit = () => cy.visit('http://localhost:3000/react-time-input-polyfill')
const cyInput = () => cy.get(_forcedPolyfillId)

describe('Miscellaneous tests', () => {
	it('Should start with value of 08:30 PM', () => {
		cyVisit().then(() => {
			cyInput().should('have.value', '08:30 PM')
		})
	})
})

export {}
