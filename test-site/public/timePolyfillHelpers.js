(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

module.exports = function create_accessibility_block () {
	var $block = document.createElement('div');
	$block.setAttribute('aria-live', 'assertive');
	$block.setAttribute('style', 'position: absolute; opacity: 0; height: 0; width: 0; overflow: hidden; pointer-events: none;');
	$block.classList.add('time-input-polyfill-accessibility-block');
	document.querySelector('body').appendChild($block);
	return $block;
}

},{}],2:[function(require,module,exports){

var get_current_segment = require('../getters/get_current_segment');
var get_values = require('../getters/get_values');

module.exports = function update_a11y ($input, announcementArray) {
	// Timeout helps ensure that the input has stabilized
	setTimeout(function(){
		var current_segment = get_current_segment($input);
		var values = get_values($input);
		var value = values[current_segment];
		var finalValue = value == '--' ? 'blank' : value;

		var segmentName = {
			hrs: 'Hours',
			min: 'Minutes',
			mode: 'AM/PM'
		}[current_segment];

		var announcements = {
			initial: '$label grouping $fullValue.',
			select: '$segmentName spin button $segmentValue.',
			update: '$segmentValue.',
		}

		var textArray = announcementArray.map(function(providedString){
			if (announcements[providedString]) {
				return announcements[providedString];
			}
			return providedString;
		});

		var fullValue = $input.value.replace(/--/g,'blank');

		var html = '<p>' + textArray.join('</p><p>') + '</p>';
		html = html.replace(/\$label/g, $input.polyfill.label);
		html = html.replace(/\$segmentName/g, segmentName);
		html = html.replace(/\$segmentValue/g, finalValue);
		html = html.replace(/\$fullValue/g, fullValue);

		$input.polyfill.$a11y.innerHTML = html;
	}, 1);
}

},{"../getters/get_current_segment":12,"../getters/get_values":15}],3:[function(require,module,exports){

module.exports = function convert_hours_to_12hr_time (hours) {
	return hours <= 12 ? hours === 0 ? 12 : hours : hours - 12;
}

},{}],4:[function(require,module,exports){

module.exports = function convert_number (number) {
	return isNaN(number) ? number : parseInt(number);
}

},{}],5:[function(require,module,exports){

var convert_number = require('./convert_number');
var convert_hours_to_12hr_time = require('./convert_hours_to_12hr_time');
var leading_zero = require('./leading_zero');

module.exports = function convert_to_12hr_time (timeString_24hr) {
	if (timeString_24hr === '') return '--:-- --';
	var twentyFour_regex = /([0-9]{2})\:([0-9]{2})/;
	var result = twentyFour_regex.exec(timeString_24hr);
	var hrs_24 = convert_number(result[1]);
	var min = result[2];
	var hrs_12 = convert_hours_to_12hr_time(hrs_24);
	var isPM = hrs_24 > 12;
	var mode = isPM ? 'PM' : 'AM';
	return [leading_zero(hrs_12), ':', min, ' ', mode].join('');
}

},{"./convert_hours_to_12hr_time":3,"./convert_number":4,"./leading_zero":7}],6:[function(require,module,exports){

var leading_zero = require('./leading_zero');

module.exports = function convert_to_24hr_time (timeString_12hr) {
	if (/-/.test(timeString_12hr)) return '';
	var isPM = timeString_12hr.indexOf('PM') > -1;
	var timeResult = /^([0-9]{2})/.exec(timeString_12hr);
	var hrs = timeResult ? parseInt(timeResult[1]) : '';
	var newHrs;
	if (hrs === 12) {
		newHrs = isPM ? 12 : 0;
	} else {
		newHrs = isPM ? hrs + 12 : hrs;
	}
	var finalHrs = newHrs === 24 ? 0 : newHrs;
	var timeRegEx = /^[0-9]{2}:([0-9]{2}) (AM|PM)/;
	return timeString_12hr.replace(timeRegEx, leading_zero(finalHrs)+':$1');
}

},{"./leading_zero":7}],7:[function(require,module,exports){

module.exports = function leading_zero (number) {
	if (isNaN(number)) return number;
	var purified = parseInt(number);
	return purified < 10 ? '0' + purified : number;
}

},{}],8:[function(require,module,exports){

module.exports = function create_event(eventName){
	var event = document.createEvent('Event');
	event.initEvent(eventName, true, true);
	return event;
}

},{}],9:[function(require,module,exports){

var trigger_event = require('./trigger_event');

// It seems that oninput and onchange are treated the same way by browsers :/
module.exports = function trigger_both_events($input) {
	// the event only ever fires if there is a full valid value available
	trigger_event($input, 'input');
	trigger_event($input,'change');
}

},{"./trigger_event":10}],10:[function(require,module,exports){

var create_event = require('./create_event');

var inputEvent = create_event('input');
var changeEvent = create_event('change');

module.exports = function trigger_event($input, eventName) {
	var event = {
		input: inputEvent,
		change: changeEvent,
	}[eventName];

	if (can_trigger_change($input)) {
		$input.dispatchEvent(event);
	}
}

// Browsers only send out input and change events if the time element has a full valid value
function can_trigger_change ($input) {
	return !/--/.test($input.value);
}

},{"./create_event":8}],11:[function(require,module,exports){
// selector is optional, it allows for an early exit
module.exports = function ($input, selectorString) {
	var $elem = $input;

	// https://stackoverflow.com/a/8729274/1611058
	var ancestors = [];
	while ($elem) {
		ancestors.push($elem);
		var matchesSelector = $elem.msMatchesSelector ?
			$elem.msMatchesSelector(selectorString) :
			$elem.matches(selectorString);
		if (matchesSelector) {
			return ancestors;
		}
		$elem = $elem.parentElement;
	}

	return ancestors;
}

},{}],12:[function(require,module,exports){

var ranges = require('../static-values/ranges');
var get_selected_range = require('./get_selected_range');

module.exports = function get_current_segment ($input) {
	var selection = get_selected_range($input);
	for (var segment in ranges) {
		var range = ranges[segment];
		var aboveMin = range.start <= selection.start;
		var belowMax = range.end >= selection.end;
		if (aboveMin && belowMax) {
			return segment;
		}
	}
	return 'hrs';
}

},{"../static-values/ranges":30,"./get_selected_range":14}],13:[function(require,module,exports){

var get_ancestors = require('./get_ancestors');

module.exports = function get_label ($input) {

	var labelText =
		aria_labelledby($input) ||
		aria_label($input) ||
		for_attribute($input) ||
		label_wrapper_element($input) ||
		title_attribute($input);

	if (labelText) return labelText;

	console.error('Label text for input not found.', $input);
	throw new Error('Cannot polyfill time input due to a missing label.');
}

function aria_labelledby($input){
	var ariaLabelByID = $input.getAttribute('aria-labelledby');
	if (ariaLabelByID) {
		var $ariaLabelBy = document.getElementById(ariaLabelByID);
		if ($ariaLabelBy) return $ariaLabelBy.textContent;
	}
	return false;
}

function aria_label($input){
	var ariaLabel = $input.getAttribute('aria-label');
	if (ariaLabel) return ariaLabel;
	return false;
}

function for_attribute($input){
	if ($input.id) {
		var $forLabel = document.querySelector('label[for="'+$input.id+'"]');
		if ($forLabel) return $forLabel.textContent;
	}
	return false;
}

function label_wrapper_element($input){
	var ancestors = get_ancestors($input, 'label');
	var $parentLabel = ancestors[ancestors.length - 1];
	if ($parentLabel.nodeName == 'LABEL') return $parentLabel.textContent;
	return false
}

function title_attribute($input){
	var titleLabel = $input.getAttribute('title');
	if (titleLabel) return titleLabel;
	return false
}

},{"./get_ancestors":11}],14:[function(require,module,exports){

module.exports = function get_selected_range ($input) {
	return { start: $input.selectionStart, end: $input.selectionEnd };
}

},{}],15:[function(require,module,exports){

var convert_number = require('../converters/convert_number');

module.exports = function get_values ($input, timeString) {
	var value = timeString ? timeString : $input.value;
	var regEx = /([0-9-]{1,2})\:([0-9-]{1,2})\s?(AM|PM|\-\-)?/;
	var result = regEx.exec(value);

	return {
		hrs: convert_number(result[1]),
		min: convert_number(result[2]),
		mode: result[3],
	}
}

},{"../converters/convert_number":4}],16:[function(require,module,exports){

var manual_entry_log = [];

function clear () {
	manual_entry_log = [];
}

function add (entry) {
	manual_entry_log.push(entry);
}

function items(){
	return manual_entry_log;
}

module.exports = {
	items: items,
	clear: clear,
	add: add,
}

},{}],17:[function(require,module,exports){

var traverse = require('./traverse');

module.exports = function next_segment ($input) {
	traverse($input, 'next');
}

},{"./traverse":21}],18:[function(require,module,exports){

var traverse = require('./traverse');

module.exports = function prev_segment ($input) {
	traverse($input, 'prev');
}

},{"./traverse":21}],19:[function(require,module,exports){

var get_current_segment = require('../getters/get_current_segment');
var select_segment = require('./select_segment');

module.exports = function select_cursor_segment ($input) {
	var current_segment = get_current_segment($input);
	select_segment($input, current_segment);
}

},{"../getters/get_current_segment":12,"./select_segment":20}],20:[function(require,module,exports){

module.exports = function select_segment ($input, segment) {

	set_input_type();

	var actions = {
		hrs:  select(0, 2),
		min:  select(3, 5),
		mode: select(6, 8),
	};

	actions[segment]($input);

	function set_input_type() {
		var type = segment === 'mode' ? 'text' : 'tel';
		$input.setAttribute('type', type);
	}

	function select (start, end) {
		return function () {
			$input.setSelectionRange(start, end);
		}
	}
}

},{}],21:[function(require,module,exports){

var get_current_segment = require('../getters/get_current_segment');
var select_segment = require('../selectors/select_segment');

var manual_entry_log = require('../helpers/manual_entry_log');
var segments = require('../static-values/segments');

var update_a11y = require('../accessibility/update_a11y');

module.exports = function traverse ($input, direction) {
	var segment = get_current_segment($input);

	var modifier = direction === 'next' ? 1 : -1;
	var next_segment_index = segments.indexOf(segment) + modifier;

	var next_segment = {
		next: segments[next_segment_index] || 'mode',
		prev: next_segment_index < 0 ? 'hrs' : segments[next_segment_index],
	}[direction];

	select_segment($input, next_segment);
	manual_entry_log.clear();
	update_a11y($input, ['select'])
}

},{"../accessibility/update_a11y":2,"../getters/get_current_segment":12,"../helpers/manual_entry_log":16,"../selectors/select_segment":20,"../static-values/segments":31}],22:[function(require,module,exports){

var switch_mode = require('./switch_mode');
var nudge_time_segment = require('./nudge_time_segment');
var update_a11y = require('../accessibility/update_a11y');

module.exports = function decrement ($input, segment) {
	if (segment === 'mode') {
		switch_mode($input, 'PM')
	} else {
		nudge_time_segment($input, segment, 'down');
	}
	update_a11y($input, ['update']);
}

},{"../accessibility/update_a11y":2,"./nudge_time_segment":26,"./switch_mode":29}],23:[function(require,module,exports){

var get_current_segment = require('../getters/get_current_segment');
var decrement = require('../setters/decrement');

module.exports = function decrement_current_segment ($input){
	var current_segment = get_current_segment($input);
	decrement($input, current_segment);
}

},{"../getters/get_current_segment":12,"../setters/decrement":22}],24:[function(require,module,exports){

var switch_mode = require('./switch_mode');
var nudge_time_segment = require('./nudge_time_segment');
var update_a11y = require('../accessibility/update_a11y');

module.exports = function increment ($input, segment) {
	if (segment === 'mode') {
		switch_mode($input, 'AM')
	} else {
		nudge_time_segment($input, segment, 'up');
	}
	update_a11y($input, ['update']);
}


},{"../accessibility/update_a11y":2,"./nudge_time_segment":26,"./switch_mode":29}],25:[function(require,module,exports){

var get_current_segment = require('../getters/get_current_segment');
var increment = require('../setters/increment');

module.exports = function increment_current_segment ($input) {
	var current_segment = get_current_segment($input);
	increment($input, current_segment);
}

},{"../getters/get_current_segment":12,"../setters/increment":24}],26:[function(require,module,exports){

var get_values = require('../getters/get_values');
var convert_hours_to_12hr_time = require('../converters/convert_hours_to_12hr_time');
var leading_zero = require('../converters/leading_zero');
var set_segment = require('./set_segment');

module.exports = function nudge_time_segment ($input, segment, direction) {
	var current_values = get_values($input);
	var time;

	var modifier = direction === 'up' ? 1 : -1;

	if (current_values[segment] === '--') {
		var current_time = new Date();
		time = {
			hrs: convert_hours_to_12hr_time(current_time.getHours()),
			min: current_time.getMinutes(),
		}
	} else {
		var minutes = {
			up : current_values.min < 59 ? current_values.min + modifier : 0,
			down : current_values.min === 0 ? 59 : current_values.min + modifier,
		}
		time = {
			hrs: convert_hours_to_12hr_time(current_values.hrs + modifier),
			min: minutes[direction],
		}
	}

	set_segment($input, segment, leading_zero(time[segment]) );
}

},{"../converters/convert_hours_to_12hr_time":3,"../converters/leading_zero":7,"../getters/get_values":15,"./set_segment":28}],27:[function(require,module,exports){

var convert_to_24hr_time = require('../converters/convert_to_24hr_time')

module.exports = function set_data_attribute($input, timeString_12hr){
	var filteredString = timeString_12hr.indexOf('-') > -1 ? '' : timeString_12hr;
	var time24hr = convert_to_24hr_time(filteredString);
	$input.setAttribute('data-value', time24hr);
}

},{"../converters/convert_to_24hr_time":6}],28:[function(require,module,exports){

var get_values = require('../getters/get_values');
var leading_zero = require('../converters/leading_zero');
var select_segment = require('../selectors/select_segment');
var set_data_attribute = require('./set_data_attribute');
var trigger_both_events = require('../events/trigger_both_events');

module.exports = function set_segment ($input, segment, value) {
	var values = get_values($input);
	values[segment] = value;
	var newInputVal = [
		leading_zero(values.hrs),':',
		leading_zero(values.min),' ',
		values.mode
	].join('');
	$input.value = newInputVal;
	select_segment($input, segment);
	set_data_attribute($input, newInputVal);
	trigger_both_events($input);
}

},{"../converters/leading_zero":7,"../events/trigger_both_events":9,"../getters/get_values":15,"../selectors/select_segment":20,"./set_data_attribute":27}],29:[function(require,module,exports){

var get_values = require('../getters/get_values');
var set_segment = require('./set_segment');

module.exports = function switch_mode ($input, default_mode) {
	default_mode = default_mode || 'AM';
	var current_mode = get_values($input).mode;
	var new_mode = {
		'--' : default_mode,
		'AM' : 'PM',
		'PM' : 'AM',
	}[current_mode];
	set_segment($input, 'mode', new_mode);
}

},{"../getters/get_values":15,"./set_segment":28}],30:[function(require,module,exports){

var ranges = {
	hrs : { start: 0, end: 2 },
	min : { start: 3, end: 5 },
	mode : { start: 6, end: 8 },
}

module.exports = ranges;

},{}],31:[function(require,module,exports){

var ranges = require('./ranges');

var segments = Object.keys(ranges);

module.exports = segments;

},{"./ranges":30}],32:[function(require,module,exports){
// converters
var convert_to_12hr_time = require('time-input-polyfill/core/converters/convert_to_12hr_time');

var convert_to_24hr_time = require('time-input-polyfill/core/converters/convert_to_24hr_time'); //selectors


var select_cursor_segment = require('time-input-polyfill/core/selectors/select_cursor_segment');

var select_segment = require('time-input-polyfill/core/selectors/select_segment');

var next_segment = require('time-input-polyfill/core/selectors/next_segment');

var prev_segment = require('time-input-polyfill/core/selectors/prev_segment'); // getters


var get_label = require('time-input-polyfill/core/getters/get_label'); // setters


var increment_current_segment = require('time-input-polyfill/core/setters/increment_current_segment');

var decrement_current_segment = require('time-input-polyfill/core/setters/decrement_current_segment'); // a11y


var create_a11y_block = require('time-input-polyfill/core/accessibility/create_a11y_block');

window.timePolyfillHelpers = {
  convert_to_12hr_time: convert_to_12hr_time,
  convert_to_24hr_time: convert_to_24hr_time,
  select_cursor_segment: select_cursor_segment,
  select_segment: select_segment,
  next_segment: next_segment,
  prev_segment: prev_segment,
  get_label: get_label,
  increment_current_segment: increment_current_segment,
  decrement_current_segment: decrement_current_segment,
  create_a11y_block: create_a11y_block
};

},{"time-input-polyfill/core/accessibility/create_a11y_block":1,"time-input-polyfill/core/converters/convert_to_12hr_time":5,"time-input-polyfill/core/converters/convert_to_24hr_time":6,"time-input-polyfill/core/getters/get_label":13,"time-input-polyfill/core/selectors/next_segment":17,"time-input-polyfill/core/selectors/prev_segment":18,"time-input-polyfill/core/selectors/select_cursor_segment":19,"time-input-polyfill/core/selectors/select_segment":20,"time-input-polyfill/core/setters/decrement_current_segment":23,"time-input-polyfill/core/setters/increment_current_segment":25}]},{},[32])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2FjY2Vzc2liaWxpdHkvY3JlYXRlX2ExMXlfYmxvY2suanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2FjY2Vzc2liaWxpdHkvdXBkYXRlX2ExMXkuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvY29udmVydF9ob3Vyc190b18xMmhyX3RpbWUuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvY29udmVydF9udW1iZXIuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvY29udmVydF90b18xMmhyX3RpbWUuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvY29udmVydF90b18yNGhyX3RpbWUuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvbGVhZGluZ196ZXJvLmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9ldmVudHMvY3JlYXRlX2V2ZW50LmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9ldmVudHMvdHJpZ2dlcl9ib3RoX2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvZXZlbnRzL3RyaWdnZXJfZXZlbnQuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2dldHRlcnMvZ2V0X2FuY2VzdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvZ2V0dGVycy9nZXRfY3VycmVudF9zZWdtZW50LmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9nZXR0ZXJzL2dldF9sYWJlbC5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvZ2V0dGVycy9nZXRfc2VsZWN0ZWRfcmFuZ2UuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2dldHRlcnMvZ2V0X3ZhbHVlcy5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvaGVscGVycy9tYW51YWxfZW50cnlfbG9nLmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zZWxlY3RvcnMvbmV4dF9zZWdtZW50LmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zZWxlY3RvcnMvcHJldl9zZWdtZW50LmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zZWxlY3RvcnMvc2VsZWN0X2N1cnNvcl9zZWdtZW50LmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zZWxlY3RvcnMvc2VsZWN0X3NlZ21lbnQuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL3NlbGVjdG9ycy90cmF2ZXJzZS5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvc2V0dGVycy9kZWNyZW1lbnQuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL3NldHRlcnMvZGVjcmVtZW50X2N1cnJlbnRfc2VnbWVudC5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvc2V0dGVycy9pbmNyZW1lbnQuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL3NldHRlcnMvaW5jcmVtZW50X2N1cnJlbnRfc2VnbWVudC5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvc2V0dGVycy9udWRnZV90aW1lX3NlZ21lbnQuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL3NldHRlcnMvc2V0X2RhdGFfYXR0cmlidXRlLmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zZXR0ZXJzL3NldF9zZWdtZW50LmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zZXR0ZXJzL3N3aXRjaF9tb2RlLmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zdGF0aWMtdmFsdWVzL3Jhbmdlcy5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvc3RhdGljLXZhbHVlcy9zZWdtZW50cy5qcyIsInRpbWVQb2x5ZmlsbEhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBLElBQUksb0JBQW9CLEdBQUcsT0FBTyxDQUFDLDBEQUFELENBQWxDOztBQUNBLElBQUksb0JBQW9CLEdBQUcsT0FBTyxDQUFDLDBEQUFELENBQWxDLEMsQ0FFQTs7O0FBQ0EsSUFBSSxxQkFBcUIsR0FBRyxPQUFPLENBQUMsMERBQUQsQ0FBbkM7O0FBQ0EsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLG1EQUFELENBQTVCOztBQUNBLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxpREFBRCxDQUExQjs7QUFDQSxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsaURBQUQsQ0FBMUIsQyxDQUVBOzs7QUFDQSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsNENBQUQsQ0FBdkIsQyxDQUVBOzs7QUFDQSxJQUFJLHlCQUF5QixHQUFHLE9BQU8sQ0FBQyw0REFBRCxDQUF2Qzs7QUFDQSxJQUFJLHlCQUF5QixHQUFHLE9BQU8sQ0FBQyw0REFBRCxDQUF2QyxDLENBRUE7OztBQUNBLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLDBEQUFELENBQS9COztBQUVBLE1BQU0sQ0FBQyxtQkFBUCxHQUE2QjtBQUM1QixFQUFBLG9CQUFvQixFQUFwQixvQkFENEI7QUFFNUIsRUFBQSxvQkFBb0IsRUFBcEIsb0JBRjRCO0FBRzVCLEVBQUEscUJBQXFCLEVBQXJCLHFCQUg0QjtBQUk1QixFQUFBLGNBQWMsRUFBZCxjQUo0QjtBQUs1QixFQUFBLFlBQVksRUFBWixZQUw0QjtBQU01QixFQUFBLFlBQVksRUFBWixZQU40QjtBQU81QixFQUFBLFNBQVMsRUFBVCxTQVA0QjtBQVE1QixFQUFBLHlCQUF5QixFQUF6Qix5QkFSNEI7QUFTNUIsRUFBQSx5QkFBeUIsRUFBekIseUJBVDRCO0FBVTVCLEVBQUEsaUJBQWlCLEVBQWpCO0FBVjRCLENBQTdCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlX2FjY2Vzc2liaWxpdHlfYmxvY2sgKCkge1xyXG5cdHZhciAkYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHQkYmxvY2suc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCAnYXNzZXJ0aXZlJyk7XHJcblx0JGJsb2NrLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAncG9zaXRpb246IGFic29sdXRlOyBvcGFjaXR5OiAwOyBoZWlnaHQ6IDA7IHdpZHRoOiAwOyBvdmVyZmxvdzogaGlkZGVuOyBwb2ludGVyLWV2ZW50czogbm9uZTsnKTtcclxuXHQkYmxvY2suY2xhc3NMaXN0LmFkZCgndGltZS1pbnB1dC1wb2x5ZmlsbC1hY2Nlc3NpYmlsaXR5LWJsb2NrJyk7XHJcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLmFwcGVuZENoaWxkKCRibG9jayk7XHJcblx0cmV0dXJuICRibG9jaztcclxufVxyXG4iLCJcclxudmFyIGdldF9jdXJyZW50X3NlZ21lbnQgPSByZXF1aXJlKCcuLi9nZXR0ZXJzL2dldF9jdXJyZW50X3NlZ21lbnQnKTtcclxudmFyIGdldF92YWx1ZXMgPSByZXF1aXJlKCcuLi9nZXR0ZXJzL2dldF92YWx1ZXMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdXBkYXRlX2ExMXkgKCRpbnB1dCwgYW5ub3VuY2VtZW50QXJyYXkpIHtcclxuXHQvLyBUaW1lb3V0IGhlbHBzIGVuc3VyZSB0aGF0IHRoZSBpbnB1dCBoYXMgc3RhYmlsaXplZFxyXG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdHZhciBjdXJyZW50X3NlZ21lbnQgPSBnZXRfY3VycmVudF9zZWdtZW50KCRpbnB1dCk7XHJcblx0XHR2YXIgdmFsdWVzID0gZ2V0X3ZhbHVlcygkaW5wdXQpO1xyXG5cdFx0dmFyIHZhbHVlID0gdmFsdWVzW2N1cnJlbnRfc2VnbWVudF07XHJcblx0XHR2YXIgZmluYWxWYWx1ZSA9IHZhbHVlID09ICctLScgPyAnYmxhbmsnIDogdmFsdWU7XHJcblxyXG5cdFx0dmFyIHNlZ21lbnROYW1lID0ge1xyXG5cdFx0XHRocnM6ICdIb3VycycsXHJcblx0XHRcdG1pbjogJ01pbnV0ZXMnLFxyXG5cdFx0XHRtb2RlOiAnQU0vUE0nXHJcblx0XHR9W2N1cnJlbnRfc2VnbWVudF07XHJcblxyXG5cdFx0dmFyIGFubm91bmNlbWVudHMgPSB7XHJcblx0XHRcdGluaXRpYWw6ICckbGFiZWwgZ3JvdXBpbmcgJGZ1bGxWYWx1ZS4nLFxyXG5cdFx0XHRzZWxlY3Q6ICckc2VnbWVudE5hbWUgc3BpbiBidXR0b24gJHNlZ21lbnRWYWx1ZS4nLFxyXG5cdFx0XHR1cGRhdGU6ICckc2VnbWVudFZhbHVlLicsXHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHRleHRBcnJheSA9IGFubm91bmNlbWVudEFycmF5Lm1hcChmdW5jdGlvbihwcm92aWRlZFN0cmluZyl7XHJcblx0XHRcdGlmIChhbm5vdW5jZW1lbnRzW3Byb3ZpZGVkU3RyaW5nXSkge1xyXG5cdFx0XHRcdHJldHVybiBhbm5vdW5jZW1lbnRzW3Byb3ZpZGVkU3RyaW5nXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcHJvdmlkZWRTdHJpbmc7XHJcblx0XHR9KTtcclxuXHJcblx0XHR2YXIgZnVsbFZhbHVlID0gJGlucHV0LnZhbHVlLnJlcGxhY2UoLy0tL2csJ2JsYW5rJyk7XHJcblxyXG5cdFx0dmFyIGh0bWwgPSAnPHA+JyArIHRleHRBcnJheS5qb2luKCc8L3A+PHA+JykgKyAnPC9wPic7XHJcblx0XHRodG1sID0gaHRtbC5yZXBsYWNlKC9cXCRsYWJlbC9nLCAkaW5wdXQucG9seWZpbGwubGFiZWwpO1xyXG5cdFx0aHRtbCA9IGh0bWwucmVwbGFjZSgvXFwkc2VnbWVudE5hbWUvZywgc2VnbWVudE5hbWUpO1xyXG5cdFx0aHRtbCA9IGh0bWwucmVwbGFjZSgvXFwkc2VnbWVudFZhbHVlL2csIGZpbmFsVmFsdWUpO1xyXG5cdFx0aHRtbCA9IGh0bWwucmVwbGFjZSgvXFwkZnVsbFZhbHVlL2csIGZ1bGxWYWx1ZSk7XHJcblxyXG5cdFx0JGlucHV0LnBvbHlmaWxsLiRhMTF5LmlubmVySFRNTCA9IGh0bWw7XHJcblx0fSwgMSk7XHJcbn1cclxuIiwiXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29udmVydF9ob3Vyc190b18xMmhyX3RpbWUgKGhvdXJzKSB7XHJcblx0cmV0dXJuIGhvdXJzIDw9IDEyID8gaG91cnMgPT09IDAgPyAxMiA6IGhvdXJzIDogaG91cnMgLSAxMjtcclxufVxyXG4iLCJcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb252ZXJ0X251bWJlciAobnVtYmVyKSB7XHJcblx0cmV0dXJuIGlzTmFOKG51bWJlcikgPyBudW1iZXIgOiBwYXJzZUludChudW1iZXIpO1xyXG59XHJcbiIsIlxyXG52YXIgY29udmVydF9udW1iZXIgPSByZXF1aXJlKCcuL2NvbnZlcnRfbnVtYmVyJyk7XHJcbnZhciBjb252ZXJ0X2hvdXJzX3RvXzEyaHJfdGltZSA9IHJlcXVpcmUoJy4vY29udmVydF9ob3Vyc190b18xMmhyX3RpbWUnKTtcclxudmFyIGxlYWRpbmdfemVybyA9IHJlcXVpcmUoJy4vbGVhZGluZ196ZXJvJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbnZlcnRfdG9fMTJocl90aW1lICh0aW1lU3RyaW5nXzI0aHIpIHtcclxuXHRpZiAodGltZVN0cmluZ18yNGhyID09PSAnJykgcmV0dXJuICctLTotLSAtLSc7XHJcblx0dmFyIHR3ZW50eUZvdXJfcmVnZXggPSAvKFswLTldezJ9KVxcOihbMC05XXsyfSkvO1xyXG5cdHZhciByZXN1bHQgPSB0d2VudHlGb3VyX3JlZ2V4LmV4ZWModGltZVN0cmluZ18yNGhyKTtcclxuXHR2YXIgaHJzXzI0ID0gY29udmVydF9udW1iZXIocmVzdWx0WzFdKTtcclxuXHR2YXIgbWluID0gcmVzdWx0WzJdO1xyXG5cdHZhciBocnNfMTIgPSBjb252ZXJ0X2hvdXJzX3RvXzEyaHJfdGltZShocnNfMjQpO1xyXG5cdHZhciBpc1BNID0gaHJzXzI0ID4gMTI7XHJcblx0dmFyIG1vZGUgPSBpc1BNID8gJ1BNJyA6ICdBTSc7XHJcblx0cmV0dXJuIFtsZWFkaW5nX3plcm8oaHJzXzEyKSwgJzonLCBtaW4sICcgJywgbW9kZV0uam9pbignJyk7XHJcbn1cclxuIiwiXHJcbnZhciBsZWFkaW5nX3plcm8gPSByZXF1aXJlKCcuL2xlYWRpbmdfemVybycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb252ZXJ0X3RvXzI0aHJfdGltZSAodGltZVN0cmluZ18xMmhyKSB7XHJcblx0aWYgKC8tLy50ZXN0KHRpbWVTdHJpbmdfMTJocikpIHJldHVybiAnJztcclxuXHR2YXIgaXNQTSA9IHRpbWVTdHJpbmdfMTJoci5pbmRleE9mKCdQTScpID4gLTE7XHJcblx0dmFyIHRpbWVSZXN1bHQgPSAvXihbMC05XXsyfSkvLmV4ZWModGltZVN0cmluZ18xMmhyKTtcclxuXHR2YXIgaHJzID0gdGltZVJlc3VsdCA/IHBhcnNlSW50KHRpbWVSZXN1bHRbMV0pIDogJyc7XHJcblx0dmFyIG5ld0hycztcclxuXHRpZiAoaHJzID09PSAxMikge1xyXG5cdFx0bmV3SHJzID0gaXNQTSA/IDEyIDogMDtcclxuXHR9IGVsc2Uge1xyXG5cdFx0bmV3SHJzID0gaXNQTSA/IGhycyArIDEyIDogaHJzO1xyXG5cdH1cclxuXHR2YXIgZmluYWxIcnMgPSBuZXdIcnMgPT09IDI0ID8gMCA6IG5ld0hycztcclxuXHR2YXIgdGltZVJlZ0V4ID0gL15bMC05XXsyfTooWzAtOV17Mn0pIChBTXxQTSkvO1xyXG5cdHJldHVybiB0aW1lU3RyaW5nXzEyaHIucmVwbGFjZSh0aW1lUmVnRXgsIGxlYWRpbmdfemVybyhmaW5hbEhycykrJzokMScpO1xyXG59XHJcbiIsIlxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxlYWRpbmdfemVybyAobnVtYmVyKSB7XHJcblx0aWYgKGlzTmFOKG51bWJlcikpIHJldHVybiBudW1iZXI7XHJcblx0dmFyIHB1cmlmaWVkID0gcGFyc2VJbnQobnVtYmVyKTtcclxuXHRyZXR1cm4gcHVyaWZpZWQgPCAxMCA/ICcwJyArIHB1cmlmaWVkIDogbnVtYmVyO1xyXG59XHJcbiIsIlxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZV9ldmVudChldmVudE5hbWUpe1xyXG5cdHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG5cdGV2ZW50LmluaXRFdmVudChldmVudE5hbWUsIHRydWUsIHRydWUpO1xyXG5cdHJldHVybiBldmVudDtcclxufVxyXG4iLCJcclxudmFyIHRyaWdnZXJfZXZlbnQgPSByZXF1aXJlKCcuL3RyaWdnZXJfZXZlbnQnKTtcclxuXHJcbi8vIEl0IHNlZW1zIHRoYXQgb25pbnB1dCBhbmQgb25jaGFuZ2UgYXJlIHRyZWF0ZWQgdGhlIHNhbWUgd2F5IGJ5IGJyb3dzZXJzIDovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJpZ2dlcl9ib3RoX2V2ZW50cygkaW5wdXQpIHtcclxuXHQvLyB0aGUgZXZlbnQgb25seSBldmVyIGZpcmVzIGlmIHRoZXJlIGlzIGEgZnVsbCB2YWxpZCB2YWx1ZSBhdmFpbGFibGVcclxuXHR0cmlnZ2VyX2V2ZW50KCRpbnB1dCwgJ2lucHV0Jyk7XHJcblx0dHJpZ2dlcl9ldmVudCgkaW5wdXQsJ2NoYW5nZScpO1xyXG59XHJcbiIsIlxyXG52YXIgY3JlYXRlX2V2ZW50ID0gcmVxdWlyZSgnLi9jcmVhdGVfZXZlbnQnKTtcclxuXHJcbnZhciBpbnB1dEV2ZW50ID0gY3JlYXRlX2V2ZW50KCdpbnB1dCcpO1xyXG52YXIgY2hhbmdlRXZlbnQgPSBjcmVhdGVfZXZlbnQoJ2NoYW5nZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmlnZ2VyX2V2ZW50KCRpbnB1dCwgZXZlbnROYW1lKSB7XHJcblx0dmFyIGV2ZW50ID0ge1xyXG5cdFx0aW5wdXQ6IGlucHV0RXZlbnQsXHJcblx0XHRjaGFuZ2U6IGNoYW5nZUV2ZW50LFxyXG5cdH1bZXZlbnROYW1lXTtcclxuXHJcblx0aWYgKGNhbl90cmlnZ2VyX2NoYW5nZSgkaW5wdXQpKSB7XHJcblx0XHQkaW5wdXQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcblx0fVxyXG59XHJcblxyXG4vLyBCcm93c2VycyBvbmx5IHNlbmQgb3V0IGlucHV0IGFuZCBjaGFuZ2UgZXZlbnRzIGlmIHRoZSB0aW1lIGVsZW1lbnQgaGFzIGEgZnVsbCB2YWxpZCB2YWx1ZVxyXG5mdW5jdGlvbiBjYW5fdHJpZ2dlcl9jaGFuZ2UgKCRpbnB1dCkge1xyXG5cdHJldHVybiAhLy0tLy50ZXN0KCRpbnB1dC52YWx1ZSk7XHJcbn1cclxuIiwiLy8gc2VsZWN0b3IgaXMgb3B0aW9uYWwsIGl0IGFsbG93cyBmb3IgYW4gZWFybHkgZXhpdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkaW5wdXQsIHNlbGVjdG9yU3RyaW5nKSB7XHJcblx0dmFyICRlbGVtID0gJGlucHV0O1xyXG5cclxuXHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvODcyOTI3NC8xNjExMDU4XHJcblx0dmFyIGFuY2VzdG9ycyA9IFtdO1xyXG5cdHdoaWxlICgkZWxlbSkge1xyXG5cdFx0YW5jZXN0b3JzLnB1c2goJGVsZW0pO1xyXG5cdFx0dmFyIG1hdGNoZXNTZWxlY3RvciA9ICRlbGVtLm1zTWF0Y2hlc1NlbGVjdG9yID9cclxuXHRcdFx0JGVsZW0ubXNNYXRjaGVzU2VsZWN0b3Ioc2VsZWN0b3JTdHJpbmcpIDpcclxuXHRcdFx0JGVsZW0ubWF0Y2hlcyhzZWxlY3RvclN0cmluZyk7XHJcblx0XHRpZiAobWF0Y2hlc1NlbGVjdG9yKSB7XHJcblx0XHRcdHJldHVybiBhbmNlc3RvcnM7XHJcblx0XHR9XHJcblx0XHQkZWxlbSA9ICRlbGVtLnBhcmVudEVsZW1lbnQ7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gYW5jZXN0b3JzO1xyXG59XHJcbiIsIlxyXG52YXIgcmFuZ2VzID0gcmVxdWlyZSgnLi4vc3RhdGljLXZhbHVlcy9yYW5nZXMnKTtcclxudmFyIGdldF9zZWxlY3RlZF9yYW5nZSA9IHJlcXVpcmUoJy4vZ2V0X3NlbGVjdGVkX3JhbmdlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldF9jdXJyZW50X3NlZ21lbnQgKCRpbnB1dCkge1xyXG5cdHZhciBzZWxlY3Rpb24gPSBnZXRfc2VsZWN0ZWRfcmFuZ2UoJGlucHV0KTtcclxuXHRmb3IgKHZhciBzZWdtZW50IGluIHJhbmdlcykge1xyXG5cdFx0dmFyIHJhbmdlID0gcmFuZ2VzW3NlZ21lbnRdO1xyXG5cdFx0dmFyIGFib3ZlTWluID0gcmFuZ2Uuc3RhcnQgPD0gc2VsZWN0aW9uLnN0YXJ0O1xyXG5cdFx0dmFyIGJlbG93TWF4ID0gcmFuZ2UuZW5kID49IHNlbGVjdGlvbi5lbmQ7XHJcblx0XHRpZiAoYWJvdmVNaW4gJiYgYmVsb3dNYXgpIHtcclxuXHRcdFx0cmV0dXJuIHNlZ21lbnQ7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiAnaHJzJztcclxufVxyXG4iLCJcclxudmFyIGdldF9hbmNlc3RvcnMgPSByZXF1aXJlKCcuL2dldF9hbmNlc3RvcnMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0X2xhYmVsICgkaW5wdXQpIHtcclxuXHJcblx0dmFyIGxhYmVsVGV4dCA9XHJcblx0XHRhcmlhX2xhYmVsbGVkYnkoJGlucHV0KSB8fFxyXG5cdFx0YXJpYV9sYWJlbCgkaW5wdXQpIHx8XHJcblx0XHRmb3JfYXR0cmlidXRlKCRpbnB1dCkgfHxcclxuXHRcdGxhYmVsX3dyYXBwZXJfZWxlbWVudCgkaW5wdXQpIHx8XHJcblx0XHR0aXRsZV9hdHRyaWJ1dGUoJGlucHV0KTtcclxuXHJcblx0aWYgKGxhYmVsVGV4dCkgcmV0dXJuIGxhYmVsVGV4dDtcclxuXHJcblx0Y29uc29sZS5lcnJvcignTGFiZWwgdGV4dCBmb3IgaW5wdXQgbm90IGZvdW5kLicsICRpbnB1dCk7XHJcblx0dGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgcG9seWZpbGwgdGltZSBpbnB1dCBkdWUgdG8gYSBtaXNzaW5nIGxhYmVsLicpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhcmlhX2xhYmVsbGVkYnkoJGlucHV0KXtcclxuXHR2YXIgYXJpYUxhYmVsQnlJRCA9ICRpbnB1dC5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScpO1xyXG5cdGlmIChhcmlhTGFiZWxCeUlEKSB7XHJcblx0XHR2YXIgJGFyaWFMYWJlbEJ5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYXJpYUxhYmVsQnlJRCk7XHJcblx0XHRpZiAoJGFyaWFMYWJlbEJ5KSByZXR1cm4gJGFyaWFMYWJlbEJ5LnRleHRDb250ZW50O1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFyaWFfbGFiZWwoJGlucHV0KXtcclxuXHR2YXIgYXJpYUxhYmVsID0gJGlucHV0LmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xyXG5cdGlmIChhcmlhTGFiZWwpIHJldHVybiBhcmlhTGFiZWw7XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JfYXR0cmlidXRlKCRpbnB1dCl7XHJcblx0aWYgKCRpbnB1dC5pZCkge1xyXG5cdFx0dmFyICRmb3JMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsW2Zvcj1cIicrJGlucHV0LmlkKydcIl0nKTtcclxuXHRcdGlmICgkZm9yTGFiZWwpIHJldHVybiAkZm9yTGFiZWwudGV4dENvbnRlbnQ7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbGFiZWxfd3JhcHBlcl9lbGVtZW50KCRpbnB1dCl7XHJcblx0dmFyIGFuY2VzdG9ycyA9IGdldF9hbmNlc3RvcnMoJGlucHV0LCAnbGFiZWwnKTtcclxuXHR2YXIgJHBhcmVudExhYmVsID0gYW5jZXN0b3JzW2FuY2VzdG9ycy5sZW5ndGggLSAxXTtcclxuXHRpZiAoJHBhcmVudExhYmVsLm5vZGVOYW1lID09ICdMQUJFTCcpIHJldHVybiAkcGFyZW50TGFiZWwudGV4dENvbnRlbnQ7XHJcblx0cmV0dXJuIGZhbHNlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpdGxlX2F0dHJpYnV0ZSgkaW5wdXQpe1xyXG5cdHZhciB0aXRsZUxhYmVsID0gJGlucHV0LmdldEF0dHJpYnV0ZSgndGl0bGUnKTtcclxuXHRpZiAodGl0bGVMYWJlbCkgcmV0dXJuIHRpdGxlTGFiZWw7XHJcblx0cmV0dXJuIGZhbHNlXHJcbn1cclxuIiwiXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0X3NlbGVjdGVkX3JhbmdlICgkaW5wdXQpIHtcclxuXHRyZXR1cm4geyBzdGFydDogJGlucHV0LnNlbGVjdGlvblN0YXJ0LCBlbmQ6ICRpbnB1dC5zZWxlY3Rpb25FbmQgfTtcclxufVxyXG4iLCJcclxudmFyIGNvbnZlcnRfbnVtYmVyID0gcmVxdWlyZSgnLi4vY29udmVydGVycy9jb252ZXJ0X251bWJlcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRfdmFsdWVzICgkaW5wdXQsIHRpbWVTdHJpbmcpIHtcclxuXHR2YXIgdmFsdWUgPSB0aW1lU3RyaW5nID8gdGltZVN0cmluZyA6ICRpbnB1dC52YWx1ZTtcclxuXHR2YXIgcmVnRXggPSAvKFswLTktXXsxLDJ9KVxcOihbMC05LV17MSwyfSlcXHM/KEFNfFBNfFxcLVxcLSk/LztcclxuXHR2YXIgcmVzdWx0ID0gcmVnRXguZXhlYyh2YWx1ZSk7XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRocnM6IGNvbnZlcnRfbnVtYmVyKHJlc3VsdFsxXSksXHJcblx0XHRtaW46IGNvbnZlcnRfbnVtYmVyKHJlc3VsdFsyXSksXHJcblx0XHRtb2RlOiByZXN1bHRbM10sXHJcblx0fVxyXG59XHJcbiIsIlxyXG52YXIgbWFudWFsX2VudHJ5X2xvZyA9IFtdO1xyXG5cclxuZnVuY3Rpb24gY2xlYXIgKCkge1xyXG5cdG1hbnVhbF9lbnRyeV9sb2cgPSBbXTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkIChlbnRyeSkge1xyXG5cdG1hbnVhbF9lbnRyeV9sb2cucHVzaChlbnRyeSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGl0ZW1zKCl7XHJcblx0cmV0dXJuIG1hbnVhbF9lbnRyeV9sb2c7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGl0ZW1zOiBpdGVtcyxcclxuXHRjbGVhcjogY2xlYXIsXHJcblx0YWRkOiBhZGQsXHJcbn1cclxuIiwiXHJcbnZhciB0cmF2ZXJzZSA9IHJlcXVpcmUoJy4vdHJhdmVyc2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbmV4dF9zZWdtZW50ICgkaW5wdXQpIHtcclxuXHR0cmF2ZXJzZSgkaW5wdXQsICduZXh0Jyk7XHJcbn1cclxuIiwiXHJcbnZhciB0cmF2ZXJzZSA9IHJlcXVpcmUoJy4vdHJhdmVyc2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcHJldl9zZWdtZW50ICgkaW5wdXQpIHtcclxuXHR0cmF2ZXJzZSgkaW5wdXQsICdwcmV2Jyk7XHJcbn1cclxuIiwiXHJcbnZhciBnZXRfY3VycmVudF9zZWdtZW50ID0gcmVxdWlyZSgnLi4vZ2V0dGVycy9nZXRfY3VycmVudF9zZWdtZW50Jyk7XHJcbnZhciBzZWxlY3Rfc2VnbWVudCA9IHJlcXVpcmUoJy4vc2VsZWN0X3NlZ21lbnQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2VsZWN0X2N1cnNvcl9zZWdtZW50ICgkaW5wdXQpIHtcclxuXHR2YXIgY3VycmVudF9zZWdtZW50ID0gZ2V0X2N1cnJlbnRfc2VnbWVudCgkaW5wdXQpO1xyXG5cdHNlbGVjdF9zZWdtZW50KCRpbnB1dCwgY3VycmVudF9zZWdtZW50KTtcclxufVxyXG4iLCJcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZWxlY3Rfc2VnbWVudCAoJGlucHV0LCBzZWdtZW50KSB7XHJcblxyXG5cdHNldF9pbnB1dF90eXBlKCk7XHJcblxyXG5cdHZhciBhY3Rpb25zID0ge1xyXG5cdFx0aHJzOiAgc2VsZWN0KDAsIDIpLFxyXG5cdFx0bWluOiAgc2VsZWN0KDMsIDUpLFxyXG5cdFx0bW9kZTogc2VsZWN0KDYsIDgpLFxyXG5cdH07XHJcblxyXG5cdGFjdGlvbnNbc2VnbWVudF0oJGlucHV0KTtcclxuXHJcblx0ZnVuY3Rpb24gc2V0X2lucHV0X3R5cGUoKSB7XHJcblx0XHR2YXIgdHlwZSA9IHNlZ21lbnQgPT09ICdtb2RlJyA/ICd0ZXh0JyA6ICd0ZWwnO1xyXG5cdFx0JGlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsIHR5cGUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2VsZWN0IChzdGFydCwgZW5kKSB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkaW5wdXQuc2V0U2VsZWN0aW9uUmFuZ2Uoc3RhcnQsIGVuZCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsIlxyXG52YXIgZ2V0X2N1cnJlbnRfc2VnbWVudCA9IHJlcXVpcmUoJy4uL2dldHRlcnMvZ2V0X2N1cnJlbnRfc2VnbWVudCcpO1xyXG52YXIgc2VsZWN0X3NlZ21lbnQgPSByZXF1aXJlKCcuLi9zZWxlY3RvcnMvc2VsZWN0X3NlZ21lbnQnKTtcclxuXHJcbnZhciBtYW51YWxfZW50cnlfbG9nID0gcmVxdWlyZSgnLi4vaGVscGVycy9tYW51YWxfZW50cnlfbG9nJyk7XHJcbnZhciBzZWdtZW50cyA9IHJlcXVpcmUoJy4uL3N0YXRpYy12YWx1ZXMvc2VnbWVudHMnKTtcclxuXHJcbnZhciB1cGRhdGVfYTExeSA9IHJlcXVpcmUoJy4uL2FjY2Vzc2liaWxpdHkvdXBkYXRlX2ExMXknKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhdmVyc2UgKCRpbnB1dCwgZGlyZWN0aW9uKSB7XHJcblx0dmFyIHNlZ21lbnQgPSBnZXRfY3VycmVudF9zZWdtZW50KCRpbnB1dCk7XHJcblxyXG5cdHZhciBtb2RpZmllciA9IGRpcmVjdGlvbiA9PT0gJ25leHQnID8gMSA6IC0xO1xyXG5cdHZhciBuZXh0X3NlZ21lbnRfaW5kZXggPSBzZWdtZW50cy5pbmRleE9mKHNlZ21lbnQpICsgbW9kaWZpZXI7XHJcblxyXG5cdHZhciBuZXh0X3NlZ21lbnQgPSB7XHJcblx0XHRuZXh0OiBzZWdtZW50c1tuZXh0X3NlZ21lbnRfaW5kZXhdIHx8ICdtb2RlJyxcclxuXHRcdHByZXY6IG5leHRfc2VnbWVudF9pbmRleCA8IDAgPyAnaHJzJyA6IHNlZ21lbnRzW25leHRfc2VnbWVudF9pbmRleF0sXHJcblx0fVtkaXJlY3Rpb25dO1xyXG5cclxuXHRzZWxlY3Rfc2VnbWVudCgkaW5wdXQsIG5leHRfc2VnbWVudCk7XHJcblx0bWFudWFsX2VudHJ5X2xvZy5jbGVhcigpO1xyXG5cdHVwZGF0ZV9hMTF5KCRpbnB1dCwgWydzZWxlY3QnXSlcclxufVxyXG4iLCJcclxudmFyIHN3aXRjaF9tb2RlID0gcmVxdWlyZSgnLi9zd2l0Y2hfbW9kZScpO1xyXG52YXIgbnVkZ2VfdGltZV9zZWdtZW50ID0gcmVxdWlyZSgnLi9udWRnZV90aW1lX3NlZ21lbnQnKTtcclxudmFyIHVwZGF0ZV9hMTF5ID0gcmVxdWlyZSgnLi4vYWNjZXNzaWJpbGl0eS91cGRhdGVfYTExeScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWNyZW1lbnQgKCRpbnB1dCwgc2VnbWVudCkge1xyXG5cdGlmIChzZWdtZW50ID09PSAnbW9kZScpIHtcclxuXHRcdHN3aXRjaF9tb2RlKCRpbnB1dCwgJ1BNJylcclxuXHR9IGVsc2Uge1xyXG5cdFx0bnVkZ2VfdGltZV9zZWdtZW50KCRpbnB1dCwgc2VnbWVudCwgJ2Rvd24nKTtcclxuXHR9XHJcblx0dXBkYXRlX2ExMXkoJGlucHV0LCBbJ3VwZGF0ZSddKTtcclxufVxyXG4iLCJcclxudmFyIGdldF9jdXJyZW50X3NlZ21lbnQgPSByZXF1aXJlKCcuLi9nZXR0ZXJzL2dldF9jdXJyZW50X3NlZ21lbnQnKTtcclxudmFyIGRlY3JlbWVudCA9IHJlcXVpcmUoJy4uL3NldHRlcnMvZGVjcmVtZW50Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlY3JlbWVudF9jdXJyZW50X3NlZ21lbnQgKCRpbnB1dCl7XHJcblx0dmFyIGN1cnJlbnRfc2VnbWVudCA9IGdldF9jdXJyZW50X3NlZ21lbnQoJGlucHV0KTtcclxuXHRkZWNyZW1lbnQoJGlucHV0LCBjdXJyZW50X3NlZ21lbnQpO1xyXG59XHJcbiIsIlxyXG52YXIgc3dpdGNoX21vZGUgPSByZXF1aXJlKCcuL3N3aXRjaF9tb2RlJyk7XHJcbnZhciBudWRnZV90aW1lX3NlZ21lbnQgPSByZXF1aXJlKCcuL251ZGdlX3RpbWVfc2VnbWVudCcpO1xyXG52YXIgdXBkYXRlX2ExMXkgPSByZXF1aXJlKCcuLi9hY2Nlc3NpYmlsaXR5L3VwZGF0ZV9hMTF5Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluY3JlbWVudCAoJGlucHV0LCBzZWdtZW50KSB7XHJcblx0aWYgKHNlZ21lbnQgPT09ICdtb2RlJykge1xyXG5cdFx0c3dpdGNoX21vZGUoJGlucHV0LCAnQU0nKVxyXG5cdH0gZWxzZSB7XHJcblx0XHRudWRnZV90aW1lX3NlZ21lbnQoJGlucHV0LCBzZWdtZW50LCAndXAnKTtcclxuXHR9XHJcblx0dXBkYXRlX2ExMXkoJGlucHV0LCBbJ3VwZGF0ZSddKTtcclxufVxyXG5cclxuIiwiXHJcbnZhciBnZXRfY3VycmVudF9zZWdtZW50ID0gcmVxdWlyZSgnLi4vZ2V0dGVycy9nZXRfY3VycmVudF9zZWdtZW50Jyk7XHJcbnZhciBpbmNyZW1lbnQgPSByZXF1aXJlKCcuLi9zZXR0ZXJzL2luY3JlbWVudCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmNyZW1lbnRfY3VycmVudF9zZWdtZW50ICgkaW5wdXQpIHtcclxuXHR2YXIgY3VycmVudF9zZWdtZW50ID0gZ2V0X2N1cnJlbnRfc2VnbWVudCgkaW5wdXQpO1xyXG5cdGluY3JlbWVudCgkaW5wdXQsIGN1cnJlbnRfc2VnbWVudCk7XHJcbn1cclxuIiwiXHJcbnZhciBnZXRfdmFsdWVzID0gcmVxdWlyZSgnLi4vZ2V0dGVycy9nZXRfdmFsdWVzJyk7XHJcbnZhciBjb252ZXJ0X2hvdXJzX3RvXzEyaHJfdGltZSA9IHJlcXVpcmUoJy4uL2NvbnZlcnRlcnMvY29udmVydF9ob3Vyc190b18xMmhyX3RpbWUnKTtcclxudmFyIGxlYWRpbmdfemVybyA9IHJlcXVpcmUoJy4uL2NvbnZlcnRlcnMvbGVhZGluZ196ZXJvJyk7XHJcbnZhciBzZXRfc2VnbWVudCA9IHJlcXVpcmUoJy4vc2V0X3NlZ21lbnQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbnVkZ2VfdGltZV9zZWdtZW50ICgkaW5wdXQsIHNlZ21lbnQsIGRpcmVjdGlvbikge1xyXG5cdHZhciBjdXJyZW50X3ZhbHVlcyA9IGdldF92YWx1ZXMoJGlucHV0KTtcclxuXHR2YXIgdGltZTtcclxuXHJcblx0dmFyIG1vZGlmaWVyID0gZGlyZWN0aW9uID09PSAndXAnID8gMSA6IC0xO1xyXG5cclxuXHRpZiAoY3VycmVudF92YWx1ZXNbc2VnbWVudF0gPT09ICctLScpIHtcclxuXHRcdHZhciBjdXJyZW50X3RpbWUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0dGltZSA9IHtcclxuXHRcdFx0aHJzOiBjb252ZXJ0X2hvdXJzX3RvXzEyaHJfdGltZShjdXJyZW50X3RpbWUuZ2V0SG91cnMoKSksXHJcblx0XHRcdG1pbjogY3VycmVudF90aW1lLmdldE1pbnV0ZXMoKSxcclxuXHRcdH1cclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIG1pbnV0ZXMgPSB7XHJcblx0XHRcdHVwIDogY3VycmVudF92YWx1ZXMubWluIDwgNTkgPyBjdXJyZW50X3ZhbHVlcy5taW4gKyBtb2RpZmllciA6IDAsXHJcblx0XHRcdGRvd24gOiBjdXJyZW50X3ZhbHVlcy5taW4gPT09IDAgPyA1OSA6IGN1cnJlbnRfdmFsdWVzLm1pbiArIG1vZGlmaWVyLFxyXG5cdFx0fVxyXG5cdFx0dGltZSA9IHtcclxuXHRcdFx0aHJzOiBjb252ZXJ0X2hvdXJzX3RvXzEyaHJfdGltZShjdXJyZW50X3ZhbHVlcy5ocnMgKyBtb2RpZmllciksXHJcblx0XHRcdG1pbjogbWludXRlc1tkaXJlY3Rpb25dLFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2V0X3NlZ21lbnQoJGlucHV0LCBzZWdtZW50LCBsZWFkaW5nX3plcm8odGltZVtzZWdtZW50XSkgKTtcclxufVxyXG4iLCJcclxudmFyIGNvbnZlcnRfdG9fMjRocl90aW1lID0gcmVxdWlyZSgnLi4vY29udmVydGVycy9jb252ZXJ0X3RvXzI0aHJfdGltZScpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldF9kYXRhX2F0dHJpYnV0ZSgkaW5wdXQsIHRpbWVTdHJpbmdfMTJocil7XHJcblx0dmFyIGZpbHRlcmVkU3RyaW5nID0gdGltZVN0cmluZ18xMmhyLmluZGV4T2YoJy0nKSA+IC0xID8gJycgOiB0aW1lU3RyaW5nXzEyaHI7XHJcblx0dmFyIHRpbWUyNGhyID0gY29udmVydF90b18yNGhyX3RpbWUoZmlsdGVyZWRTdHJpbmcpO1xyXG5cdCRpbnB1dC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnLCB0aW1lMjRocik7XHJcbn1cclxuIiwiXHJcbnZhciBnZXRfdmFsdWVzID0gcmVxdWlyZSgnLi4vZ2V0dGVycy9nZXRfdmFsdWVzJyk7XHJcbnZhciBsZWFkaW5nX3plcm8gPSByZXF1aXJlKCcuLi9jb252ZXJ0ZXJzL2xlYWRpbmdfemVybycpO1xyXG52YXIgc2VsZWN0X3NlZ21lbnQgPSByZXF1aXJlKCcuLi9zZWxlY3RvcnMvc2VsZWN0X3NlZ21lbnQnKTtcclxudmFyIHNldF9kYXRhX2F0dHJpYnV0ZSA9IHJlcXVpcmUoJy4vc2V0X2RhdGFfYXR0cmlidXRlJyk7XHJcbnZhciB0cmlnZ2VyX2JvdGhfZXZlbnRzID0gcmVxdWlyZSgnLi4vZXZlbnRzL3RyaWdnZXJfYm90aF9ldmVudHMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0X3NlZ21lbnQgKCRpbnB1dCwgc2VnbWVudCwgdmFsdWUpIHtcclxuXHR2YXIgdmFsdWVzID0gZ2V0X3ZhbHVlcygkaW5wdXQpO1xyXG5cdHZhbHVlc1tzZWdtZW50XSA9IHZhbHVlO1xyXG5cdHZhciBuZXdJbnB1dFZhbCA9IFtcclxuXHRcdGxlYWRpbmdfemVybyh2YWx1ZXMuaHJzKSwnOicsXHJcblx0XHRsZWFkaW5nX3plcm8odmFsdWVzLm1pbiksJyAnLFxyXG5cdFx0dmFsdWVzLm1vZGVcclxuXHRdLmpvaW4oJycpO1xyXG5cdCRpbnB1dC52YWx1ZSA9IG5ld0lucHV0VmFsO1xyXG5cdHNlbGVjdF9zZWdtZW50KCRpbnB1dCwgc2VnbWVudCk7XHJcblx0c2V0X2RhdGFfYXR0cmlidXRlKCRpbnB1dCwgbmV3SW5wdXRWYWwpO1xyXG5cdHRyaWdnZXJfYm90aF9ldmVudHMoJGlucHV0KTtcclxufVxyXG4iLCJcclxudmFyIGdldF92YWx1ZXMgPSByZXF1aXJlKCcuLi9nZXR0ZXJzL2dldF92YWx1ZXMnKTtcclxudmFyIHNldF9zZWdtZW50ID0gcmVxdWlyZSgnLi9zZXRfc2VnbWVudCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzd2l0Y2hfbW9kZSAoJGlucHV0LCBkZWZhdWx0X21vZGUpIHtcclxuXHRkZWZhdWx0X21vZGUgPSBkZWZhdWx0X21vZGUgfHwgJ0FNJztcclxuXHR2YXIgY3VycmVudF9tb2RlID0gZ2V0X3ZhbHVlcygkaW5wdXQpLm1vZGU7XHJcblx0dmFyIG5ld19tb2RlID0ge1xyXG5cdFx0Jy0tJyA6IGRlZmF1bHRfbW9kZSxcclxuXHRcdCdBTScgOiAnUE0nLFxyXG5cdFx0J1BNJyA6ICdBTScsXHJcblx0fVtjdXJyZW50X21vZGVdO1xyXG5cdHNldF9zZWdtZW50KCRpbnB1dCwgJ21vZGUnLCBuZXdfbW9kZSk7XHJcbn1cclxuIiwiXHJcbnZhciByYW5nZXMgPSB7XHJcblx0aHJzIDogeyBzdGFydDogMCwgZW5kOiAyIH0sXHJcblx0bWluIDogeyBzdGFydDogMywgZW5kOiA1IH0sXHJcblx0bW9kZSA6IHsgc3RhcnQ6IDYsIGVuZDogOCB9LFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJhbmdlcztcclxuIiwiXHJcbnZhciByYW5nZXMgPSByZXF1aXJlKCcuL3JhbmdlcycpO1xyXG5cclxudmFyIHNlZ21lbnRzID0gT2JqZWN0LmtleXMocmFuZ2VzKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2VnbWVudHM7XHJcbiIsIi8vIGNvbnZlcnRlcnNcclxudmFyIGNvbnZlcnRfdG9fMTJocl90aW1lID0gcmVxdWlyZSgndGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvY29udmVydF90b18xMmhyX3RpbWUnKVxyXG52YXIgY29udmVydF90b18yNGhyX3RpbWUgPSByZXF1aXJlKCd0aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvY29udmVydGVycy9jb252ZXJ0X3RvXzI0aHJfdGltZScpXHJcblxyXG4vL3NlbGVjdG9yc1xyXG52YXIgc2VsZWN0X2N1cnNvcl9zZWdtZW50ID0gcmVxdWlyZSgndGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL3NlbGVjdG9ycy9zZWxlY3RfY3Vyc29yX3NlZ21lbnQnKVxyXG52YXIgc2VsZWN0X3NlZ21lbnQgPSByZXF1aXJlKCd0aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvc2VsZWN0b3JzL3NlbGVjdF9zZWdtZW50JylcclxudmFyIG5leHRfc2VnbWVudCA9IHJlcXVpcmUoJ3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zZWxlY3RvcnMvbmV4dF9zZWdtZW50JylcclxudmFyIHByZXZfc2VnbWVudCA9IHJlcXVpcmUoJ3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zZWxlY3RvcnMvcHJldl9zZWdtZW50JylcclxuXHJcbi8vIGdldHRlcnNcclxudmFyIGdldF9sYWJlbCA9IHJlcXVpcmUoJ3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9nZXR0ZXJzL2dldF9sYWJlbCcpXHJcblxyXG4vLyBzZXR0ZXJzXHJcbnZhciBpbmNyZW1lbnRfY3VycmVudF9zZWdtZW50ID0gcmVxdWlyZSgndGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL3NldHRlcnMvaW5jcmVtZW50X2N1cnJlbnRfc2VnbWVudCcpXHJcbnZhciBkZWNyZW1lbnRfY3VycmVudF9zZWdtZW50ID0gcmVxdWlyZSgndGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL3NldHRlcnMvZGVjcmVtZW50X2N1cnJlbnRfc2VnbWVudCcpXHJcblxyXG4vLyBhMTF5XHJcbnZhciBjcmVhdGVfYTExeV9ibG9jayA9IHJlcXVpcmUoJ3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9hY2Nlc3NpYmlsaXR5L2NyZWF0ZV9hMTF5X2Jsb2NrJylcclxuXHJcbndpbmRvdy50aW1lUG9seWZpbGxIZWxwZXJzID0ge1xyXG5cdGNvbnZlcnRfdG9fMTJocl90aW1lLFxyXG5cdGNvbnZlcnRfdG9fMjRocl90aW1lLFxyXG5cdHNlbGVjdF9jdXJzb3Jfc2VnbWVudCxcclxuXHRzZWxlY3Rfc2VnbWVudCxcclxuXHRuZXh0X3NlZ21lbnQsXHJcblx0cHJldl9zZWdtZW50LFxyXG5cdGdldF9sYWJlbCxcclxuXHRpbmNyZW1lbnRfY3VycmVudF9zZWdtZW50LFxyXG5cdGRlY3JlbWVudF9jdXJyZW50X3NlZ21lbnQsXHJcblx0Y3JlYXRlX2ExMXlfYmxvY2ssXHJcbn1cclxuIl19
