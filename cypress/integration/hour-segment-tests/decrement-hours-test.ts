import { functionVsClassBased } from '../../support/functionVsClassBased'
import { testSuite } from '../../support/testSuite'

functionVsClassBased({
	functionBased: testSuite.functionBased.tests.hours.decrement,
	classBased: testSuite.classBased.tests.hours.decrement
})
