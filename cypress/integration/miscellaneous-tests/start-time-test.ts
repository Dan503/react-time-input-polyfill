import { functionVsClassBased } from '../../support/functionVsClassBased'
import { testSuite } from '../../support/testSuite'

functionVsClassBased({
	functionBased: testSuite.functionBased.tests.miscellaneous.startTime,
	classBased: testSuite.classBased.tests.miscellaneous.startTime
})
