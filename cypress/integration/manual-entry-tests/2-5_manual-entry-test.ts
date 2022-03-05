import { functionVsClassBased } from '../../support/functionVsClassBased'
import { testSuite } from '../../support/testSuite'

functionVsClassBased({
	functionBased: testSuite.functionBased.tests.manualEntry._2_5,
	classBased: testSuite.classBased.tests.manualEntry._2_5
})
