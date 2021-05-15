//static-values
import segments from 'time-input-polyfill/core/static-values/segments'

// converters
import convert_to_12hr_time from 'time-input-polyfill/core/converters/convert_to_12hr_time'
import convert_to_24hr_time from 'time-input-polyfill/core/converters/convert_to_24hr_time'
import convert_hours_to_12hr_time from 'time-input-polyfill/core/converters/convert_hours_to_12hr_time'

//selectors
import select_cursor_segment from 'time-input-polyfill/core/selectors/select_cursor_segment'
import select_segment from 'time-input-polyfill/core/selectors/select_segment'
import next_segment from 'time-input-polyfill/core/selectors/next_segment'
import prev_segment from 'time-input-polyfill/core/selectors/prev_segment'

// getters
import get_label from 'time-input-polyfill/core/getters/get_label'
import get_current_segment from 'time-input-polyfill/core/getters/get_current_segment'
import get_values from 'time-input-polyfill/core/getters/get_values'

// a11y
import create_a11y_block from 'time-input-polyfill/core/accessibility/create_a11y_block'
import update_a11y from 'time-input-polyfill/core/accessibility/update_a11y'

Element.prototype.matches =
	Element.prototype.matches || Element.prototype.msMatchesSelector

// manual_entry_log
function manual_entry_log() {
	this.items = []
}
manual_entry_log.prototype.clear = function () {
	this.items = []
}
manual_entry_log.prototype.add = function (entry) {
	this.items.push(parseInt(entry))
}

var get_values_from_24hr = (value24hr) => {
	const value12hr = convert_to_12hr_time(value24hr)
	return get_values(null, value12hr)
}

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
	update_a11y,
	manual_entry_log,
}
