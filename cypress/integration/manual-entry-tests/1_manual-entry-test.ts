import { functionVsClassBased } from '../../support/functionVsClassBased'
import { testSuite } from '../../support/testSuite'

functionVsClassBased({
	functionBased: testSuite.functionBased.tests.manualEntry._1,
	classBased: testSuite.classBased.tests.manualEntry._1
})
