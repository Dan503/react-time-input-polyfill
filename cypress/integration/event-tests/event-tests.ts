import { functionVsClassBased } from '../../support/functionVsClassBased'
import { testSuite } from '../../support/testSuite'

functionVsClassBased({
	// only testing inputEvents, we don't need to support form submit tests in React
	functionBased: testSuite.functionBased.tests.events.inputEvents,
	classBased: testSuite.classBased.tests.events.inputEvents
})
