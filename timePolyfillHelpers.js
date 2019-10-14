// converters
var convert_to_12hr_time = require('time-input-polyfill/core/converters/convert_to_12hr_time')
var convert_to_24hr_time = require('time-input-polyfill/core/converters/convert_to_24hr_time')

//selectors
var select_cursor_segment = require('time-input-polyfill/core/selectors/select_cursor_segment')
var select_segment = require('time-input-polyfill/core/selectors/select_segment')
var next_segment = require('time-input-polyfill/core/selectors/next_segment')
var prev_segment = require('time-input-polyfill/core/selectors/prev_segment')

window.timePolyfillHelpers = {
	convert_to_12hr_time,
	convert_to_24hr_time,
	select_cursor_segment,
	select_segment,
	next_segment,
	prev_segment,
}
