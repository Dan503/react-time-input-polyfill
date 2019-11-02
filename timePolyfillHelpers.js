//static-values
var segments = require('time-input-polyfill/core/static-values/segments')

// converters
var convert_to_12hr_time = require('time-input-polyfill/core/converters/convert_to_12hr_time')
var convert_to_24hr_time = require('time-input-polyfill/core/converters/convert_to_24hr_time')
var convert_hours_to_12hr_time = require('time-input-polyfill/core/converters/convert_hours_to_12hr_time')

//selectors
var select_cursor_segment = require('time-input-polyfill/core/selectors/select_cursor_segment')
var select_segment = require('time-input-polyfill/core/selectors/select_segment')
var next_segment = require('time-input-polyfill/core/selectors/next_segment')
var prev_segment = require('time-input-polyfill/core/selectors/prev_segment')

// getters
var get_label = require('time-input-polyfill/core/getters/get_label')
var get_current_segment = require('time-input-polyfill/core/getters/get_current_segment')
var get_values = require('time-input-polyfill/core/getters/get_values')

// manual_entry_log
function manual_entry_log() {
	this.items = []
}
manual_entry_log.prototype.clear = function() {
	this.items = []
}
manual_entry_log.prototype.add = function(entry) {
	this.items.push(parseInt(entry))
}

var get_values_from_24hr = value24hr => {
	const value12hr = convert_to_12hr_time(value24hr)
	return get_values(null, value12hr)
}

// a11y
var create_a11y_block = require('time-input-polyfill/core/accessibility/create_a11y_block')

window.timePolyfillHelpers = {
	segments,
	convert_to_12hr_time,
	convert_to_24hr_time,
	convert_hours_to_12hr_time,
	select_cursor_segment,
	select_segment,
	next_segment,
	prev_segment,
	get_label,
	get_current_segment,
	get_values,
	get_values_from_24hr,
	create_a11y_block,
	manual_entry_log,
}
