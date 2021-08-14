/// <reference types="cypress" />

import { loadTestPage, _forcedPolyfillId } from "../support/loadTestPage"
import { selectSegment, toLeadingZero, getCursorSegment, selectCursorSegment } from '@time-input-polyfill/utils'
import { Segment } from "@time-input-polyfill/utils/npm/types"

const cyVisit = () => cy.visit('http://localhost:3000/react-time-input-polyfill')
const cyInput = () => cy.get(_forcedPolyfillId)

describe('Miscellaneous tests', () => {
	it('Should start with value of 08:30 PM', () => {
		cyVisit()
		cyInput().should('have.value', '08:30 PM')
	})
})

export {}
