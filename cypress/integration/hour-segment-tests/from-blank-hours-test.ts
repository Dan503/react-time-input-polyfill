import { functionVsClassBased } from '../../support/functionVsClassBased'
import { testSuite } from '../../support/testSuite'

functionVsClassBased({
	functionBased: testSuite.functionBased.tests.hours.fromBlank,
	classBased: testSuite.classBased.tests.hours.fromBlank
})
