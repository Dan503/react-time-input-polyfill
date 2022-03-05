import { getIDsAndLabels } from '@time-input-polyfill/tests'

export type EventName =
	| 'focus'
	| 'blur'
	| 'mouseDown'
	| 'mouseUp'
	| 'keyDown'
	| 'keyUp'
	| 'none'

export type AltEventName =
	| 'change'
	| 'click'
	| 'none'

export const IDsAndLabels = {
	functionBased: getIDsAndLabels({
		primaryTestsLabel: 'Polyfill demo',
		eventTestsLabel: 'Function based events test - localhost only'
	}),
	classBased: getIDsAndLabels({
		primaryTestsLabel: 'Class based component example',
		eventTestsLabel: 'Class based events test - localhost only'
	})
}
