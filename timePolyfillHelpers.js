// converters
var convert_to_12hr_time = require('time-input-polyfill/core/converters/convert_to_12hr_time')
var convert_to_24hr_time = require('time-input-polyfill/core/converters/convert_to_24hr_time')

//selectors
var select_cursor_segment = require('time-input-polyfill/core/selectors/select_cursor_segment')
var select_segment = require('time-input-polyfill/core/selectors/select_segment')
var next_segment = require('time-input-polyfill/core/selectors/next_segment')
var prev_segment = require('time-input-polyfill/core/selectors/prev_segment')

// getters
var get_label = require('time-input-polyfill/core/getters/get_label')

// setters
var increment_current_segment = require('time-input-polyfill/core/setters/increment_current_segment')
var decrement_current_segment = require('time-input-polyfill/core/setters/decrement_current_segment')

// a11y
var create_a11y_block = require('time-input-polyfill/core/accessibility/create_a11y_block')

window.timePolyfillHelpers = {
	convert_to_12hr_time,
	convert_to_24hr_time,
	select_cursor_segment,
	select_segment,
	next_segment,
	prev_segment,
	get_label,
	increment_current_segment,
	decrement_current_segment,
	create_a11y_block,
}
