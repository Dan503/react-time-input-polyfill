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

},{"../getters/get_current_segment":9,"../getters/get_values":12}],3:[function(require,module,exports){

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

},{}],9:[function(require,module,exports){

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

},{"../static-values/ranges":19,"./get_selected_range":11}],10:[function(require,module,exports){

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

},{"./get_ancestors":8}],11:[function(require,module,exports){

module.exports = function get_selected_range ($input) {
	return { start: $input.selectionStart, end: $input.selectionEnd };
}

},{}],12:[function(require,module,exports){

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

},{"../converters/convert_number":4}],13:[function(require,module,exports){

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

},{}],14:[function(require,module,exports){

var traverse = require('./traverse');

module.exports = function next_segment ($input) {
	traverse($input, 'next');
}

},{"./traverse":18}],15:[function(require,module,exports){

var traverse = require('./traverse');

module.exports = function prev_segment ($input) {
	traverse($input, 'prev');
}

},{"./traverse":18}],16:[function(require,module,exports){

var get_current_segment = require('../getters/get_current_segment');
var select_segment = require('./select_segment');

module.exports = function select_cursor_segment ($input) {
	var current_segment = get_current_segment($input);
	select_segment($input, current_segment);
}

},{"../getters/get_current_segment":9,"./select_segment":17}],17:[function(require,module,exports){

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

},{}],18:[function(require,module,exports){

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

},{"../accessibility/update_a11y":2,"../getters/get_current_segment":9,"../helpers/manual_entry_log":13,"../selectors/select_segment":17,"../static-values/segments":20}],19:[function(require,module,exports){

var ranges = {
	hrs : { start: 0, end: 2 },
	min : { start: 3, end: 5 },
	mode : { start: 6, end: 8 },
}

module.exports = ranges;

},{}],20:[function(require,module,exports){

var ranges = require('./ranges');

var segments = Object.keys(ranges);

module.exports = segments;

},{"./ranges":19}],21:[function(require,module,exports){
//static-values
var segments = require('time-input-polyfill/core/static-values/segments'); // converters


var convert_to_12hr_time = require('time-input-polyfill/core/converters/convert_to_12hr_time');

var convert_to_24hr_time = require('time-input-polyfill/core/converters/convert_to_24hr_time');

var convert_hours_to_12hr_time = require('time-input-polyfill/core/converters/convert_hours_to_12hr_time');

var convert_number = require('time-input-polyfill/core/converters/convert_number'); //selectors


var select_cursor_segment = require('time-input-polyfill/core/selectors/select_cursor_segment');

var select_segment = require('time-input-polyfill/core/selectors/select_segment');

var next_segment = require('time-input-polyfill/core/selectors/next_segment');

var prev_segment = require('time-input-polyfill/core/selectors/prev_segment'); // getters


var get_label = require('time-input-polyfill/core/getters/get_label');

var get_current_segment = require('time-input-polyfill/core/getters/get_current_segment');

var get_values = require('time-input-polyfill/core/getters/get_values');

var get_values_from_24hr = function get_values_from_24hr(value24hr) {
  var value12hr = convert_to_12hr_time(value24hr);
  return get_values(null, value12hr);
}; // a11y


var create_a11y_block = require('time-input-polyfill/core/accessibility/create_a11y_block');

window.timePolyfillHelpers = {
  segments: segments,
  convert_to_12hr_time: convert_to_12hr_time,
  convert_to_24hr_time: convert_to_24hr_time,
  convert_hours_to_12hr_time: convert_hours_to_12hr_time,
  convert_number: convert_number,
  select_cursor_segment: select_cursor_segment,
  select_segment: select_segment,
  next_segment: next_segment,
  prev_segment: prev_segment,
  get_label: get_label,
  get_current_segment: get_current_segment,
  get_values: get_values,
  get_values_from_24hr: get_values_from_24hr,
  create_a11y_block: create_a11y_block
};

},{"time-input-polyfill/core/accessibility/create_a11y_block":1,"time-input-polyfill/core/converters/convert_hours_to_12hr_time":3,"time-input-polyfill/core/converters/convert_number":4,"time-input-polyfill/core/converters/convert_to_12hr_time":5,"time-input-polyfill/core/converters/convert_to_24hr_time":6,"time-input-polyfill/core/getters/get_current_segment":9,"time-input-polyfill/core/getters/get_label":10,"time-input-polyfill/core/getters/get_values":12,"time-input-polyfill/core/selectors/next_segment":14,"time-input-polyfill/core/selectors/prev_segment":15,"time-input-polyfill/core/selectors/select_cursor_segment":16,"time-input-polyfill/core/selectors/select_segment":17,"time-input-polyfill/core/static-values/segments":20}]},{},[21])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2FjY2Vzc2liaWxpdHkvY3JlYXRlX2ExMXlfYmxvY2suanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2FjY2Vzc2liaWxpdHkvdXBkYXRlX2ExMXkuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvY29udmVydF9ob3Vyc190b18xMmhyX3RpbWUuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvY29udmVydF9udW1iZXIuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvY29udmVydF90b18xMmhyX3RpbWUuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvY29udmVydF90b18yNGhyX3RpbWUuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvbGVhZGluZ196ZXJvLmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9nZXR0ZXJzL2dldF9hbmNlc3RvcnMuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2dldHRlcnMvZ2V0X2N1cnJlbnRfc2VnbWVudC5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvZ2V0dGVycy9nZXRfbGFiZWwuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2dldHRlcnMvZ2V0X3NlbGVjdGVkX3JhbmdlLmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9nZXR0ZXJzL2dldF92YWx1ZXMuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2hlbHBlcnMvbWFudWFsX2VudHJ5X2xvZy5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvc2VsZWN0b3JzL25leHRfc2VnbWVudC5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvc2VsZWN0b3JzL3ByZXZfc2VnbWVudC5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvc2VsZWN0b3JzL3NlbGVjdF9jdXJzb3Jfc2VnbWVudC5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvc2VsZWN0b3JzL3NlbGVjdF9zZWdtZW50LmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zZWxlY3RvcnMvdHJhdmVyc2UuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL3N0YXRpYy12YWx1ZXMvcmFuZ2VzLmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zdGF0aWMtdmFsdWVzL3NlZ21lbnRzLmpzIiwidGltZVBvbHlmaWxsSGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsaURBQUQsQ0FBdEIsQyxDQUVBOzs7QUFDQSxJQUFJLG9CQUFvQixHQUFHLE9BQU8sQ0FBQywwREFBRCxDQUFsQzs7QUFDQSxJQUFJLG9CQUFvQixHQUFHLE9BQU8sQ0FBQywwREFBRCxDQUFsQzs7QUFDQSxJQUFJLDBCQUEwQixHQUFHLE9BQU8sQ0FBQyxnRUFBRCxDQUF4Qzs7QUFDQSxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsb0RBQUQsQ0FBNUIsQyxDQUVBOzs7QUFDQSxJQUFJLHFCQUFxQixHQUFHLE9BQU8sQ0FBQywwREFBRCxDQUFuQzs7QUFDQSxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsbURBQUQsQ0FBNUI7O0FBQ0EsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGlEQUFELENBQTFCOztBQUNBLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxpREFBRCxDQUExQixDLENBRUE7OztBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyw0Q0FBRCxDQUF2Qjs7QUFDQSxJQUFJLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxzREFBRCxDQUFqQzs7QUFDQSxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsNkNBQUQsQ0FBeEI7O0FBRUEsSUFBSSxvQkFBb0IsR0FBRyxTQUF2QixvQkFBdUIsQ0FBQSxTQUFTLEVBQUk7QUFDdkMsTUFBTSxTQUFTLEdBQUcsb0JBQW9CLENBQUMsU0FBRCxDQUF0QztBQUNBLFNBQU8sVUFBVSxDQUFDLElBQUQsRUFBTyxTQUFQLENBQWpCO0FBQ0EsQ0FIRCxDLENBS0E7OztBQUNBLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLDBEQUFELENBQS9COztBQUVBLE1BQU0sQ0FBQyxtQkFBUCxHQUE2QjtBQUM1QixFQUFBLFFBQVEsRUFBUixRQUQ0QjtBQUU1QixFQUFBLG9CQUFvQixFQUFwQixvQkFGNEI7QUFHNUIsRUFBQSxvQkFBb0IsRUFBcEIsb0JBSDRCO0FBSTVCLEVBQUEsMEJBQTBCLEVBQTFCLDBCQUo0QjtBQUs1QixFQUFBLGNBQWMsRUFBZCxjQUw0QjtBQU01QixFQUFBLHFCQUFxQixFQUFyQixxQkFONEI7QUFPNUIsRUFBQSxjQUFjLEVBQWQsY0FQNEI7QUFRNUIsRUFBQSxZQUFZLEVBQVosWUFSNEI7QUFTNUIsRUFBQSxZQUFZLEVBQVosWUFUNEI7QUFVNUIsRUFBQSxTQUFTLEVBQVQsU0FWNEI7QUFXNUIsRUFBQSxtQkFBbUIsRUFBbkIsbUJBWDRCO0FBWTVCLEVBQUEsVUFBVSxFQUFWLFVBWjRCO0FBYTVCLEVBQUEsb0JBQW9CLEVBQXBCLG9CQWI0QjtBQWM1QixFQUFBLGlCQUFpQixFQUFqQjtBQWQ0QixDQUE3QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZV9hY2Nlc3NpYmlsaXR5X2Jsb2NrICgpIHtcclxuXHR2YXIgJGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0JGJsb2NrLnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ2Fzc2VydGl2ZScpO1xyXG5cdCRibG9jay5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgb3BhY2l0eTogMDsgaGVpZ2h0OiAwOyB3aWR0aDogMDsgb3ZlcmZsb3c6IGhpZGRlbjsgcG9pbnRlci1ldmVudHM6IG5vbmU7Jyk7XHJcblx0JGJsb2NrLmNsYXNzTGlzdC5hZGQoJ3RpbWUtaW5wdXQtcG9seWZpbGwtYWNjZXNzaWJpbGl0eS1ibG9jaycpO1xyXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5hcHBlbmRDaGlsZCgkYmxvY2spO1xyXG5cdHJldHVybiAkYmxvY2s7XHJcbn1cclxuIiwiXHJcbnZhciBnZXRfY3VycmVudF9zZWdtZW50ID0gcmVxdWlyZSgnLi4vZ2V0dGVycy9nZXRfY3VycmVudF9zZWdtZW50Jyk7XHJcbnZhciBnZXRfdmFsdWVzID0gcmVxdWlyZSgnLi4vZ2V0dGVycy9nZXRfdmFsdWVzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHVwZGF0ZV9hMTF5ICgkaW5wdXQsIGFubm91bmNlbWVudEFycmF5KSB7XHJcblx0Ly8gVGltZW91dCBoZWxwcyBlbnN1cmUgdGhhdCB0aGUgaW5wdXQgaGFzIHN0YWJpbGl6ZWRcclxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgY3VycmVudF9zZWdtZW50ID0gZ2V0X2N1cnJlbnRfc2VnbWVudCgkaW5wdXQpO1xyXG5cdFx0dmFyIHZhbHVlcyA9IGdldF92YWx1ZXMoJGlucHV0KTtcclxuXHRcdHZhciB2YWx1ZSA9IHZhbHVlc1tjdXJyZW50X3NlZ21lbnRdO1xyXG5cdFx0dmFyIGZpbmFsVmFsdWUgPSB2YWx1ZSA9PSAnLS0nID8gJ2JsYW5rJyA6IHZhbHVlO1xyXG5cclxuXHRcdHZhciBzZWdtZW50TmFtZSA9IHtcclxuXHRcdFx0aHJzOiAnSG91cnMnLFxyXG5cdFx0XHRtaW46ICdNaW51dGVzJyxcclxuXHRcdFx0bW9kZTogJ0FNL1BNJ1xyXG5cdFx0fVtjdXJyZW50X3NlZ21lbnRdO1xyXG5cclxuXHRcdHZhciBhbm5vdW5jZW1lbnRzID0ge1xyXG5cdFx0XHRpbml0aWFsOiAnJGxhYmVsIGdyb3VwaW5nICRmdWxsVmFsdWUuJyxcclxuXHRcdFx0c2VsZWN0OiAnJHNlZ21lbnROYW1lIHNwaW4gYnV0dG9uICRzZWdtZW50VmFsdWUuJyxcclxuXHRcdFx0dXBkYXRlOiAnJHNlZ21lbnRWYWx1ZS4nLFxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB0ZXh0QXJyYXkgPSBhbm5vdW5jZW1lbnRBcnJheS5tYXAoZnVuY3Rpb24ocHJvdmlkZWRTdHJpbmcpe1xyXG5cdFx0XHRpZiAoYW5ub3VuY2VtZW50c1twcm92aWRlZFN0cmluZ10pIHtcclxuXHRcdFx0XHRyZXR1cm4gYW5ub3VuY2VtZW50c1twcm92aWRlZFN0cmluZ107XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHByb3ZpZGVkU3RyaW5nO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmFyIGZ1bGxWYWx1ZSA9ICRpbnB1dC52YWx1ZS5yZXBsYWNlKC8tLS9nLCdibGFuaycpO1xyXG5cclxuXHRcdHZhciBodG1sID0gJzxwPicgKyB0ZXh0QXJyYXkuam9pbignPC9wPjxwPicpICsgJzwvcD4nO1xyXG5cdFx0aHRtbCA9IGh0bWwucmVwbGFjZSgvXFwkbGFiZWwvZywgJGlucHV0LnBvbHlmaWxsLmxhYmVsKTtcclxuXHRcdGh0bWwgPSBodG1sLnJlcGxhY2UoL1xcJHNlZ21lbnROYW1lL2csIHNlZ21lbnROYW1lKTtcclxuXHRcdGh0bWwgPSBodG1sLnJlcGxhY2UoL1xcJHNlZ21lbnRWYWx1ZS9nLCBmaW5hbFZhbHVlKTtcclxuXHRcdGh0bWwgPSBodG1sLnJlcGxhY2UoL1xcJGZ1bGxWYWx1ZS9nLCBmdWxsVmFsdWUpO1xyXG5cclxuXHRcdCRpbnB1dC5wb2x5ZmlsbC4kYTExeS5pbm5lckhUTUwgPSBodG1sO1xyXG5cdH0sIDEpO1xyXG59XHJcbiIsIlxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbnZlcnRfaG91cnNfdG9fMTJocl90aW1lIChob3Vycykge1xyXG5cdHJldHVybiBob3VycyA8PSAxMiA/IGhvdXJzID09PSAwID8gMTIgOiBob3VycyA6IGhvdXJzIC0gMTI7XHJcbn1cclxuIiwiXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29udmVydF9udW1iZXIgKG51bWJlcikge1xyXG5cdHJldHVybiBpc05hTihudW1iZXIpID8gbnVtYmVyIDogcGFyc2VJbnQobnVtYmVyKTtcclxufVxyXG4iLCJcclxudmFyIGNvbnZlcnRfbnVtYmVyID0gcmVxdWlyZSgnLi9jb252ZXJ0X251bWJlcicpO1xyXG52YXIgY29udmVydF9ob3Vyc190b18xMmhyX3RpbWUgPSByZXF1aXJlKCcuL2NvbnZlcnRfaG91cnNfdG9fMTJocl90aW1lJyk7XHJcbnZhciBsZWFkaW5nX3plcm8gPSByZXF1aXJlKCcuL2xlYWRpbmdfemVybycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb252ZXJ0X3RvXzEyaHJfdGltZSAodGltZVN0cmluZ18yNGhyKSB7XHJcblx0aWYgKHRpbWVTdHJpbmdfMjRociA9PT0gJycpIHJldHVybiAnLS06LS0gLS0nO1xyXG5cdHZhciB0d2VudHlGb3VyX3JlZ2V4ID0gLyhbMC05XXsyfSlcXDooWzAtOV17Mn0pLztcclxuXHR2YXIgcmVzdWx0ID0gdHdlbnR5Rm91cl9yZWdleC5leGVjKHRpbWVTdHJpbmdfMjRocik7XHJcblx0dmFyIGhyc18yNCA9IGNvbnZlcnRfbnVtYmVyKHJlc3VsdFsxXSk7XHJcblx0dmFyIG1pbiA9IHJlc3VsdFsyXTtcclxuXHR2YXIgaHJzXzEyID0gY29udmVydF9ob3Vyc190b18xMmhyX3RpbWUoaHJzXzI0KTtcclxuXHR2YXIgaXNQTSA9IGhyc18yNCA+IDEyO1xyXG5cdHZhciBtb2RlID0gaXNQTSA/ICdQTScgOiAnQU0nO1xyXG5cdHJldHVybiBbbGVhZGluZ196ZXJvKGhyc18xMiksICc6JywgbWluLCAnICcsIG1vZGVdLmpvaW4oJycpO1xyXG59XHJcbiIsIlxyXG52YXIgbGVhZGluZ196ZXJvID0gcmVxdWlyZSgnLi9sZWFkaW5nX3plcm8nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29udmVydF90b18yNGhyX3RpbWUgKHRpbWVTdHJpbmdfMTJocikge1xyXG5cdGlmICgvLS8udGVzdCh0aW1lU3RyaW5nXzEyaHIpKSByZXR1cm4gJyc7XHJcblx0dmFyIGlzUE0gPSB0aW1lU3RyaW5nXzEyaHIuaW5kZXhPZignUE0nKSA+IC0xO1xyXG5cdHZhciB0aW1lUmVzdWx0ID0gL14oWzAtOV17Mn0pLy5leGVjKHRpbWVTdHJpbmdfMTJocik7XHJcblx0dmFyIGhycyA9IHRpbWVSZXN1bHQgPyBwYXJzZUludCh0aW1lUmVzdWx0WzFdKSA6ICcnO1xyXG5cdHZhciBuZXdIcnM7XHJcblx0aWYgKGhycyA9PT0gMTIpIHtcclxuXHRcdG5ld0hycyA9IGlzUE0gPyAxMiA6IDA7XHJcblx0fSBlbHNlIHtcclxuXHRcdG5ld0hycyA9IGlzUE0gPyBocnMgKyAxMiA6IGhycztcclxuXHR9XHJcblx0dmFyIGZpbmFsSHJzID0gbmV3SHJzID09PSAyNCA/IDAgOiBuZXdIcnM7XHJcblx0dmFyIHRpbWVSZWdFeCA9IC9eWzAtOV17Mn06KFswLTldezJ9KSAoQU18UE0pLztcclxuXHRyZXR1cm4gdGltZVN0cmluZ18xMmhyLnJlcGxhY2UodGltZVJlZ0V4LCBsZWFkaW5nX3plcm8oZmluYWxIcnMpKyc6JDEnKTtcclxufVxyXG4iLCJcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBsZWFkaW5nX3plcm8gKG51bWJlcikge1xyXG5cdGlmIChpc05hTihudW1iZXIpKSByZXR1cm4gbnVtYmVyO1xyXG5cdHZhciBwdXJpZmllZCA9IHBhcnNlSW50KG51bWJlcik7XHJcblx0cmV0dXJuIHB1cmlmaWVkIDwgMTAgPyAnMCcgKyBwdXJpZmllZCA6IG51bWJlcjtcclxufVxyXG4iLCIvLyBzZWxlY3RvciBpcyBvcHRpb25hbCwgaXQgYWxsb3dzIGZvciBhbiBlYXJseSBleGl0XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRpbnB1dCwgc2VsZWN0b3JTdHJpbmcpIHtcclxuXHR2YXIgJGVsZW0gPSAkaW5wdXQ7XHJcblxyXG5cdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84NzI5Mjc0LzE2MTEwNThcclxuXHR2YXIgYW5jZXN0b3JzID0gW107XHJcblx0d2hpbGUgKCRlbGVtKSB7XHJcblx0XHRhbmNlc3RvcnMucHVzaCgkZWxlbSk7XHJcblx0XHR2YXIgbWF0Y2hlc1NlbGVjdG9yID0gJGVsZW0ubXNNYXRjaGVzU2VsZWN0b3IgP1xyXG5cdFx0XHQkZWxlbS5tc01hdGNoZXNTZWxlY3RvcihzZWxlY3RvclN0cmluZykgOlxyXG5cdFx0XHQkZWxlbS5tYXRjaGVzKHNlbGVjdG9yU3RyaW5nKTtcclxuXHRcdGlmIChtYXRjaGVzU2VsZWN0b3IpIHtcclxuXHRcdFx0cmV0dXJuIGFuY2VzdG9ycztcclxuXHRcdH1cclxuXHRcdCRlbGVtID0gJGVsZW0ucGFyZW50RWxlbWVudDtcclxuXHR9XHJcblxyXG5cdHJldHVybiBhbmNlc3RvcnM7XHJcbn1cclxuIiwiXHJcbnZhciByYW5nZXMgPSByZXF1aXJlKCcuLi9zdGF0aWMtdmFsdWVzL3JhbmdlcycpO1xyXG52YXIgZ2V0X3NlbGVjdGVkX3JhbmdlID0gcmVxdWlyZSgnLi9nZXRfc2VsZWN0ZWRfcmFuZ2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0X2N1cnJlbnRfc2VnbWVudCAoJGlucHV0KSB7XHJcblx0dmFyIHNlbGVjdGlvbiA9IGdldF9zZWxlY3RlZF9yYW5nZSgkaW5wdXQpO1xyXG5cdGZvciAodmFyIHNlZ21lbnQgaW4gcmFuZ2VzKSB7XHJcblx0XHR2YXIgcmFuZ2UgPSByYW5nZXNbc2VnbWVudF07XHJcblx0XHR2YXIgYWJvdmVNaW4gPSByYW5nZS5zdGFydCA8PSBzZWxlY3Rpb24uc3RhcnQ7XHJcblx0XHR2YXIgYmVsb3dNYXggPSByYW5nZS5lbmQgPj0gc2VsZWN0aW9uLmVuZDtcclxuXHRcdGlmIChhYm92ZU1pbiAmJiBiZWxvd01heCkge1xyXG5cdFx0XHRyZXR1cm4gc2VnbWVudDtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuICdocnMnO1xyXG59XHJcbiIsIlxyXG52YXIgZ2V0X2FuY2VzdG9ycyA9IHJlcXVpcmUoJy4vZ2V0X2FuY2VzdG9ycycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRfbGFiZWwgKCRpbnB1dCkge1xyXG5cclxuXHR2YXIgbGFiZWxUZXh0ID1cclxuXHRcdGFyaWFfbGFiZWxsZWRieSgkaW5wdXQpIHx8XHJcblx0XHRhcmlhX2xhYmVsKCRpbnB1dCkgfHxcclxuXHRcdGZvcl9hdHRyaWJ1dGUoJGlucHV0KSB8fFxyXG5cdFx0bGFiZWxfd3JhcHBlcl9lbGVtZW50KCRpbnB1dCkgfHxcclxuXHRcdHRpdGxlX2F0dHJpYnV0ZSgkaW5wdXQpO1xyXG5cclxuXHRpZiAobGFiZWxUZXh0KSByZXR1cm4gbGFiZWxUZXh0O1xyXG5cclxuXHRjb25zb2xlLmVycm9yKCdMYWJlbCB0ZXh0IGZvciBpbnB1dCBub3QgZm91bmQuJywgJGlucHV0KTtcclxuXHR0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBwb2x5ZmlsbCB0aW1lIGlucHV0IGR1ZSB0byBhIG1pc3NpbmcgbGFiZWwuJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFyaWFfbGFiZWxsZWRieSgkaW5wdXQpe1xyXG5cdHZhciBhcmlhTGFiZWxCeUlEID0gJGlucHV0LmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5Jyk7XHJcblx0aWYgKGFyaWFMYWJlbEJ5SUQpIHtcclxuXHRcdHZhciAkYXJpYUxhYmVsQnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhcmlhTGFiZWxCeUlEKTtcclxuXHRcdGlmICgkYXJpYUxhYmVsQnkpIHJldHVybiAkYXJpYUxhYmVsQnkudGV4dENvbnRlbnQ7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gYXJpYV9sYWJlbCgkaW5wdXQpe1xyXG5cdHZhciBhcmlhTGFiZWwgPSAkaW5wdXQuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XHJcblx0aWYgKGFyaWFMYWJlbCkgcmV0dXJuIGFyaWFMYWJlbDtcclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcl9hdHRyaWJ1dGUoJGlucHV0KXtcclxuXHRpZiAoJGlucHV0LmlkKSB7XHJcblx0XHR2YXIgJGZvckxhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbGFiZWxbZm9yPVwiJyskaW5wdXQuaWQrJ1wiXScpO1xyXG5cdFx0aWYgKCRmb3JMYWJlbCkgcmV0dXJuICRmb3JMYWJlbC50ZXh0Q29udGVudDtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsYWJlbF93cmFwcGVyX2VsZW1lbnQoJGlucHV0KXtcclxuXHR2YXIgYW5jZXN0b3JzID0gZ2V0X2FuY2VzdG9ycygkaW5wdXQsICdsYWJlbCcpO1xyXG5cdHZhciAkcGFyZW50TGFiZWwgPSBhbmNlc3RvcnNbYW5jZXN0b3JzLmxlbmd0aCAtIDFdO1xyXG5cdGlmICgkcGFyZW50TGFiZWwubm9kZU5hbWUgPT0gJ0xBQkVMJykgcmV0dXJuICRwYXJlbnRMYWJlbC50ZXh0Q29udGVudDtcclxuXHRyZXR1cm4gZmFsc2VcclxufVxyXG5cclxuZnVuY3Rpb24gdGl0bGVfYXR0cmlidXRlKCRpbnB1dCl7XHJcblx0dmFyIHRpdGxlTGFiZWwgPSAkaW5wdXQuZ2V0QXR0cmlidXRlKCd0aXRsZScpO1xyXG5cdGlmICh0aXRsZUxhYmVsKSByZXR1cm4gdGl0bGVMYWJlbDtcclxuXHRyZXR1cm4gZmFsc2VcclxufVxyXG4iLCJcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRfc2VsZWN0ZWRfcmFuZ2UgKCRpbnB1dCkge1xyXG5cdHJldHVybiB7IHN0YXJ0OiAkaW5wdXQuc2VsZWN0aW9uU3RhcnQsIGVuZDogJGlucHV0LnNlbGVjdGlvbkVuZCB9O1xyXG59XHJcbiIsIlxyXG52YXIgY29udmVydF9udW1iZXIgPSByZXF1aXJlKCcuLi9jb252ZXJ0ZXJzL2NvbnZlcnRfbnVtYmVyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldF92YWx1ZXMgKCRpbnB1dCwgdGltZVN0cmluZykge1xyXG5cdHZhciB2YWx1ZSA9IHRpbWVTdHJpbmcgPyB0aW1lU3RyaW5nIDogJGlucHV0LnZhbHVlO1xyXG5cdHZhciByZWdFeCA9IC8oWzAtOS1dezEsMn0pXFw6KFswLTktXXsxLDJ9KVxccz8oQU18UE18XFwtXFwtKT8vO1xyXG5cdHZhciByZXN1bHQgPSByZWdFeC5leGVjKHZhbHVlKTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGhyczogY29udmVydF9udW1iZXIocmVzdWx0WzFdKSxcclxuXHRcdG1pbjogY29udmVydF9udW1iZXIocmVzdWx0WzJdKSxcclxuXHRcdG1vZGU6IHJlc3VsdFszXSxcclxuXHR9XHJcbn1cclxuIiwiXHJcbnZhciBtYW51YWxfZW50cnlfbG9nID0gW107XHJcblxyXG5mdW5jdGlvbiBjbGVhciAoKSB7XHJcblx0bWFudWFsX2VudHJ5X2xvZyA9IFtdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGQgKGVudHJ5KSB7XHJcblx0bWFudWFsX2VudHJ5X2xvZy5wdXNoKGVudHJ5KTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXRlbXMoKXtcclxuXHRyZXR1cm4gbWFudWFsX2VudHJ5X2xvZztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0aXRlbXM6IGl0ZW1zLFxyXG5cdGNsZWFyOiBjbGVhcixcclxuXHRhZGQ6IGFkZCxcclxufVxyXG4iLCJcclxudmFyIHRyYXZlcnNlID0gcmVxdWlyZSgnLi90cmF2ZXJzZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBuZXh0X3NlZ21lbnQgKCRpbnB1dCkge1xyXG5cdHRyYXZlcnNlKCRpbnB1dCwgJ25leHQnKTtcclxufVxyXG4iLCJcclxudmFyIHRyYXZlcnNlID0gcmVxdWlyZSgnLi90cmF2ZXJzZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwcmV2X3NlZ21lbnQgKCRpbnB1dCkge1xyXG5cdHRyYXZlcnNlKCRpbnB1dCwgJ3ByZXYnKTtcclxufVxyXG4iLCJcclxudmFyIGdldF9jdXJyZW50X3NlZ21lbnQgPSByZXF1aXJlKCcuLi9nZXR0ZXJzL2dldF9jdXJyZW50X3NlZ21lbnQnKTtcclxudmFyIHNlbGVjdF9zZWdtZW50ID0gcmVxdWlyZSgnLi9zZWxlY3Rfc2VnbWVudCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZWxlY3RfY3Vyc29yX3NlZ21lbnQgKCRpbnB1dCkge1xyXG5cdHZhciBjdXJyZW50X3NlZ21lbnQgPSBnZXRfY3VycmVudF9zZWdtZW50KCRpbnB1dCk7XHJcblx0c2VsZWN0X3NlZ21lbnQoJGlucHV0LCBjdXJyZW50X3NlZ21lbnQpO1xyXG59XHJcbiIsIlxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNlbGVjdF9zZWdtZW50ICgkaW5wdXQsIHNlZ21lbnQpIHtcclxuXHJcblx0c2V0X2lucHV0X3R5cGUoKTtcclxuXHJcblx0dmFyIGFjdGlvbnMgPSB7XHJcblx0XHRocnM6ICBzZWxlY3QoMCwgMiksXHJcblx0XHRtaW46ICBzZWxlY3QoMywgNSksXHJcblx0XHRtb2RlOiBzZWxlY3QoNiwgOCksXHJcblx0fTtcclxuXHJcblx0YWN0aW9uc1tzZWdtZW50XSgkaW5wdXQpO1xyXG5cclxuXHRmdW5jdGlvbiBzZXRfaW5wdXRfdHlwZSgpIHtcclxuXHRcdHZhciB0eXBlID0gc2VnbWVudCA9PT0gJ21vZGUnID8gJ3RleHQnIDogJ3RlbCc7XHJcblx0XHQkaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgdHlwZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZWxlY3QgKHN0YXJ0LCBlbmQpIHtcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCRpbnB1dC5zZXRTZWxlY3Rpb25SYW5nZShzdGFydCwgZW5kKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiXHJcbnZhciBnZXRfY3VycmVudF9zZWdtZW50ID0gcmVxdWlyZSgnLi4vZ2V0dGVycy9nZXRfY3VycmVudF9zZWdtZW50Jyk7XHJcbnZhciBzZWxlY3Rfc2VnbWVudCA9IHJlcXVpcmUoJy4uL3NlbGVjdG9ycy9zZWxlY3Rfc2VnbWVudCcpO1xyXG5cclxudmFyIG1hbnVhbF9lbnRyeV9sb2cgPSByZXF1aXJlKCcuLi9oZWxwZXJzL21hbnVhbF9lbnRyeV9sb2cnKTtcclxudmFyIHNlZ21lbnRzID0gcmVxdWlyZSgnLi4vc3RhdGljLXZhbHVlcy9zZWdtZW50cycpO1xyXG5cclxudmFyIHVwZGF0ZV9hMTF5ID0gcmVxdWlyZSgnLi4vYWNjZXNzaWJpbGl0eS91cGRhdGVfYTExeScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmF2ZXJzZSAoJGlucHV0LCBkaXJlY3Rpb24pIHtcclxuXHR2YXIgc2VnbWVudCA9IGdldF9jdXJyZW50X3NlZ21lbnQoJGlucHV0KTtcclxuXHJcblx0dmFyIG1vZGlmaWVyID0gZGlyZWN0aW9uID09PSAnbmV4dCcgPyAxIDogLTE7XHJcblx0dmFyIG5leHRfc2VnbWVudF9pbmRleCA9IHNlZ21lbnRzLmluZGV4T2Yoc2VnbWVudCkgKyBtb2RpZmllcjtcclxuXHJcblx0dmFyIG5leHRfc2VnbWVudCA9IHtcclxuXHRcdG5leHQ6IHNlZ21lbnRzW25leHRfc2VnbWVudF9pbmRleF0gfHwgJ21vZGUnLFxyXG5cdFx0cHJldjogbmV4dF9zZWdtZW50X2luZGV4IDwgMCA/ICdocnMnIDogc2VnbWVudHNbbmV4dF9zZWdtZW50X2luZGV4XSxcclxuXHR9W2RpcmVjdGlvbl07XHJcblxyXG5cdHNlbGVjdF9zZWdtZW50KCRpbnB1dCwgbmV4dF9zZWdtZW50KTtcclxuXHRtYW51YWxfZW50cnlfbG9nLmNsZWFyKCk7XHJcblx0dXBkYXRlX2ExMXkoJGlucHV0LCBbJ3NlbGVjdCddKVxyXG59XHJcbiIsIlxyXG52YXIgcmFuZ2VzID0ge1xyXG5cdGhycyA6IHsgc3RhcnQ6IDAsIGVuZDogMiB9LFxyXG5cdG1pbiA6IHsgc3RhcnQ6IDMsIGVuZDogNSB9LFxyXG5cdG1vZGUgOiB7IHN0YXJ0OiA2LCBlbmQ6IDggfSxcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByYW5nZXM7XHJcbiIsIlxyXG52YXIgcmFuZ2VzID0gcmVxdWlyZSgnLi9yYW5nZXMnKTtcclxuXHJcbnZhciBzZWdtZW50cyA9IE9iamVjdC5rZXlzKHJhbmdlcyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNlZ21lbnRzO1xyXG4iLCIvL3N0YXRpYy12YWx1ZXNcclxudmFyIHNlZ21lbnRzID0gcmVxdWlyZSgndGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL3N0YXRpYy12YWx1ZXMvc2VnbWVudHMnKVxyXG5cclxuLy8gY29udmVydGVyc1xyXG52YXIgY29udmVydF90b18xMmhyX3RpbWUgPSByZXF1aXJlKCd0aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvY29udmVydGVycy9jb252ZXJ0X3RvXzEyaHJfdGltZScpXHJcbnZhciBjb252ZXJ0X3RvXzI0aHJfdGltZSA9IHJlcXVpcmUoJ3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9jb252ZXJ0ZXJzL2NvbnZlcnRfdG9fMjRocl90aW1lJylcclxudmFyIGNvbnZlcnRfaG91cnNfdG9fMTJocl90aW1lID0gcmVxdWlyZSgndGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvY29udmVydF9ob3Vyc190b18xMmhyX3RpbWUnKVxyXG52YXIgY29udmVydF9udW1iZXIgPSByZXF1aXJlKCd0aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvY29udmVydGVycy9jb252ZXJ0X251bWJlcicpXHJcblxyXG4vL3NlbGVjdG9yc1xyXG52YXIgc2VsZWN0X2N1cnNvcl9zZWdtZW50ID0gcmVxdWlyZSgndGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL3NlbGVjdG9ycy9zZWxlY3RfY3Vyc29yX3NlZ21lbnQnKVxyXG52YXIgc2VsZWN0X3NlZ21lbnQgPSByZXF1aXJlKCd0aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvc2VsZWN0b3JzL3NlbGVjdF9zZWdtZW50JylcclxudmFyIG5leHRfc2VnbWVudCA9IHJlcXVpcmUoJ3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zZWxlY3RvcnMvbmV4dF9zZWdtZW50JylcclxudmFyIHByZXZfc2VnbWVudCA9IHJlcXVpcmUoJ3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zZWxlY3RvcnMvcHJldl9zZWdtZW50JylcclxuXHJcbi8vIGdldHRlcnNcclxudmFyIGdldF9sYWJlbCA9IHJlcXVpcmUoJ3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9nZXR0ZXJzL2dldF9sYWJlbCcpXHJcbnZhciBnZXRfY3VycmVudF9zZWdtZW50ID0gcmVxdWlyZSgndGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2dldHRlcnMvZ2V0X2N1cnJlbnRfc2VnbWVudCcpXHJcbnZhciBnZXRfdmFsdWVzID0gcmVxdWlyZSgndGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2dldHRlcnMvZ2V0X3ZhbHVlcycpXHJcblxyXG52YXIgZ2V0X3ZhbHVlc19mcm9tXzI0aHIgPSB2YWx1ZTI0aHIgPT4ge1xyXG5cdGNvbnN0IHZhbHVlMTJociA9IGNvbnZlcnRfdG9fMTJocl90aW1lKHZhbHVlMjRocilcclxuXHRyZXR1cm4gZ2V0X3ZhbHVlcyhudWxsLCB2YWx1ZTEyaHIpXHJcbn1cclxuXHJcbi8vIGExMXlcclxudmFyIGNyZWF0ZV9hMTF5X2Jsb2NrID0gcmVxdWlyZSgndGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2FjY2Vzc2liaWxpdHkvY3JlYXRlX2ExMXlfYmxvY2snKVxyXG5cclxud2luZG93LnRpbWVQb2x5ZmlsbEhlbHBlcnMgPSB7XHJcblx0c2VnbWVudHMsXHJcblx0Y29udmVydF90b18xMmhyX3RpbWUsXHJcblx0Y29udmVydF90b18yNGhyX3RpbWUsXHJcblx0Y29udmVydF9ob3Vyc190b18xMmhyX3RpbWUsXHJcblx0Y29udmVydF9udW1iZXIsXHJcblx0c2VsZWN0X2N1cnNvcl9zZWdtZW50LFxyXG5cdHNlbGVjdF9zZWdtZW50LFxyXG5cdG5leHRfc2VnbWVudCxcclxuXHRwcmV2X3NlZ21lbnQsXHJcblx0Z2V0X2xhYmVsLFxyXG5cdGdldF9jdXJyZW50X3NlZ21lbnQsXHJcblx0Z2V0X3ZhbHVlcyxcclxuXHRnZXRfdmFsdWVzX2Zyb21fMjRocixcclxuXHRjcmVhdGVfYTExeV9ibG9jayxcclxufVxyXG4iXX0=
