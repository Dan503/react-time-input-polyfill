import { functionVsClassBased } from '../../support/functionVsClassBased'
import { testSuite } from '../../support/testSuite'

functionVsClassBased({
	functionBased: testSuite.functionBased.tests.manualEntry.other,
	classBased: testSuite.classBased.tests.manualEntry.other
})
