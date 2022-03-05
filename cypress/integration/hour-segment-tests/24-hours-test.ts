import { functionVsClassBased } from '../../support/functionVsClassBased'
import { testSuite } from '../../support/testSuite'

functionVsClassBased({
	functionBased: testSuite.functionBased.tests.hours.hrs24Values,
	classBased: testSuite.classBased.tests.hours.hrs24Values
})
