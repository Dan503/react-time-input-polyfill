import { TimeInputTestSuite } from '@time-input-polyfill/tests'
import { IDsAndLabels } from '../../src/App-tests-shared-stuff'

export const testSuite = {
	functionBased: new TimeInputTestSuite({
		localHostUrl: 'http://localhost:3000/react-time-input-polyfill',
		primaryTestsLabel: IDsAndLabels.functionBased.labels.primaryTestsLabel,
		eventTestsLabel: IDsAndLabels.functionBased.labels.eventTestsLabel,
	}),
	classBased: new TimeInputTestSuite({
		localHostUrl: 'http://localhost:3000/react-time-input-polyfill',
		primaryTestsLabel: IDsAndLabels.classBased.labels.primaryTestsLabel,
		eventTestsLabel: IDsAndLabels.classBased.labels.eventTestsLabel,
	})
}
