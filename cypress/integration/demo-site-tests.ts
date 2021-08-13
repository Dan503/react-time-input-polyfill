/// <reference types="cypress" />

import { loadTestPage, _forcedPolyfillId } from "../support/loadTestPage"
import { selectSegment, toLeadingZero } from '@time-input-polyfill/utils'

const cyVisit = () => cy.visit('http://localhost:3000/react-time-input-polyfill')
const cyInput = () => cy.get(_forcedPolyfillId)

describe('example to-do app', () => {
	hasCorrectStartValue()
	testHourSegment()
	testMinuteSegment()

	function hasCorrectStartValue() {
		it('Should start with value of 08:30 PM', () => {
			cyVisit()
			cyInput().should('have.value', '08:30 PM')
		})
	}

	function testHourSegment() {
		describe('hour segment', () => {
			incrementHours()
			decrementHours()
			deleteHours()

			function incrementHours() {
				it('Should increment hours as expected on up key press', () => {
					loadTestPage().then(({ $input }) => {
						selectSegment($input, 'hrs12')

						cyInput().type('{uparrow}').should('have.value', '09:30 PM')
						cyInput().type('{uparrow}').should('have.value', '10:30 PM')
						cyInput().type('{uparrow}').should('have.value', '11:30 PM')
						cyInput().type('{uparrow}').should('have.value', '12:30 PM')
						let i = 1
						while (i < 10) {
							cyInput().type('{uparrow}').should('have.value', `0${i}:30 PM`)
							i++
						}
					})
				})
			}

			function decrementHours() {
				it('Should decrement hours as expected on down key press', () => {
					loadTestPage().then(({ $input }) => {
						selectSegment($input, 'hrs12')
						let a = 7
						while (a > 0) {
							cyInput().type('{downarrow}').should('have.value', `0${a}:30 PM`)
							a--
						}
						let b = 12
						while (b > 7) {
							cyInput().type('{downarrow}').should('have.value', `${toLeadingZero(b)}:30 PM`)
							b--
						}
					})
				})
			}

			function deleteHours() {
				it('Should clear hours on delete key press', () => {
					loadTestPage().then(({ $input }) => {
						selectSegment($input, 'hrs12')
						cyInput().type('{del}').should('have.value', '--:30 PM')
					})
				})
				it('Should clear hours on backspace key press', () => {
					loadTestPage().then(({ $input }) => {
						selectSegment($input, 'hrs12')
						cyInput().type('{backspace}').should('have.value', '--:30 PM')
					})
				})
			}
		})
	}

	function testMinuteSegment() {
		describe('Minute segment', () => {
			incrementMinutes()
			decrementMinutes()
			deleteMinutes()

			function incrementMinutes() {
				it('Should increment as expected on up key press', () => {
					loadTestPage().then(({ $input }) => {
						selectSegment($input, 'minutes')
						let a = 31
						while (a < 60) {
							cyInput().type('{uparrow}').should('have.value', `08:${a} PM`)
							a++
						}
						let b = 0
						while (b < 31) {
							cyInput().type('{uparrow}').should('have.value', `08:${toLeadingZero(b)} PM`)
							b++
						}
					})
				})
			}
			function decrementMinutes() {
				it('Should decrement as expected on down key press', () => {
					loadTestPage().then(({ $input }) => {
						selectSegment($input, 'minutes')
						let a = 29
						while (a > -1) {
							cyInput().type('{downarrow}').should('have.value', `08:${toLeadingZero(a)} PM`)
							a--
						}
						let b = 59
						while (b > 1) {
							cyInput().type('{downarrow}').should('have.value', `08:${toLeadingZero(b)} PM`)
							b--
						}
					})
				})
			}

			function deleteMinutes() {
				it('Should clear minutes on delete key press', () => {
					loadTestPage().then(({ $input }) => {
						selectSegment($input, 'minutes')
						cyInput().type('{del}').should('have.value', '08:-- PM')
					})
				})
				it('Should clear minutes on backspace key press', () => {
					loadTestPage().then(({ $input }) => {
						selectSegment($input, 'minutes')
						cyInput().type('{backspace}').should('have.value', '08:-- PM')
					})
				})
			}
		})
	}
})

export {}
