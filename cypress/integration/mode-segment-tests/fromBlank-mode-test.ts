import { functionVsClassBased } from '../../support/functionVsClassBased'
import { testSuite } from '../../support/testSuite'

functionVsClassBased({
	functionBased: testSuite.functionBased.tests.mode.fromBlank,
	classBased: testSuite.classBased.tests.mode.fromBlank
})
