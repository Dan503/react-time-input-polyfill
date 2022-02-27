import { functionVsClassBased } from '../../support/functionVsClassBased'
import { testSuite } from '../../support/testSuite'

functionVsClassBased({
	functionBased: testSuite.functionBased.tests.mode.down,
	classBased: testSuite.classBased.tests.mode.down
})
