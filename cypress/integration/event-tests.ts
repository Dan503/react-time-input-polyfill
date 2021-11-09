import { EventName, AltEventName } from "../../src/App-tests-shared-stuff"
import { loadTestPage } from "../support"

const eventsTestInput = () => cy.get('#Events-test-localhost-only-input')

const eventValue = () => cy.get('#events-test-value')
const eventName = () => cy.get('#events-test-eventName')
const eventAltName = () => cy.get('#events-test-altEventName')

const hasValue = (value: string) => () => eventValue().should('have.text', value).then(eventsTestInput)
const hasName = (name: EventName) => () => eventName().should('have.text', name).then(eventsTestInput)
const hasAltName = (name: AltEventName) => () => eventAltName().should('have.text', name).then(eventsTestInput)

const keyDown = () => eventsTestInput().trigger('keydown', { key: 'ArrowUp' })
const keyUp = () => eventsTestInput().trigger('keyup', { key: 'ArrowUp' })

const mouseDown = () => eventsTestInput().trigger('mousedown')
const mouseUp = () => eventsTestInput().trigger('mouseup')

describe('Event tests', () => {
	it('ensures events work', () => {
		loadTestPage({ polyfillId: 'Events-test-localhost-only-input' })
			.then(hasValue('default'))
			.then(hasName('none'))
			.then(hasAltName('none'))
			.focus()
			.then(hasValue('08:30 PM'))
			.then(hasName('focus'))
			.then(hasAltName('none'))
			.then(keyDown)
			// Due to the event getting fired before the state has settled, the value is out of sync with the state
			// It is out of scope to adjust the timing of all possible events so that they align with when the state updates
			.then(hasValue('08:30 PM'))
			.then(hasName('keyDown'))
			.then(hasAltName('change'))
			.then(keyUp)
			.then(hasValue('09:30 PM'))
			.then(hasName('keyUp'))
			.then(hasAltName('change'))
			.blur()
			.then(hasValue('09:30 PM'))
			.then(hasName('blur'))
			.then(hasAltName('change'))
			.then(mouseDown)
			.then(hasValue('09:30 PM'))
			.then(hasName('mouseDown'))
			.then(hasAltName('change'))
			.then(mouseUp)
			.then(hasValue('09:30 PM'))
			.then(hasName('mouseUp'))
			// For normal users this would trigger a 'click' event but for Cypress it doesn't
			.then(hasAltName('change'))
			.click()
			.then(hasValue('09:30 PM'))
			.then(hasName('mouseUp'))
			.then(hasAltName('click'))
	})
})
