
import { loadJS } from 'time-input-polyfill-utils/common'
import 'time-input-polyfill-utils/types/Window'

let polyfillLoadCalled = false

export const loadPolyfill = (onPolyfillLoad: Function) => {
	if (polyfillLoadCalled) return null
	polyfillLoadCalled = true

	// TO DO 1st: Use this when v1.0.0 is released: https://cdn.jsdelivr.net/npm/time-input-polyfill-utils@1
	// TO DO 2nd: Create a local polyfill file that only holds the things that are needed
	loadJS('https://cdn.jsdelivr.net/npm/time-input-polyfill-utils@1.0.0-beta.8',
		() => {
			onPolyfillLoad(window.timeInputPolyfillUtils)
		},
	)
}
