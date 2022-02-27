import { functionVsClassBased } from '../../support/functionVsClassBased'
import { testSuite } from '../../support/testSuite'

functionVsClassBased({
	functionBased: testSuite.functionBased.tests.buttons.togglePolyfill,
	classBased: testSuite.classBased.tests.buttons.togglePolyfill
})
