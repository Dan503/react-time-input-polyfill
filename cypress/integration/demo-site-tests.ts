/// <reference types="cypress" />

import { loadTestPage } from "../support/loadTestPage"
import { selectSegment } from '@time-input-polyfill/utils'
import { Segment } from "@time-input-polyfill/utils/npm/types"

const forcedPolyfillId = 'Forced-polyfill-input'
const _forcedPolyfillId = `#${forcedPolyfillId}`

const getInput = (document: Document, inputId: string = forcedPolyfillId) => document.getElementById(inputId) as HTMLInputElement

const cyVisit = () => cy.visit('http://localhost:3000/react-time-input-polyfill')
const cyInput = () => cy.get(_forcedPolyfillId)

const targetSegment = async (segment: Segment) => {
	const { document } = await loadTestPage()
	const $input = getInput(document)
	selectSegment($input, segment)
	return { $input }
}

describe('example to-do app', () => {
	it('Should start with value of 08:30 PM', async () => {
		cyVisit()
		cyInput().should('have.value', '08:30 PM')
	})

	it('Should increment to 09:30 PM on up key press', async () => {
		await targetSegment('hrs12')
		cyInput().type('{uparrow}').should('have.value', '09:30 PM')
	})
	it('Should decrement to 07:30 PM on down key press', async () => {
		await targetSegment('hrs12')
		cyInput().type('{downarrow}').should('have.value', '07:30 PM')
	})
})

export {}
