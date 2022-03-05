import { functionVsClassBased } from '../../support/functionVsClassBased'
import { testSuite } from '../../support/testSuite'

functionVsClassBased({
	functionBased: testSuite.functionBased.tests.segmentNavigation.viaJS,
	classBased: testSuite.classBased.tests.segmentNavigation.viaJS
})
