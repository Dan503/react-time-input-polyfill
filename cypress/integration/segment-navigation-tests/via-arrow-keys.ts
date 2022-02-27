import { functionVsClassBased } from '../../support/functionVsClassBased'
import { testSuite } from '../../support/testSuite'

functionVsClassBased({
	functionBased: testSuite.functionBased.tests.segmentNavigation.viaArrowKeys,
	classBased: testSuite.classBased.tests.segmentNavigation.viaArrowKeys
})
