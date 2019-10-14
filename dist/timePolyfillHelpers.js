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
// converters
var convert_to_12hr_time = require('time-input-polyfill/core/converters/convert_to_12hr_time');

var convert_to_24hr_time = require('time-input-polyfill/core/converters/convert_to_24hr_time'); //selectors


var select_cursor_segment = require('time-input-polyfill/core/selectors/select_cursor_segment');

var select_segment = require('time-input-polyfill/core/selectors/select_segment');

var next_segment = require('time-input-polyfill/core/selectors/next_segment');

var prev_segment = require('time-input-polyfill/core/selectors/prev_segment'); // getters


var get_label = require('time-input-polyfill/core/getters/get_label'); // a11y


var create_a11y_block = require('time-input-polyfill/core/accessibility/create_a11y_block');

window.timePolyfillHelpers = {
  convert_to_12hr_time: convert_to_12hr_time,
  convert_to_24hr_time: convert_to_24hr_time,
  select_cursor_segment: select_cursor_segment,
  select_segment: select_segment,
  next_segment: next_segment,
  prev_segment: prev_segment,
  get_label: get_label,
  create_a11y_block: create_a11y_block
};

},{"time-input-polyfill/core/accessibility/create_a11y_block":1,"time-input-polyfill/core/converters/convert_to_12hr_time":5,"time-input-polyfill/core/converters/convert_to_24hr_time":6,"time-input-polyfill/core/getters/get_label":10,"time-input-polyfill/core/selectors/next_segment":14,"time-input-polyfill/core/selectors/prev_segment":15,"time-input-polyfill/core/selectors/select_cursor_segment":16,"time-input-polyfill/core/selectors/select_segment":17}]},{},[21])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2FjY2Vzc2liaWxpdHkvY3JlYXRlX2ExMXlfYmxvY2suanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2FjY2Vzc2liaWxpdHkvdXBkYXRlX2ExMXkuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvY29udmVydF9ob3Vyc190b18xMmhyX3RpbWUuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvY29udmVydF9udW1iZXIuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvY29udmVydF90b18xMmhyX3RpbWUuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvY29udmVydF90b18yNGhyX3RpbWUuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvbGVhZGluZ196ZXJvLmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9nZXR0ZXJzL2dldF9hbmNlc3RvcnMuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2dldHRlcnMvZ2V0X2N1cnJlbnRfc2VnbWVudC5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvZ2V0dGVycy9nZXRfbGFiZWwuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2dldHRlcnMvZ2V0X3NlbGVjdGVkX3JhbmdlLmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9nZXR0ZXJzL2dldF92YWx1ZXMuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2hlbHBlcnMvbWFudWFsX2VudHJ5X2xvZy5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvc2VsZWN0b3JzL25leHRfc2VnbWVudC5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvc2VsZWN0b3JzL3ByZXZfc2VnbWVudC5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvc2VsZWN0b3JzL3NlbGVjdF9jdXJzb3Jfc2VnbWVudC5qcyIsIm5vZGVfbW9kdWxlcy90aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvc2VsZWN0b3JzL3NlbGVjdF9zZWdtZW50LmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zZWxlY3RvcnMvdHJhdmVyc2UuanMiLCJub2RlX21vZHVsZXMvdGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL3N0YXRpYy12YWx1ZXMvcmFuZ2VzLmpzIiwibm9kZV9tb2R1bGVzL3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zdGF0aWMtdmFsdWVzL3NlZ21lbnRzLmpzIiwidGltZVBvbHlmaWxsSGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQSxJQUFJLG9CQUFvQixHQUFHLE9BQU8sQ0FBQywwREFBRCxDQUFsQzs7QUFDQSxJQUFJLG9CQUFvQixHQUFHLE9BQU8sQ0FBQywwREFBRCxDQUFsQyxDLENBRUE7OztBQUNBLElBQUkscUJBQXFCLEdBQUcsT0FBTyxDQUFDLDBEQUFELENBQW5DOztBQUNBLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxtREFBRCxDQUE1Qjs7QUFDQSxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsaURBQUQsQ0FBMUI7O0FBQ0EsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGlEQUFELENBQTFCLEMsQ0FFQTs7O0FBQ0EsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLDRDQUFELENBQXZCLEMsQ0FFQTs7O0FBQ0EsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsMERBQUQsQ0FBL0I7O0FBRUEsTUFBTSxDQUFDLG1CQUFQLEdBQTZCO0FBQzVCLEVBQUEsb0JBQW9CLEVBQXBCLG9CQUQ0QjtBQUU1QixFQUFBLG9CQUFvQixFQUFwQixvQkFGNEI7QUFHNUIsRUFBQSxxQkFBcUIsRUFBckIscUJBSDRCO0FBSTVCLEVBQUEsY0FBYyxFQUFkLGNBSjRCO0FBSzVCLEVBQUEsWUFBWSxFQUFaLFlBTDRCO0FBTTVCLEVBQUEsWUFBWSxFQUFaLFlBTjRCO0FBTzVCLEVBQUEsU0FBUyxFQUFULFNBUDRCO0FBUTVCLEVBQUEsaUJBQWlCLEVBQWpCO0FBUjRCLENBQTdCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlX2FjY2Vzc2liaWxpdHlfYmxvY2sgKCkge1xyXG5cdHZhciAkYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHQkYmxvY2suc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCAnYXNzZXJ0aXZlJyk7XHJcblx0JGJsb2NrLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAncG9zaXRpb246IGFic29sdXRlOyBvcGFjaXR5OiAwOyBoZWlnaHQ6IDA7IHdpZHRoOiAwOyBvdmVyZmxvdzogaGlkZGVuOyBwb2ludGVyLWV2ZW50czogbm9uZTsnKTtcclxuXHQkYmxvY2suY2xhc3NMaXN0LmFkZCgndGltZS1pbnB1dC1wb2x5ZmlsbC1hY2Nlc3NpYmlsaXR5LWJsb2NrJyk7XHJcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLmFwcGVuZENoaWxkKCRibG9jayk7XHJcblx0cmV0dXJuICRibG9jaztcclxufVxyXG4iLCJcclxudmFyIGdldF9jdXJyZW50X3NlZ21lbnQgPSByZXF1aXJlKCcuLi9nZXR0ZXJzL2dldF9jdXJyZW50X3NlZ21lbnQnKTtcclxudmFyIGdldF92YWx1ZXMgPSByZXF1aXJlKCcuLi9nZXR0ZXJzL2dldF92YWx1ZXMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdXBkYXRlX2ExMXkgKCRpbnB1dCwgYW5ub3VuY2VtZW50QXJyYXkpIHtcclxuXHQvLyBUaW1lb3V0IGhlbHBzIGVuc3VyZSB0aGF0IHRoZSBpbnB1dCBoYXMgc3RhYmlsaXplZFxyXG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdHZhciBjdXJyZW50X3NlZ21lbnQgPSBnZXRfY3VycmVudF9zZWdtZW50KCRpbnB1dCk7XHJcblx0XHR2YXIgdmFsdWVzID0gZ2V0X3ZhbHVlcygkaW5wdXQpO1xyXG5cdFx0dmFyIHZhbHVlID0gdmFsdWVzW2N1cnJlbnRfc2VnbWVudF07XHJcblx0XHR2YXIgZmluYWxWYWx1ZSA9IHZhbHVlID09ICctLScgPyAnYmxhbmsnIDogdmFsdWU7XHJcblxyXG5cdFx0dmFyIHNlZ21lbnROYW1lID0ge1xyXG5cdFx0XHRocnM6ICdIb3VycycsXHJcblx0XHRcdG1pbjogJ01pbnV0ZXMnLFxyXG5cdFx0XHRtb2RlOiAnQU0vUE0nXHJcblx0XHR9W2N1cnJlbnRfc2VnbWVudF07XHJcblxyXG5cdFx0dmFyIGFubm91bmNlbWVudHMgPSB7XHJcblx0XHRcdGluaXRpYWw6ICckbGFiZWwgZ3JvdXBpbmcgJGZ1bGxWYWx1ZS4nLFxyXG5cdFx0XHRzZWxlY3Q6ICckc2VnbWVudE5hbWUgc3BpbiBidXR0b24gJHNlZ21lbnRWYWx1ZS4nLFxyXG5cdFx0XHR1cGRhdGU6ICckc2VnbWVudFZhbHVlLicsXHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHRleHRBcnJheSA9IGFubm91bmNlbWVudEFycmF5Lm1hcChmdW5jdGlvbihwcm92aWRlZFN0cmluZyl7XHJcblx0XHRcdGlmIChhbm5vdW5jZW1lbnRzW3Byb3ZpZGVkU3RyaW5nXSkge1xyXG5cdFx0XHRcdHJldHVybiBhbm5vdW5jZW1lbnRzW3Byb3ZpZGVkU3RyaW5nXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcHJvdmlkZWRTdHJpbmc7XHJcblx0XHR9KTtcclxuXHJcblx0XHR2YXIgZnVsbFZhbHVlID0gJGlucHV0LnZhbHVlLnJlcGxhY2UoLy0tL2csJ2JsYW5rJyk7XHJcblxyXG5cdFx0dmFyIGh0bWwgPSAnPHA+JyArIHRleHRBcnJheS5qb2luKCc8L3A+PHA+JykgKyAnPC9wPic7XHJcblx0XHRodG1sID0gaHRtbC5yZXBsYWNlKC9cXCRsYWJlbC9nLCAkaW5wdXQucG9seWZpbGwubGFiZWwpO1xyXG5cdFx0aHRtbCA9IGh0bWwucmVwbGFjZSgvXFwkc2VnbWVudE5hbWUvZywgc2VnbWVudE5hbWUpO1xyXG5cdFx0aHRtbCA9IGh0bWwucmVwbGFjZSgvXFwkc2VnbWVudFZhbHVlL2csIGZpbmFsVmFsdWUpO1xyXG5cdFx0aHRtbCA9IGh0bWwucmVwbGFjZSgvXFwkZnVsbFZhbHVlL2csIGZ1bGxWYWx1ZSk7XHJcblxyXG5cdFx0JGlucHV0LnBvbHlmaWxsLiRhMTF5LmlubmVySFRNTCA9IGh0bWw7XHJcblx0fSwgMSk7XHJcbn1cclxuIiwiXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29udmVydF9ob3Vyc190b18xMmhyX3RpbWUgKGhvdXJzKSB7XHJcblx0cmV0dXJuIGhvdXJzIDw9IDEyID8gaG91cnMgPT09IDAgPyAxMiA6IGhvdXJzIDogaG91cnMgLSAxMjtcclxufVxyXG4iLCJcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb252ZXJ0X251bWJlciAobnVtYmVyKSB7XHJcblx0cmV0dXJuIGlzTmFOKG51bWJlcikgPyBudW1iZXIgOiBwYXJzZUludChudW1iZXIpO1xyXG59XHJcbiIsIlxyXG52YXIgY29udmVydF9udW1iZXIgPSByZXF1aXJlKCcuL2NvbnZlcnRfbnVtYmVyJyk7XHJcbnZhciBjb252ZXJ0X2hvdXJzX3RvXzEyaHJfdGltZSA9IHJlcXVpcmUoJy4vY29udmVydF9ob3Vyc190b18xMmhyX3RpbWUnKTtcclxudmFyIGxlYWRpbmdfemVybyA9IHJlcXVpcmUoJy4vbGVhZGluZ196ZXJvJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbnZlcnRfdG9fMTJocl90aW1lICh0aW1lU3RyaW5nXzI0aHIpIHtcclxuXHRpZiAodGltZVN0cmluZ18yNGhyID09PSAnJykgcmV0dXJuICctLTotLSAtLSc7XHJcblx0dmFyIHR3ZW50eUZvdXJfcmVnZXggPSAvKFswLTldezJ9KVxcOihbMC05XXsyfSkvO1xyXG5cdHZhciByZXN1bHQgPSB0d2VudHlGb3VyX3JlZ2V4LmV4ZWModGltZVN0cmluZ18yNGhyKTtcclxuXHR2YXIgaHJzXzI0ID0gY29udmVydF9udW1iZXIocmVzdWx0WzFdKTtcclxuXHR2YXIgbWluID0gcmVzdWx0WzJdO1xyXG5cdHZhciBocnNfMTIgPSBjb252ZXJ0X2hvdXJzX3RvXzEyaHJfdGltZShocnNfMjQpO1xyXG5cdHZhciBpc1BNID0gaHJzXzI0ID4gMTI7XHJcblx0dmFyIG1vZGUgPSBpc1BNID8gJ1BNJyA6ICdBTSc7XHJcblx0cmV0dXJuIFtsZWFkaW5nX3plcm8oaHJzXzEyKSwgJzonLCBtaW4sICcgJywgbW9kZV0uam9pbignJyk7XHJcbn1cclxuIiwiXHJcbnZhciBsZWFkaW5nX3plcm8gPSByZXF1aXJlKCcuL2xlYWRpbmdfemVybycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb252ZXJ0X3RvXzI0aHJfdGltZSAodGltZVN0cmluZ18xMmhyKSB7XHJcblx0aWYgKC8tLy50ZXN0KHRpbWVTdHJpbmdfMTJocikpIHJldHVybiAnJztcclxuXHR2YXIgaXNQTSA9IHRpbWVTdHJpbmdfMTJoci5pbmRleE9mKCdQTScpID4gLTE7XHJcblx0dmFyIHRpbWVSZXN1bHQgPSAvXihbMC05XXsyfSkvLmV4ZWModGltZVN0cmluZ18xMmhyKTtcclxuXHR2YXIgaHJzID0gdGltZVJlc3VsdCA/IHBhcnNlSW50KHRpbWVSZXN1bHRbMV0pIDogJyc7XHJcblx0dmFyIG5ld0hycztcclxuXHRpZiAoaHJzID09PSAxMikge1xyXG5cdFx0bmV3SHJzID0gaXNQTSA/IDEyIDogMDtcclxuXHR9IGVsc2Uge1xyXG5cdFx0bmV3SHJzID0gaXNQTSA/IGhycyArIDEyIDogaHJzO1xyXG5cdH1cclxuXHR2YXIgZmluYWxIcnMgPSBuZXdIcnMgPT09IDI0ID8gMCA6IG5ld0hycztcclxuXHR2YXIgdGltZVJlZ0V4ID0gL15bMC05XXsyfTooWzAtOV17Mn0pIChBTXxQTSkvO1xyXG5cdHJldHVybiB0aW1lU3RyaW5nXzEyaHIucmVwbGFjZSh0aW1lUmVnRXgsIGxlYWRpbmdfemVybyhmaW5hbEhycykrJzokMScpO1xyXG59XHJcbiIsIlxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxlYWRpbmdfemVybyAobnVtYmVyKSB7XHJcblx0aWYgKGlzTmFOKG51bWJlcikpIHJldHVybiBudW1iZXI7XHJcblx0dmFyIHB1cmlmaWVkID0gcGFyc2VJbnQobnVtYmVyKTtcclxuXHRyZXR1cm4gcHVyaWZpZWQgPCAxMCA/ICcwJyArIHB1cmlmaWVkIDogbnVtYmVyO1xyXG59XHJcbiIsIi8vIHNlbGVjdG9yIGlzIG9wdGlvbmFsLCBpdCBhbGxvd3MgZm9yIGFuIGVhcmx5IGV4aXRcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJGlucHV0LCBzZWxlY3RvclN0cmluZykge1xyXG5cdHZhciAkZWxlbSA9ICRpbnB1dDtcclxuXHJcblx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzg3MjkyNzQvMTYxMTA1OFxyXG5cdHZhciBhbmNlc3RvcnMgPSBbXTtcclxuXHR3aGlsZSAoJGVsZW0pIHtcclxuXHRcdGFuY2VzdG9ycy5wdXNoKCRlbGVtKTtcclxuXHRcdHZhciBtYXRjaGVzU2VsZWN0b3IgPSAkZWxlbS5tc01hdGNoZXNTZWxlY3RvciA/XHJcblx0XHRcdCRlbGVtLm1zTWF0Y2hlc1NlbGVjdG9yKHNlbGVjdG9yU3RyaW5nKSA6XHJcblx0XHRcdCRlbGVtLm1hdGNoZXMoc2VsZWN0b3JTdHJpbmcpO1xyXG5cdFx0aWYgKG1hdGNoZXNTZWxlY3Rvcikge1xyXG5cdFx0XHRyZXR1cm4gYW5jZXN0b3JzO1xyXG5cdFx0fVxyXG5cdFx0JGVsZW0gPSAkZWxlbS5wYXJlbnRFbGVtZW50O1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGFuY2VzdG9ycztcclxufVxyXG4iLCJcclxudmFyIHJhbmdlcyA9IHJlcXVpcmUoJy4uL3N0YXRpYy12YWx1ZXMvcmFuZ2VzJyk7XHJcbnZhciBnZXRfc2VsZWN0ZWRfcmFuZ2UgPSByZXF1aXJlKCcuL2dldF9zZWxlY3RlZF9yYW5nZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRfY3VycmVudF9zZWdtZW50ICgkaW5wdXQpIHtcclxuXHR2YXIgc2VsZWN0aW9uID0gZ2V0X3NlbGVjdGVkX3JhbmdlKCRpbnB1dCk7XHJcblx0Zm9yICh2YXIgc2VnbWVudCBpbiByYW5nZXMpIHtcclxuXHRcdHZhciByYW5nZSA9IHJhbmdlc1tzZWdtZW50XTtcclxuXHRcdHZhciBhYm92ZU1pbiA9IHJhbmdlLnN0YXJ0IDw9IHNlbGVjdGlvbi5zdGFydDtcclxuXHRcdHZhciBiZWxvd01heCA9IHJhbmdlLmVuZCA+PSBzZWxlY3Rpb24uZW5kO1xyXG5cdFx0aWYgKGFib3ZlTWluICYmIGJlbG93TWF4KSB7XHJcblx0XHRcdHJldHVybiBzZWdtZW50O1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gJ2hycyc7XHJcbn1cclxuIiwiXHJcbnZhciBnZXRfYW5jZXN0b3JzID0gcmVxdWlyZSgnLi9nZXRfYW5jZXN0b3JzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldF9sYWJlbCAoJGlucHV0KSB7XHJcblxyXG5cdHZhciBsYWJlbFRleHQgPVxyXG5cdFx0YXJpYV9sYWJlbGxlZGJ5KCRpbnB1dCkgfHxcclxuXHRcdGFyaWFfbGFiZWwoJGlucHV0KSB8fFxyXG5cdFx0Zm9yX2F0dHJpYnV0ZSgkaW5wdXQpIHx8XHJcblx0XHRsYWJlbF93cmFwcGVyX2VsZW1lbnQoJGlucHV0KSB8fFxyXG5cdFx0dGl0bGVfYXR0cmlidXRlKCRpbnB1dCk7XHJcblxyXG5cdGlmIChsYWJlbFRleHQpIHJldHVybiBsYWJlbFRleHQ7XHJcblxyXG5cdGNvbnNvbGUuZXJyb3IoJ0xhYmVsIHRleHQgZm9yIGlucHV0IG5vdCBmb3VuZC4nLCAkaW5wdXQpO1xyXG5cdHRocm93IG5ldyBFcnJvcignQ2Fubm90IHBvbHlmaWxsIHRpbWUgaW5wdXQgZHVlIHRvIGEgbWlzc2luZyBsYWJlbC4nKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYXJpYV9sYWJlbGxlZGJ5KCRpbnB1dCl7XHJcblx0dmFyIGFyaWFMYWJlbEJ5SUQgPSAkaW5wdXQuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcclxuXHRpZiAoYXJpYUxhYmVsQnlJRCkge1xyXG5cdFx0dmFyICRhcmlhTGFiZWxCeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGFyaWFMYWJlbEJ5SUQpO1xyXG5cdFx0aWYgKCRhcmlhTGFiZWxCeSkgcmV0dXJuICRhcmlhTGFiZWxCeS50ZXh0Q29udGVudDtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhcmlhX2xhYmVsKCRpbnB1dCl7XHJcblx0dmFyIGFyaWFMYWJlbCA9ICRpbnB1dC5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcclxuXHRpZiAoYXJpYUxhYmVsKSByZXR1cm4gYXJpYUxhYmVsO1xyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZm9yX2F0dHJpYnV0ZSgkaW5wdXQpe1xyXG5cdGlmICgkaW5wdXQuaWQpIHtcclxuXHRcdHZhciAkZm9yTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdsYWJlbFtmb3I9XCInKyRpbnB1dC5pZCsnXCJdJyk7XHJcblx0XHRpZiAoJGZvckxhYmVsKSByZXR1cm4gJGZvckxhYmVsLnRleHRDb250ZW50O1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxhYmVsX3dyYXBwZXJfZWxlbWVudCgkaW5wdXQpe1xyXG5cdHZhciBhbmNlc3RvcnMgPSBnZXRfYW5jZXN0b3JzKCRpbnB1dCwgJ2xhYmVsJyk7XHJcblx0dmFyICRwYXJlbnRMYWJlbCA9IGFuY2VzdG9yc1thbmNlc3RvcnMubGVuZ3RoIC0gMV07XHJcblx0aWYgKCRwYXJlbnRMYWJlbC5ub2RlTmFtZSA9PSAnTEFCRUwnKSByZXR1cm4gJHBhcmVudExhYmVsLnRleHRDb250ZW50O1xyXG5cdHJldHVybiBmYWxzZVxyXG59XHJcblxyXG5mdW5jdGlvbiB0aXRsZV9hdHRyaWJ1dGUoJGlucHV0KXtcclxuXHR2YXIgdGl0bGVMYWJlbCA9ICRpbnB1dC5nZXRBdHRyaWJ1dGUoJ3RpdGxlJyk7XHJcblx0aWYgKHRpdGxlTGFiZWwpIHJldHVybiB0aXRsZUxhYmVsO1xyXG5cdHJldHVybiBmYWxzZVxyXG59XHJcbiIsIlxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldF9zZWxlY3RlZF9yYW5nZSAoJGlucHV0KSB7XHJcblx0cmV0dXJuIHsgc3RhcnQ6ICRpbnB1dC5zZWxlY3Rpb25TdGFydCwgZW5kOiAkaW5wdXQuc2VsZWN0aW9uRW5kIH07XHJcbn1cclxuIiwiXHJcbnZhciBjb252ZXJ0X251bWJlciA9IHJlcXVpcmUoJy4uL2NvbnZlcnRlcnMvY29udmVydF9udW1iZXInKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0X3ZhbHVlcyAoJGlucHV0LCB0aW1lU3RyaW5nKSB7XHJcblx0dmFyIHZhbHVlID0gdGltZVN0cmluZyA/IHRpbWVTdHJpbmcgOiAkaW5wdXQudmFsdWU7XHJcblx0dmFyIHJlZ0V4ID0gLyhbMC05LV17MSwyfSlcXDooWzAtOS1dezEsMn0pXFxzPyhBTXxQTXxcXC1cXC0pPy87XHJcblx0dmFyIHJlc3VsdCA9IHJlZ0V4LmV4ZWModmFsdWUpO1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aHJzOiBjb252ZXJ0X251bWJlcihyZXN1bHRbMV0pLFxyXG5cdFx0bWluOiBjb252ZXJ0X251bWJlcihyZXN1bHRbMl0pLFxyXG5cdFx0bW9kZTogcmVzdWx0WzNdLFxyXG5cdH1cclxufVxyXG4iLCJcclxudmFyIG1hbnVhbF9lbnRyeV9sb2cgPSBbXTtcclxuXHJcbmZ1bmN0aW9uIGNsZWFyICgpIHtcclxuXHRtYW51YWxfZW50cnlfbG9nID0gW107XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZCAoZW50cnkpIHtcclxuXHRtYW51YWxfZW50cnlfbG9nLnB1c2goZW50cnkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpdGVtcygpe1xyXG5cdHJldHVybiBtYW51YWxfZW50cnlfbG9nO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRpdGVtczogaXRlbXMsXHJcblx0Y2xlYXI6IGNsZWFyLFxyXG5cdGFkZDogYWRkLFxyXG59XHJcbiIsIlxyXG52YXIgdHJhdmVyc2UgPSByZXF1aXJlKCcuL3RyYXZlcnNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5leHRfc2VnbWVudCAoJGlucHV0KSB7XHJcblx0dHJhdmVyc2UoJGlucHV0LCAnbmV4dCcpO1xyXG59XHJcbiIsIlxyXG52YXIgdHJhdmVyc2UgPSByZXF1aXJlKCcuL3RyYXZlcnNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHByZXZfc2VnbWVudCAoJGlucHV0KSB7XHJcblx0dHJhdmVyc2UoJGlucHV0LCAncHJldicpO1xyXG59XHJcbiIsIlxyXG52YXIgZ2V0X2N1cnJlbnRfc2VnbWVudCA9IHJlcXVpcmUoJy4uL2dldHRlcnMvZ2V0X2N1cnJlbnRfc2VnbWVudCcpO1xyXG52YXIgc2VsZWN0X3NlZ21lbnQgPSByZXF1aXJlKCcuL3NlbGVjdF9zZWdtZW50Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNlbGVjdF9jdXJzb3Jfc2VnbWVudCAoJGlucHV0KSB7XHJcblx0dmFyIGN1cnJlbnRfc2VnbWVudCA9IGdldF9jdXJyZW50X3NlZ21lbnQoJGlucHV0KTtcclxuXHRzZWxlY3Rfc2VnbWVudCgkaW5wdXQsIGN1cnJlbnRfc2VnbWVudCk7XHJcbn1cclxuIiwiXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2VsZWN0X3NlZ21lbnQgKCRpbnB1dCwgc2VnbWVudCkge1xyXG5cclxuXHRzZXRfaW5wdXRfdHlwZSgpO1xyXG5cclxuXHR2YXIgYWN0aW9ucyA9IHtcclxuXHRcdGhyczogIHNlbGVjdCgwLCAyKSxcclxuXHRcdG1pbjogIHNlbGVjdCgzLCA1KSxcclxuXHRcdG1vZGU6IHNlbGVjdCg2LCA4KSxcclxuXHR9O1xyXG5cclxuXHRhY3Rpb25zW3NlZ21lbnRdKCRpbnB1dCk7XHJcblxyXG5cdGZ1bmN0aW9uIHNldF9pbnB1dF90eXBlKCkge1xyXG5cdFx0dmFyIHR5cGUgPSBzZWdtZW50ID09PSAnbW9kZScgPyAndGV4dCcgOiAndGVsJztcclxuXHRcdCRpbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCB0eXBlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNlbGVjdCAoc3RhcnQsIGVuZCkge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JGlucHV0LnNldFNlbGVjdGlvblJhbmdlKHN0YXJ0LCBlbmQpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCJcclxudmFyIGdldF9jdXJyZW50X3NlZ21lbnQgPSByZXF1aXJlKCcuLi9nZXR0ZXJzL2dldF9jdXJyZW50X3NlZ21lbnQnKTtcclxudmFyIHNlbGVjdF9zZWdtZW50ID0gcmVxdWlyZSgnLi4vc2VsZWN0b3JzL3NlbGVjdF9zZWdtZW50Jyk7XHJcblxyXG52YXIgbWFudWFsX2VudHJ5X2xvZyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbWFudWFsX2VudHJ5X2xvZycpO1xyXG52YXIgc2VnbWVudHMgPSByZXF1aXJlKCcuLi9zdGF0aWMtdmFsdWVzL3NlZ21lbnRzJyk7XHJcblxyXG52YXIgdXBkYXRlX2ExMXkgPSByZXF1aXJlKCcuLi9hY2Nlc3NpYmlsaXR5L3VwZGF0ZV9hMTF5Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYXZlcnNlICgkaW5wdXQsIGRpcmVjdGlvbikge1xyXG5cdHZhciBzZWdtZW50ID0gZ2V0X2N1cnJlbnRfc2VnbWVudCgkaW5wdXQpO1xyXG5cclxuXHR2YXIgbW9kaWZpZXIgPSBkaXJlY3Rpb24gPT09ICduZXh0JyA/IDEgOiAtMTtcclxuXHR2YXIgbmV4dF9zZWdtZW50X2luZGV4ID0gc2VnbWVudHMuaW5kZXhPZihzZWdtZW50KSArIG1vZGlmaWVyO1xyXG5cclxuXHR2YXIgbmV4dF9zZWdtZW50ID0ge1xyXG5cdFx0bmV4dDogc2VnbWVudHNbbmV4dF9zZWdtZW50X2luZGV4XSB8fCAnbW9kZScsXHJcblx0XHRwcmV2OiBuZXh0X3NlZ21lbnRfaW5kZXggPCAwID8gJ2hycycgOiBzZWdtZW50c1tuZXh0X3NlZ21lbnRfaW5kZXhdLFxyXG5cdH1bZGlyZWN0aW9uXTtcclxuXHJcblx0c2VsZWN0X3NlZ21lbnQoJGlucHV0LCBuZXh0X3NlZ21lbnQpO1xyXG5cdG1hbnVhbF9lbnRyeV9sb2cuY2xlYXIoKTtcclxuXHR1cGRhdGVfYTExeSgkaW5wdXQsIFsnc2VsZWN0J10pXHJcbn1cclxuIiwiXHJcbnZhciByYW5nZXMgPSB7XHJcblx0aHJzIDogeyBzdGFydDogMCwgZW5kOiAyIH0sXHJcblx0bWluIDogeyBzdGFydDogMywgZW5kOiA1IH0sXHJcblx0bW9kZSA6IHsgc3RhcnQ6IDYsIGVuZDogOCB9LFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJhbmdlcztcclxuIiwiXHJcbnZhciByYW5nZXMgPSByZXF1aXJlKCcuL3JhbmdlcycpO1xyXG5cclxudmFyIHNlZ21lbnRzID0gT2JqZWN0LmtleXMocmFuZ2VzKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2VnbWVudHM7XHJcbiIsIi8vIGNvbnZlcnRlcnNcclxudmFyIGNvbnZlcnRfdG9fMTJocl90aW1lID0gcmVxdWlyZSgndGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL2NvbnZlcnRlcnMvY29udmVydF90b18xMmhyX3RpbWUnKVxyXG52YXIgY29udmVydF90b18yNGhyX3RpbWUgPSByZXF1aXJlKCd0aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvY29udmVydGVycy9jb252ZXJ0X3RvXzI0aHJfdGltZScpXHJcblxyXG4vL3NlbGVjdG9yc1xyXG52YXIgc2VsZWN0X2N1cnNvcl9zZWdtZW50ID0gcmVxdWlyZSgndGltZS1pbnB1dC1wb2x5ZmlsbC9jb3JlL3NlbGVjdG9ycy9zZWxlY3RfY3Vyc29yX3NlZ21lbnQnKVxyXG52YXIgc2VsZWN0X3NlZ21lbnQgPSByZXF1aXJlKCd0aW1lLWlucHV0LXBvbHlmaWxsL2NvcmUvc2VsZWN0b3JzL3NlbGVjdF9zZWdtZW50JylcclxudmFyIG5leHRfc2VnbWVudCA9IHJlcXVpcmUoJ3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zZWxlY3RvcnMvbmV4dF9zZWdtZW50JylcclxudmFyIHByZXZfc2VnbWVudCA9IHJlcXVpcmUoJ3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9zZWxlY3RvcnMvcHJldl9zZWdtZW50JylcclxuXHJcbi8vIGdldHRlcnNcclxudmFyIGdldF9sYWJlbCA9IHJlcXVpcmUoJ3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9nZXR0ZXJzL2dldF9sYWJlbCcpXHJcblxyXG4vLyBhMTF5XHJcbnZhciBjcmVhdGVfYTExeV9ibG9jayA9IHJlcXVpcmUoJ3RpbWUtaW5wdXQtcG9seWZpbGwvY29yZS9hY2Nlc3NpYmlsaXR5L2NyZWF0ZV9hMTF5X2Jsb2NrJylcclxuXHJcbndpbmRvdy50aW1lUG9seWZpbGxIZWxwZXJzID0ge1xyXG5cdGNvbnZlcnRfdG9fMTJocl90aW1lLFxyXG5cdGNvbnZlcnRfdG9fMjRocl90aW1lLFxyXG5cdHNlbGVjdF9jdXJzb3Jfc2VnbWVudCxcclxuXHRzZWxlY3Rfc2VnbWVudCxcclxuXHRuZXh0X3NlZ21lbnQsXHJcblx0cHJldl9zZWdtZW50LFxyXG5cdGdldF9sYWJlbCxcclxuXHRjcmVhdGVfYTExeV9ibG9jayxcclxufVxyXG4iXX0=
