// This needs to be a JS file because Rollup can't handle TypeScript
// It really doesn't need to be TypeScript anyway
// Also, the output is smaller if I import each thing as directly as possible
import {
	a11yClear,
	a11yCreate,
	a11yUpdate,
	getA11yElement,
	getA11yValue,
} from '@time-input-polyfill/utils/npm/core/a11y/a11y'
import {
	convertString12hr,
	convertString24hr,
} from '@time-input-polyfill/utils/npm/core/convert/convert'
import {
	getCursorSegment,
	getNextSegment,
	getPrevSegment,
} from '@time-input-polyfill/utils/npm/core/get/get'
import { isShiftHeldDown } from '@time-input-polyfill/utils/npm/core/is/is'
import { ManualEntryLog } from '@time-input-polyfill/utils/npm/core/ManualEntryLog/ManualEntryLog'
import { modifyTimeObject } from '@time-input-polyfill/utils/npm/core/modify/modify'
import { regex } from '@time-input-polyfill/utils/npm/core/regex/regex'
import { selectCursorSegment } from '@time-input-polyfill/utils/npm/core/select/select'
import { matchesTimeObject } from '@time-input-polyfill/utils/npm/core/utils/utils'

window.timeInputPolyfillUtils = {
	a11yCreate,
	a11yUpdate,
	a11yClear,
	getA11yElement,
	getA11yValue,
	convertString12hr,
	convertString24hr,
	getNextSegment,
	getPrevSegment,
	getCursorSegment,
	isShiftHeldDown,
	ManualEntryLog,
	modifyTimeObject,
	regex,
	selectCursorSegment,
	matchesTimeObject,
}
