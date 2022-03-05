import { functionVsClassBased } from '../../support/functionVsClassBased'
import { testSuite } from '../../support/testSuite'

functionVsClassBased({
	functionBased: testSuite.functionBased.tests.minutes.decrement,
	classBased: testSuite.classBased.tests.minutes.decrement
})
