import { functionVsClassBased } from '../../support/functionVsClassBased'
import { testSuite } from '../../support/testSuite'

functionVsClassBased({
	functionBased: testSuite.functionBased.tests.manualEntry._6_9,
	classBased: testSuite.classBased.tests.manualEntry._6_9
})
