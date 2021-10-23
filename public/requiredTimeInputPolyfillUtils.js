(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var a11y = {};

	var staticTestValues = {};

	Object.defineProperty(staticTestValues, "__esModule", { value: true });
	staticTestValues.preFilledValues = staticTestValues.a11yID = staticTestValues.inputPreFilledID = staticTestValues.inputID = void 0;
	staticTestValues.inputID = 'testInput';
	staticTestValues.inputPreFilledID = 'testInputPreFilled';
	staticTestValues.a11yID = 'time-input-polyfill-accessibility-block';
	staticTestValues.preFilledValues = {
	    string12hr: '12:00 AM',
	    string24hr: '00:00',
	    timeObject: {
	        hrs24: 0,
	        hrs12: 12,
	        minutes: 0,
	        mode: 'AM',
	    },
	};

	var get = {};

	var convert = {};

	var common = {};

	var blankValues = {};

	Object.defineProperty(blankValues, "__esModule", { value: true });
	blankValues.blankValues = void 0;
	blankValues.blankValues = {
	    string12hr: '--:-- --',
	    string24hr: '',
	    timeObject: {
	        hrs24: null,
	        hrs12: null,
	        minutes: null,
	        mode: null,
	    },
	};

	var supportsTime = {};

	var Window = {};

	Object.defineProperty(Window, "__esModule", { value: true });
	// Needed for telling Typescript that this file can be imported
	Window.default = {};

	Object.defineProperty(supportsTime, "__esModule", { value: true });

	// This is intentionally separate from index.ts since it needs to be downloaded in modern browsers
	// https://stackoverflow.com/a/10199306/1611058
	function get_time_support() {
	    var input = document.createElement('input');
	    input.setAttribute('type', 'time');
	    var notValid = 'not-a-time';
	    input.setAttribute('value', notValid);
	    return input.value !== notValid;
	}
	var timeSupport = get_time_support();
	if (window)
	    window.supportsTime = timeSupport;
	supportsTime.default = timeSupport;

	(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var blankValues_1 = blankValues;
	Object.defineProperty(exports, "blankValues", { enumerable: true, get: function () { return blankValues_1.blankValues; } });
	var supportsTime_1 = supportsTime;
	Object.defineProperty(exports, "supportsTime", { enumerable: true, get: function () { return supportsTime_1.default; } });
	}(common));

	var is = {};

	var utils$1 = {};

	Object.defineProperty(utils$1, "__esModule", { value: true });
	utils$1.getKeys = void 0;
	utils$1.getKeys = function (object) {
	    return Object.keys(object);
	};

	var regex = {};

	Object.defineProperty(regex, "__esModule", { value: true });
	var regex_1 = regex.regex = void 0;
	regex_1 = regex.regex = {
	    string12hr: /^([0-9-]{1,2}):([0-9-]{2})\s(AM|PM|--)$/,
	    string24hr: /^$|^([0-9]{2}):([0-9]{2})$/,
	    alphaNumericKeyName: /^[A-z0-9]$/,
	};

	var staticValues = {};

	(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.timeObjectKeys = exports.segments = exports.maxAndMins = exports.rangesList = exports.ranges = void 0;
	exports.ranges = {
	    hrs12: { start: 0, end: 2, segment: 'hrs12' },
	    minutes: { start: 3, end: 5, segment: 'minutes' },
	    mode: { start: 6, end: 8, segment: 'mode' },
	};
	exports.rangesList = [exports.ranges.hrs12, exports.ranges.minutes, exports.ranges.mode];
	exports.maxAndMins = {
	    hrs24: { min: 0, max: 23 },
	    hrs12: { min: 1, max: 12 },
	    minutes: { min: 0, max: 59 },
	};
	exports.segments = ['hrs12', 'minutes', 'mode'];
	exports.timeObjectKeys = ['hrs24', 'hrs12', 'minutes', 'mode'];
	}(staticValues));

	var utils = {};

	Object.defineProperty(utils, "__esModule", { value: true });
	var matchesTimeObject = utils.matchesTimeObject = utils.toLeadingZero = utils.toNumber = utils.toArray = void 0;
	utils.toArray = function (NodeList) { return Array.prototype.slice.call(NodeList, 0); };
	utils.toNumber = function (value) {
	    var number = Number(value);
	    return isNaN(number) ? null : number;
	};
	utils.toLeadingZero = function (value) {
	    if (value === null)
	        return '--';
	    var number = Number(value);
	    if (isNaN(number) && typeof value !== 'number')
	        return value;
	    return number < 10 ? "0" + number : "" + number;
	};
	matchesTimeObject = utils.matchesTimeObject = function (timeObjA, timeObjB) {
	    return JSON.stringify(timeObjA) === JSON.stringify(timeObjB);
	};

	(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isString24hr = exports.isString12hr = exports.isCompleteTimeObject = exports.isTimeObject = exports.isAmTimeObject = exports.isAmString24hr = exports.isAmString12hr = exports.isAmHrs24 = exports.isPmTimeObject = exports.isPmString24hr = exports.isPmString12hr = exports.isPmHrs24 = exports.isShiftHeldDown = void 0;
	var utils_1 = utils$1;
	var regex_1 = regex;
	var staticValues_1 = staticValues;
	var utils_2 = utils;
	exports.isShiftHeldDown = false;
	window.addEventListener('keyup', function (e) { return (exports.isShiftHeldDown = e.shiftKey); });
	window.addEventListener('keydown', function (e) { return (exports.isShiftHeldDown = e.shiftKey); });
	var isValidTimeString = function (_a) {
	    var value = _a.value, format = _a.format, minHrs = _a.minHrs, maxHrs = _a.maxHrs;
	    var isFormatValid = regex_1.regex[format].test(value);
	    if (!isFormatValid)
	        return false;
	    var parsedString = regex_1.regex[format].exec(value) || [];
	    var hrsVal = utils_2.toNumber(parsedString[1]);
	    var minsVal = utils_2.toNumber(parsedString[2]);
	    var isHrsValid = hrsVal === null || (hrsVal >= minHrs && hrsVal <= maxHrs);
	    var isMinsValid = minsVal === null || (minsVal >= 0 && minsVal <= 59);
	    return isHrsValid && isMinsValid;
	};
	exports.isPmHrs24 = function (hrs24) { return hrs24 !== null && 12 <= hrs24 && hrs24 < 24; };
	exports.isPmString12hr = function (string12hr) { var _a; return ((_a = regex_1.regex.string12hr.exec(string12hr)) === null || _a === void 0 ? void 0 : _a[3]) === 'PM'; };
	exports.isPmString24hr = function (string24hr) {
	    var _a;
	    if (string24hr === '')
	        return false;
	    var hrs24 = utils_2.toNumber(((_a = regex_1.regex.string24hr.exec(string24hr)) === null || _a === void 0 ? void 0 : _a[1]) || '');
	    return typeof hrs24 == 'number' && hrs24 > 11;
	};
	exports.isPmTimeObject = function (timeObject) {
	    if (!timeObject.mode && timeObject.hrs24 !== null) {
	        return timeObject.hrs24 > 11;
	    }
	    return timeObject.mode === 'PM';
	};
	exports.isAmHrs24 = function (hrs24) { return hrs24 !== null && !exports.isPmHrs24(hrs24); };
	exports.isAmString12hr = function (string12hr) {
	    return regex_1.regex.string12hr.test(string12hr) &&
	        string12hr.indexOf('--') === -1 &&
	        !exports.isPmString12hr(string12hr);
	};
	exports.isAmString24hr = function (string24hr) {
	    return string24hr !== '' && !exports.isPmString24hr(string24hr);
	};
	exports.isAmTimeObject = function (timeObject) {
	    return !exports.isPmTimeObject(timeObject) && exports.isCompleteTimeObject(timeObject);
	};
	exports.isTimeObject = function (value) {
	    if (typeof value === 'undefined' || typeof value !== 'object')
	        return false;
	    var keys = Object.keys(value);
	    if (keys.length === 0)
	        return false;
	    var filteredKeys = staticValues_1.timeObjectKeys.filter(function (key) { return keys.indexOf(key) === -1; });
	    var additionalKeys = keys.filter(function (key) {
	        // key might not be a TimeObjectKey but that is exactly what I'm checking for here
	        return staticValues_1.timeObjectKeys.indexOf(key) === -1;
	    });
	    return filteredKeys.length === 0 && additionalKeys.length === 0;
	};
	exports.isCompleteTimeObject = function (timeObject) {
	    if (!exports.isTimeObject(timeObject)) {
	        return false;
	    }
	    return utils_1.getKeys(timeObject).every(function (key) { return timeObject[key] !== null; });
	};
	exports.isString12hr = function (value) {
	    return isValidTimeString({ value: value, format: 'string12hr', minHrs: 1, maxHrs: 12 });
	};
	exports.isString24hr = function (value) {
	    if (value === '')
	        return true;
	    return isValidTimeString({ value: value, format: 'string24hr', minHrs: 0, maxHrs: 23 });
	};
	}(is));

	var validate = {};

	Object.defineProperty(validate, "__esModule", { value: true });
	validate.validateHours24 = validate.validateTimeObject = validate.validateString24hr = validate.validateString12hr = void 0;
	var is_1 = is;
	var writeBadValue = function (badValue) {
	    if (typeof badValue === 'string') {
	        return "\"" + badValue + "\"";
	    }
	    if (badValue === null) {
	        return 'null';
	    }
	    if (badValue === undefined) {
	        return 'undefined';
	    }
	    return badValue;
	};
	validate.validateString12hr = function (string12hr) {
	    if (!is_1.isString12hr(string12hr)) {
	        throw new Error("\"" + string12hr + "\" is not a valid 12 hour time, use the format \"HH:MM AM/PM\"");
	    }
	    return true;
	};
	validate.validateString24hr = function (string24hr) {
	    if (!is_1.isString24hr(string24hr)) {
	        var extra = (/-/.test(string24hr) &&
	            ' Use an empty string instead of "--:--" to represent a blank value') ||
	            (/24:\d\d/.test(string24hr) && ' Use "00" instead of "24".') ||
	            '';
	        throw new Error("\"" + string24hr + "\" is not a valid 24 hour time." + extra);
	    }
	    return true;
	};
	validate.validateTimeObject = function (timeObject) {
	    var hrs24 = timeObject.hrs24, hrs12 = timeObject.hrs12, minutes = timeObject.minutes, mode = timeObject.mode;
	    if (!is_1.isTimeObject(timeObject)) {
	        throw new Error(JSON.stringify(timeObject) + " is not a valid time object. Must be in the format {hrs24: 0, hrs12: 12, minutes: 0, mode: 'AM'} (12:00 AM)");
	    }
	    var isValid = function (variable, varName, lower, upper) {
	        if ((typeof variable === 'string' && variable !== '--') ||
	            (typeof variable === 'number' && (variable > upper || variable < lower))) {
	            var badValue = writeBadValue(variable);
	            throw new Error(varName + " (" + badValue + ") is invalid, \"" + varName + "\" must be a number " + lower + "-" + upper + " or null");
	        }
	    };
	    isValid(hrs24, 'hrs24', 0, 23);
	    isValid(hrs12, 'hrs12', 1, 12);
	    isValid(minutes, 'minutes', 0, 59);
	    var validModes = ['AM', 'PM', null];
	    if (validModes.indexOf(mode) < 0) {
	        throw new Error("Mode (" + writeBadValue(mode) + ") is invalid. Valid values are: " + validModes
	            .map(function (val) { return writeBadValue(val); })
	            .join(', '));
	    }
	    if (hrs24 !== null && hrs12 === null) {
	        throw new Error("hrs12 (" + hrs12 + ") must not be null if hrs24 (" + hrs24 + ") has a value");
	    }
	    if ((hrs24 === 0 && hrs12 !== 12) ||
	        (hrs24 !== null && hrs12 !== hrs24 && hrs24 < 13 && hrs24 !== 0) ||
	        (typeof hrs24 === 'number' && hrs24 > 12 && hrs12 !== hrs24 - 12)) {
	        throw new Error("hrs12 (" + hrs12 + ") should be equal to or 12 hours behind hrs24 (" + hrs24 + ")");
	    }
	    if (mode !== null &&
	        ((hrs24 && hrs24 >= 12 && mode !== 'PM') || (hrs24 && hrs24 <= 11 && mode !== 'AM'))) {
	        if (mode === 'PM') {
	            throw new Error("If mode (" + mode + ") is \"PM\", hrs24 (" + hrs24 + ") should be greater than or equal to 12");
	        }
	        else {
	            throw new Error("If mode (" + mode + ") is \"AM\", hrs24 (" + hrs24 + ") should be less than or equal to 11");
	        }
	    }
	    if (mode === null && hrs24 !== null) {
	        throw new Error("If mode is null, hrs24 (" + hrs24 + ") must be null as well. It is not possible to know the correct hrs24 value if mode is null");
	    }
	    if (mode !== null && hrs12 !== null && hrs24 === null) {
	        throw new Error("If mode (" + mode + ") and hrs12 (" + hrs12 + ") are defined then hrs24 (" + hrs24 + ") must be defined as well");
	    }
	    return true;
	};
	validate.validateHours24 = function (hrs24) {
	    if ((typeof hrs24 !== 'number' && hrs24 !== '--') ||
	        (typeof hrs24 === 'number' && (hrs24 < 0 || hrs24 > 23))) {
	        throw new Error("\"" + hrs24 + "\" must be a number between 0 and 23 or null, use 0 instead of 24");
	    }
	    return true;
	};

	(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.convertDateObject = exports.convertHours24 = exports.convertTimeObject = exports.convertString24hr = exports.convertString12hr = void 0;
	var index_1 = common;
	var is_1 = is;
	var regex_1 = regex;
	var utils_1 = utils;
	var validate_1 = validate;
	exports.convertString12hr = function (string12hr) {
	    validate_1.validateString12hr(string12hr);
	    return {
	        to24hr: function () {
	            if (/-/.test(string12hr))
	                return '';
	            var timeObject = exports.convertString12hr(string12hr).toTimeObject();
	            return exports.convertTimeObject(timeObject).to24hr();
	        },
	        toTimeObject: function () {
	            var result = regex_1.regex.string12hr.exec(string12hr) || [];
	            var _a = [
	                utils_1.toNumber(result[1]),
	                utils_1.toNumber(result[2]),
	                (result[3] === '--' ? null : result[3]),
	            ], hrs12 = _a[0], minutes = _a[1], mode = _a[2];
	            var getHrs24 = function () {
	                if (typeof hrs12 === 'number') {
	                    if (mode === null && hrs12 === 12) {
	                        return 0;
	                    }
	                    if (mode === 'PM') {
	                        if (hrs12 === 12) {
	                            return 12;
	                        }
	                        else if (hrs12 + 12 > 23) {
	                            return (hrs12 + 12 - 24);
	                        }
	                        else {
	                            return (hrs12 + 12);
	                        }
	                    }
	                    else if (mode === 'AM' && hrs12 === 12) {
	                        return 0;
	                    }
	                    else {
	                        return hrs12;
	                    }
	                }
	                return null;
	            };
	            var nullifyDashes = function (value) {
	                return value === '--' ? null : value;
	            };
	            var newMode = nullifyDashes(mode);
	            var hrs24 = newMode ? getHrs24() : null;
	            var timeObject = {
	                hrs24: hrs24,
	                hrs12: nullifyDashes(hrs12),
	                minutes: nullifyDashes(minutes),
	                mode: newMode,
	            };
	            validate_1.validateTimeObject(timeObject);
	            return timeObject;
	        },
	    };
	};
	exports.convertString24hr = function (string24hr) {
	    validate_1.validateString24hr(string24hr);
	    return {
	        to12hr: function () {
	            if (string24hr === index_1.blankValues.string24hr) {
	                return index_1.blankValues.string12hr;
	            }
	            var timeObject = exports.convertString24hr(string24hr).toTimeObject();
	            return exports.convertTimeObject(timeObject).to12hr();
	        },
	        toTimeObject: function () {
	            if (string24hr === index_1.blankValues.string24hr) {
	                return index_1.blankValues.timeObject;
	            }
	            // string24hr
	            var regResult = regex_1.regex.string24hr.exec(string24hr) || [];
	            var _a = [regResult[1], regResult[2]], hrsString24 = _a[0], minString = _a[1];
	            var _b = [utils_1.toNumber(hrsString24), utils_1.toNumber(minString)], hrs24 = _b[0], minutes = _b[1];
	            var timeObject = {
	                hrs24: hrs24,
	                hrs12: exports.convertHours24(hrs24).toHours12(),
	                minutes: minutes,
	                mode: (is_1.isAmString24hr(string24hr) && 'AM') ||
	                    (is_1.isPmString24hr(string24hr) && 'PM') ||
	                    null,
	            };
	            validate_1.validateTimeObject(timeObject);
	            return timeObject;
	        },
	    };
	};
	exports.convertTimeObject = function (timeObject, skipValidation) {
	    if (skipValidation === void 0) { skipValidation = false; }
	    if (!skipValidation) {
	        validate_1.validateTimeObject(timeObject);
	    }
	    var hrs24 = timeObject.hrs24, hrs12 = timeObject.hrs12, minutes = timeObject.minutes, mode = timeObject.mode;
	    var hrsString24 = utils_1.toLeadingZero(hrs24);
	    var hrsString12 = utils_1.toLeadingZero(hrs12);
	    var minString = utils_1.toLeadingZero(minutes);
	    return {
	        to12hr: function () { return hrsString12 + ":" + minString + " " + (mode || '--'); },
	        to24hr: function () {
	            var string24hr = hrsString24 + ":" + minString;
	            if (/-/.test(string24hr))
	                return '';
	            return string24hr;
	        },
	    };
	};
	exports.convertHours24 = function (hours24) {
	    validate_1.validateHours24(hours24);
	    var getHours12 = function () {
	        if (typeof hours24 === 'number') {
	            if (hours24 <= 12) {
	                if (hours24 === 0) {
	                    return 12;
	                }
	                else {
	                    return hours24;
	                }
	            }
	            else {
	                return (hours24 - 12);
	            }
	        }
	        return hours24;
	    };
	    return {
	        toHours12: function () { return getHours12(); },
	    };
	};
	exports.convertDateObject = function (date) {
	    return {
	        to12hr: function () {
	            var timeObject = exports.convertDateObject(date).toTimeObject();
	            return exports.convertTimeObject(timeObject).to12hr();
	        },
	        to24hr: function () {
	            var timeObject = exports.convertDateObject(date).toTimeObject();
	            return exports.convertTimeObject(timeObject).to24hr();
	        },
	        toTimeObject: function () {
	            var _a = [date.getHours(), date.getMinutes()], hrs24 = _a[0], minutes = _a[1];
	            var hrs12 = exports.convertHours24(hrs24).toHours12();
	            var mode = is_1.isAmHrs24(hrs24) ? 'AM' : 'PM';
	            return { hrs24: hrs24, hrs12: hrs12, minutes: minutes, mode: mode };
	        },
	    };
	};
	}(convert));

	(function (exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getAncestorsOf = exports.getRangeOf = exports.getNextSegment = exports.getPrevSegment = exports.getCursorSegment = exports.getLabelTextOf = exports.getInputValue = exports.getString24hr = exports.getString12hr = void 0;
	var convert_1 = convert;
	var regex_1 = regex;
	var staticValues_1 = staticValues;
	var traverseSegmentRanges = function ($input, direction) {
	    var cursorSegmentRange = exports.getRangeOf($input).cursorSegment();
	    var currentType = cursorSegmentRange.segment;
	    var modifier = direction === 'forward' ? 1 : -1;
	    var nextTypeIndex = staticValues_1.rangesList.map(function (range) { return range.segment; }).indexOf(currentType) + modifier;
	    return staticValues_1.rangesList[nextTypeIndex] || cursorSegmentRange;
	};
	exports.getString12hr = function (string12hr) {
	    var timeObject = convert_1.convertString12hr(string12hr).toTimeObject();
	    return __assign(__assign({}, timeObject), { timeObject: timeObject });
	};
	exports.getString24hr = function (string24hr) {
	    var timeObject = convert_1.convertString24hr(string24hr).toTimeObject();
	    return __assign(__assign({}, timeObject), { timeObject: timeObject });
	};
	exports.getInputValue = function ($input) {
	    var value = ($input === null || $input === void 0 ? void 0 : $input.value) || '';
	    var is12hrTime = regex_1.regex.string12hr.test(value);
	    var is24hrTime = regex_1.regex.string24hr.test(value);
	    return {
	        as12hrString: function () { return (is12hrTime ? value : convert_1.convertString24hr(value).to12hr()); },
	        as24hrString: function () { return (is24hrTime ? value : convert_1.convertString12hr(value).to24hr()); },
	        asTimeObject: function () {
	            return is12hrTime
	                ? convert_1.convertString12hr(value).toTimeObject()
	                : convert_1.convertString24hr(value).toTimeObject();
	        },
	    };
	};
	exports.getLabelTextOf = function ($input, document) {
	    if (document === void 0) { document = window.document; }
	    if (!$input)
	        return '';
	    var labelText = aria_labelledby($input, document) ||
	        aria_label($input) ||
	        for_attribute($input, document) ||
	        label_wrapper_element($input) ||
	        title_attribute($input);
	    if (labelText)
	        return labelText;
	    console.error('Label text for input not found.', $input);
	    throw new Error('Cannot polyfill time input due to a missing label.');
	};
	exports.getCursorSegment = function ($input) {
	    return exports.getRangeOf($input).cursorSegment().segment;
	};
	exports.getPrevSegment = function ($inputOrSegment) {
	    if (typeof $inputOrSegment === 'string') {
	        if ($inputOrSegment === 'hrs12')
	            return 'hrs12';
	        if ($inputOrSegment === 'minutes')
	            return 'hrs12';
	        if ($inputOrSegment === 'mode')
	            return 'minutes';
	    }
	    return exports.getRangeOf($inputOrSegment).prevSegment().segment;
	};
	exports.getNextSegment = function ($inputOrSegment) {
	    if (typeof $inputOrSegment === 'string') {
	        if ($inputOrSegment === 'hrs12')
	            return 'minutes';
	        if ($inputOrSegment === 'minutes')
	            return 'mode';
	        if ($inputOrSegment === 'mode')
	            return 'mode';
	    }
	    return exports.getRangeOf($inputOrSegment).nextSegment().segment;
	};
	exports.getRangeOf = function ($input) { return ({
	    rawSelection: function () {
	        if (!$input) {
	            return {
	                start: 0,
	                end: 0,
	                segment: 'hrs12',
	            };
	        }
	        var within = function (segment, value) {
	            return staticValues_1.ranges[segment].start <= value && value <= staticValues_1.ranges[segment].end;
	        };
	        var start = $input.selectionStart;
	        var end = $input.selectionEnd;
	        var segment = (within('mode', start) && 'mode') || (within('minutes', start) && 'minutes') || 'hrs12';
	        return {
	            start: start,
	            end: end,
	            segment: segment,
	        };
	    },
	    cursorSegment: function () {
	        var segment = exports.getRangeOf($input).rawSelection().segment;
	        return staticValues_1.ranges[segment];
	    },
	    nextSegment: function () { return traverseSegmentRanges($input, 'forward'); },
	    prevSegment: function () { return traverseSegmentRanges($input, 'backward'); },
	}); };
	exports.getAncestorsOf = function ($startingElem, selectorString) {
	    // https://stackoverflow.com/a/8729274/1611058
	    var $elem = $startingElem;
	    var ancestors = [];
	    var i = 0;
	    while ($elem) {
	        if (i !== 0) {
	            ancestors.push($elem);
	        }
	        if (selectorString) {
	            var matchesSelector = $elem.msMatchesSelector
	                ? $elem.msMatchesSelector(selectorString) // IE Hack
	                : $elem.matches(selectorString);
	            if (matchesSelector) {
	                return ancestors;
	            }
	        }
	        $elem = $elem === null || $elem === void 0 ? void 0 : $elem.parentElement;
	        i++;
	    }
	    return ancestors;
	};
	var elemText = function ($elem) { var _a; return ((_a = $elem === null || $elem === void 0 ? void 0 : $elem.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; };
	function aria_labelledby($input, document) {
	    if (document === void 0) { document = window.document; }
	    var ariaLabelByID = $input === null || $input === void 0 ? void 0 : $input.getAttribute('aria-labelledby');
	    if (ariaLabelByID) {
	        var $ariaLabelBy = document.getElementById(ariaLabelByID);
	        return elemText($ariaLabelBy);
	    }
	    return '';
	}
	function aria_label($input) {
	    var ariaLabel = $input.getAttribute('aria-label');
	    return ariaLabel || '';
	}
	function for_attribute($input, document) {
	    if (document === void 0) { document = window.document; }
	    var $forLabel = (document.querySelector('label[for="' + $input.id + '"]'));
	    return elemText($forLabel);
	}
	function label_wrapper_element($input) {
	    var ancestors = exports.getAncestorsOf($input, 'label');
	    var $parentLabel = ancestors[ancestors.length - 1];
	    if ($parentLabel.nodeName == 'LABEL')
	        return elemText($parentLabel);
	    return '';
	}
	function title_attribute($input) {
	    var titleLabel = $input.getAttribute('title');
	    return titleLabel || '';
	}
	}(get));

	(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getA11yElement = exports.getA11yValue = exports.a11yClear = exports.a11yUpdate = exports.a11yCreate = void 0;
	var staticTestValues_1 = staticTestValues;
	var get_1 = get;
	exports.a11yCreate = function (document) {
	    var _a;
	    if (document === void 0) { document = window.document; }
	    var $block = document.createElement('div');
	    $block.setAttribute('aria-live', 'polite');
	    $block.setAttribute('style', 'position: absolute; opacity: 0; height: 0; width: 0; overflow: hidden; pointer-events: none;');
	    $block.id = staticTestValues_1.a11yID;
	    (_a = document.querySelector('body')) === null || _a === void 0 ? void 0 : _a.appendChild($block);
	    return $block;
	};
	exports.a11yUpdate = function ($input, announcementArray, document) {
	    if (document === void 0) { document = window.document; }
	    if (!$input)
	        return '';
	    exports.a11yClear(document);
	    var cursorSegment = get_1.getCursorSegment($input);
	    var values = get_1.getInputValue($input).asTimeObject();
	    var value = values[cursorSegment];
	    var segmentValue = value === null ? 'blank' : value;
	    var segmentName = {
	        hrs12: 'Hours',
	        minutes: 'Minutes',
	        mode: 'AM/PM',
	    }[cursorSegment];
	    var announcements = {
	        initial: '$label grouping $fullValue.',
	        select: '$segmentName spin button $segmentValue.',
	        update: '$segmentValue.',
	    };
	    var textArray = announcementArray.map(function (key) { return announcements[key]; });
	    var fullValue = $input.value.replace(/--/g, 'blank');
	    var html = "<p>" + textArray.join('</p><p>') + "</p>";
	    var labelText = get_1.getLabelTextOf($input, document);
	    html = html.replace(/\$label/g, labelText);
	    html = html.replace(/\$segmentName/g, segmentName);
	    html = html.replace(/\$segmentValue/g, "" + segmentValue);
	    html = html.replace(/\$fullValue/g, fullValue);
	    var $a11y = document.getElementById(staticTestValues_1.a11yID);
	    if ($a11y) {
	        $a11y.innerHTML = html;
	    }
	    return html;
	};
	exports.a11yClear = function (document) {
	    if (document === void 0) { document = window.document; }
	    var $a11y = document.getElementById(staticTestValues_1.a11yID);
	    if ($a11y) {
	        $a11y.innerHTML = '';
	    }
	};
	exports.getA11yValue = function (document) {
	    if (document === void 0) { document = window.document; }
	    var $a11y = document.getElementById(staticTestValues_1.a11yID);
	    return ($a11y === null || $a11y === void 0 ? void 0 : $a11y.textContent) ? $a11y.textContent : '';
	};
	exports.getA11yElement = function (document) {
	    if (document === void 0) { document = window.document; }
	    return document.getElementById(staticTestValues_1.a11yID);
	};
	}(a11y));

	var ManualEntryLog$1 = {};

	var __spreadArrays = (commonjsGlobal && commonjsGlobal.__spreadArrays) || function () {
	    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	    for (var r = Array(s), k = 0, i = 0; i < il; i++)
	        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
	            r[k] = a[j];
	    return r;
	};
	Object.defineProperty(ManualEntryLog$1, "__esModule", { value: true });
	var ManualEntryLog_2 = ManualEntryLog$1.ManualEntryLog = void 0;
	var staticValues_1$1 = staticValues;
	var utils_1$1 = utils;
	var convertEntriesToNumber = function (entries) {
	    return parseInt(entries.join(''));
	};
	var SegmentLog = /** @class */ (function () {
	    function SegmentLog(_a) {
	        var startingValue = _a.startingValue, segment = _a.segment, onUpdate = _a.onUpdate, onLimitHit = _a.onLimitHit;
	        this.entries = [];
	        this.value = startingValue;
	        this.segment = segment;
	        this.update = function () { return onUpdate(); };
	        this.limitHit = function () { return onLimitHit(); };
	    }
	    /**
	     * Adds a value to the to the log and keeps track of what the end value should be
	     * @param keyName - Expected to be a keyboard key name like "1" or "a"
	     */
	    SegmentLog.prototype.add = function (keyName) {
	        var _this = this;
	        var number = parseInt(keyName);
	        var isZero = number === 0;
	        var isNumber = !isNaN(number);
	        // Handles AM/PM
	        if (this.segment === 'mode') {
	            if (keyName.toLowerCase() === 'a') {
	                this.value = 'AM';
	                this.entries = [keyName];
	            }
	            if (keyName.toLowerCase() === 'p') {
	                this.value = 'PM';
	                this.entries = [keyName];
	            }
	            // Handles Hours and Minutes
	        }
	        else if (isNumber) {
	            /*
	                12:30 AM >> type 1 (hrs) >> [1] >> 01:30 AM
	                12:30 AM >> type 1 > 2 (hrs) >> [1,2] >> 12:30 AM

	                12:30 AM >> type 2 (hrs) >> [2] >> 02:30 AM
	                12:30 AM >> type 2 > 1 (hrs) >> [1] >> 01:30 AM
	                12:30 AM >> type 2 > 1 > 2 (hrs) >> [1,2] >> 12:30 AM

	                12:30 AM >> type 0 (hrs) >> [1,2] >> 12:30 AM
	            */
	            var isGreaterThanMax = function (number) {
	                if (_this.segment !== 'mode') {
	                    return number > staticValues_1$1.maxAndMins[_this.segment].max;
	                }
	                return false;
	            };
	            var isFirst = this.entries.length === 0;
	            var isSecond = this.entries.length === 1;
	            var isThird = this.entries.length === 2;
	            var isSecondZero = isZero && isSecond && this.entries[0] === 0;
	            if (this.segment === 'hrs12') {
	                if ((isFirst || isThird) && isZero) {
	                    this.entries = [0];
	                    this.value = 12;
	                    this.update();
	                    return;
	                }
	                else if (isSecondZero) {
	                    this.entries = [0, 0];
	                    this.value = 12;
	                    this.limitHit();
	                    this.update();
	                    return;
	                }
	            }
	            else if (this.segment === 'minutes') {
	                if ((isFirst || isThird) && isZero) {
	                    this.entries = [0];
	                    this.value = 0;
	                    this.update();
	                    return;
	                }
	                else if (isSecondZero) {
	                    this.entries = [0, 0];
	                    this.value = 0;
	                    this.limitHit();
	                    this.update();
	                    return;
	                }
	            }
	            if (isZero && isSecond) {
	                var isHrsSegment = this.segment === 'hrs12';
	                var max = isHrsSegment ? 1 : 5;
	                if (this.entries[0] > max) {
	                    this.entries = [0];
	                    this.value = isHrsSegment ? 12 : 0;
	                }
	                else {
	                    this.entries.push(number);
	                    this.value = convertEntriesToNumber(this.entries);
	                    this.limitHit();
	                }
	                this.update();
	                return;
	            }
	            var newEntries = __spreadArrays(this.entries, [number]);
	            var newValue = convertEntriesToNumber(newEntries);
	            if (isGreaterThanMax(newValue)) {
	                this.value = number;
	                this.entries = [number];
	                if (isGreaterThanMax(number * 10)) {
	                    this.limitHit();
	                }
	            }
	            else {
	                this.value = newValue;
	                this.entries = newEntries;
	                if (newEntries.length === 2 || isGreaterThanMax(number * 10)) {
	                    this.limitHit();
	                }
	            }
	        }
	        this.update();
	    };
	    /**
	     * Reset is needed for things like typing "1", then leaving, then coming back.
	     *
	     * The tracker should reset if they are returning.
	     */
	    SegmentLog.prototype.reset = function () {
	        this.entries = [];
	    };
	    /**
	     * Deletes the current value. Use this if the user presses delete or backspace.
	     */
	    SegmentLog.prototype.clear = function () {
	        this.reset();
	        this.value = null;
	        this.update();
	    };
	    return SegmentLog;
	}());
	// Note: Due to this being a class, it does not need an interface
	/**
	 * Used for keeping track of Manual key strokes inside a time input
	 */
	var ManualEntryLog = /** @class */ (function () {
	    function ManualEntryLog(_a) {
	        var _this = this;
	        var timeObject = _a.timeObject, _b = _a.onUpdate, onUpdate = _b === void 0 ? function () { } : _b, _c = _a.onLimitHit, onLimitHit = _c === void 0 ? function () { } : _c;
	        var getFullValue12hr = function () {
	            return [
	                utils_1$1.toLeadingZero(_this.hrs12.value),
	                ':',
	                utils_1$1.toLeadingZero(_this.minutes.value),
	                ' ',
	                _this.mode.value || '--',
	            ].join('');
	        };
	        var update = function () {
	            _this.fullValue12hr = getFullValue12hr();
	            if (onUpdate) {
	                onUpdate(_this);
	            }
	        };
	        var limitHit = function () {
	            if (onLimitHit) {
	                onLimitHit(_this);
	            }
	        };
	        this.hrs12 = new SegmentLog({
	            startingValue: timeObject.hrs12,
	            segment: 'hrs12',
	            onUpdate: update,
	            onLimitHit: limitHit,
	        });
	        this.minutes = new SegmentLog({
	            startingValue: timeObject.minutes,
	            segment: 'minutes',
	            onUpdate: update,
	            onLimitHit: limitHit,
	        });
	        this.mode = new SegmentLog({
	            startingValue: timeObject.mode,
	            segment: 'mode',
	            onUpdate: update,
	            onLimitHit: limitHit,
	        });
	        this.fullValue12hr = getFullValue12hr();
	    }
	    /**
	     * Deletes all of the values for all of the segments.
	     */
	    ManualEntryLog.prototype.clearAll = function () {
	        this.hrs12.clear();
	        this.minutes.clear();
	        this.mode.clear();
	    };
	    return ManualEntryLog;
	}());
	ManualEntryLog_2 = ManualEntryLog$1.ManualEntryLog = ManualEntryLog;

	var modify = {};

	(function (exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.modifyTimeObject = exports.modifyString24hr = exports.modifyString12hr = void 0;
	var blankValues_1 = blankValues;
	var convert_1 = convert;
	var get_1 = get;
	var is_1 = is;
	var staticValues_1 = staticValues;
	exports.modifyString12hr = function (string12hr) {
	    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	    var modeToggle = function (preferredModeWhenNull) { return ({
	        isolated: function () {
	            return exports.modifyString12hr(string12hr).toggleMode(preferredModeWhenNull, false);
	        },
	        integrated: function () {
	            return exports.modifyString12hr(string12hr).toggleMode(preferredModeWhenNull, true);
	        },
	    }); };
	    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	    var cursorSegmentModifier = function (action) { return function ($input) {
	        var segment = get_1.getCursorSegment($input);
	        return exports.modifyString12hr(string12hr)[action][segment];
	    }; };
	    var modify = function (modification, skipValidation) {
	        var timeObject = convert_1.convertString12hr(string12hr).toTimeObject();
	        var modified = modification(timeObject);
	        return convert_1.convertTimeObject(modified, skipValidation).to12hr();
	    };
	    return {
	        increment: {
	            hrs12: {
	                isolated: function () {
	                    return modify(function (timeObject) { return exports.modifyTimeObject(timeObject).increment.hrs12.isolated(); });
	                },
	                integrated: function () {
	                    return modify(function (timeObject) {
	                        return exports.modifyTimeObject(timeObject).increment.hrs12.integrated();
	                    });
	                },
	            },
	            minutes: {
	                isolated: function () {
	                    return modify(function (timeObject) {
	                        return exports.modifyTimeObject(timeObject).increment.minutes.isolated();
	                    });
	                },
	                integrated: function () {
	                    return modify(function (timeObject) {
	                        return exports.modifyTimeObject(timeObject).increment.minutes.integrated();
	                    });
	                },
	            },
	            mode: modeToggle('AM'),
	            cursorSegment: cursorSegmentModifier('increment'),
	        },
	        decrement: {
	            hrs12: {
	                isolated: function () {
	                    return modify(function (timeObject) { return exports.modifyTimeObject(timeObject).decrement.hrs12.isolated(); });
	                },
	                integrated: function () {
	                    return modify(function (timeObject) {
	                        return exports.modifyTimeObject(timeObject).decrement.hrs12.integrated();
	                    });
	                },
	            },
	            minutes: {
	                isolated: function () {
	                    return modify(function (timeObject) {
	                        return exports.modifyTimeObject(timeObject).decrement.minutes.isolated();
	                    });
	                },
	                integrated: function () {
	                    return modify(function (timeObject) {
	                        return exports.modifyTimeObject(timeObject).decrement.minutes.integrated();
	                    });
	                },
	            },
	            mode: modeToggle('PM'),
	            cursorSegment: cursorSegmentModifier('decrement'),
	        },
	        toggleMode: function (preferredModeWhenNull, isIntegrated) {
	            return modify(function (timeObject) {
	                return exports.modifyTimeObject(timeObject).toggleMode(preferredModeWhenNull, isIntegrated);
	            }, true);
	        },
	        clear: {
	            hrs12: function () {
	                return modify(function (timeObject) { return exports.modifyTimeObject(timeObject).clear.hrs12(); });
	            },
	            minutes: function () {
	                return modify(function (timeObject) { return exports.modifyTimeObject(timeObject).clear.minutes(); });
	            },
	            mode: function () {
	                return modify(function (timeObject) { return exports.modifyTimeObject(timeObject).clear.mode(); });
	            },
	            all: function () { return modify(function (timeObject) { return exports.modifyTimeObject(timeObject).clear.all(); }); },
	        },
	    };
	};
	exports.modifyString24hr = function (string24hr) {
	    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	    var modeToggle = function (preferredModeWhenNull) { return ({
	        isolated: function () {
	            return exports.modifyString24hr(string24hr).toggleMode(preferredModeWhenNull, false);
	        },
	        integrated: function () {
	            return exports.modifyString24hr(string24hr).toggleMode(preferredModeWhenNull, true);
	        },
	    }); };
	    var modify = function (modification, skipValidation) {
	        var timeObject = convert_1.convertString24hr(string24hr).toTimeObject();
	        var modified = modification(timeObject);
	        return convert_1.convertTimeObject(modified, skipValidation).to24hr();
	    };
	    return {
	        increment: {
	            hrs24: {
	                isolated: function () {
	                    return modify(function (timeObject) { return exports.modifyTimeObject(timeObject).increment.hrs24.isolated(); });
	                },
	                integrated: function () {
	                    return modify(function (timeObject) {
	                        return exports.modifyTimeObject(timeObject).increment.hrs24.integrated();
	                    });
	                },
	            },
	            minutes: {
	                isolated: function () {
	                    return modify(function (timeObject) {
	                        return exports.modifyTimeObject(timeObject).increment.minutes.isolated();
	                    });
	                },
	                integrated: function () {
	                    return modify(function (timeObject) {
	                        return exports.modifyTimeObject(timeObject).increment.minutes.integrated();
	                    });
	                },
	            },
	            mode: modeToggle('AM'),
	        },
	        decrement: {
	            hrs24: {
	                isolated: function () {
	                    return modify(function (timeObject) { return exports.modifyTimeObject(timeObject).decrement.hrs24.isolated(); });
	                },
	                integrated: function () {
	                    return modify(function (timeObject) {
	                        return exports.modifyTimeObject(timeObject).decrement.hrs24.integrated();
	                    });
	                },
	            },
	            minutes: {
	                isolated: function () {
	                    return modify(function (timeObject) {
	                        return exports.modifyTimeObject(timeObject).decrement.minutes.isolated();
	                    });
	                },
	                integrated: function () {
	                    return modify(function (timeObject) {
	                        return exports.modifyTimeObject(timeObject).decrement.minutes.integrated();
	                    });
	                },
	            },
	            mode: modeToggle('PM'),
	        },
	        toggleMode: function (preferredModeWhenNull, isIntegrated) {
	            return modify(function (timeObject) {
	                return exports.modifyTimeObject(timeObject).toggleMode(preferredModeWhenNull, isIntegrated);
	            }, true);
	        },
	    };
	};
	exports.modifyTimeObject = function (timeObject) {
	    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	    var modeToggle = function (preferredModeWhenNull) { return ({
	        isolated: function () {
	            return exports.modifyTimeObject(timeObject).toggleMode(preferredModeWhenNull, false);
	        },
	        integrated: function () {
	            return exports.modifyTimeObject(timeObject).toggleMode(preferredModeWhenNull, true);
	        },
	    }); };
	    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	    var cursorSegmentModifier = function (action) { return function ($input) {
	        var segment = get_1.getCursorSegment($input);
	        return exports.modifyTimeObject(timeObject)[action][segment];
	    }; };
	    return {
	        increment: {
	            hrs12: {
	                isolated: function () { return nudgeIsolatedTimeObjectHrs('up', timeObject); },
	                integrated: function () { return nudgeIntegratedTimeObjectHrs('up', timeObject); },
	            },
	            // hrs24 is just an alias for hrs12 since the 24hr doesn't matter
	            hrs24: {
	                isolated: function () { return exports.modifyTimeObject(timeObject).increment.hrs12.isolated(); },
	                integrated: function () {
	                    return exports.modifyTimeObject(timeObject).increment.hrs12.integrated();
	                },
	            },
	            minutes: {
	                isolated: function () {
	                    var minutes = timeObject.minutes;
	                    var newMin = minutes === staticValues_1.maxAndMins.minutes.max
	                        ? staticValues_1.maxAndMins.minutes.min
	                        : nudgeMinutes(minutes, 'up');
	                    return __assign(__assign({}, timeObject), { minutes: newMin });
	                },
	                integrated: function () {
	                    var minutes = timeObject.minutes;
	                    if (minutes === staticValues_1.maxAndMins.minutes.max) {
	                        return nudgeIntegratedTimeObjectHrs('up', __assign(__assign({}, timeObject), { minutes: staticValues_1.maxAndMins.minutes.min }));
	                    }
	                    return __assign(__assign({}, timeObject), { minutes: nudgeMinutes(minutes, 'up') });
	                },
	            },
	            mode: modeToggle('AM'),
	            cursorSegment: cursorSegmentModifier('increment'),
	        },
	        decrement: {
	            hrs12: {
	                isolated: function () { return nudgeIsolatedTimeObjectHrs('down', timeObject); },
	                integrated: function () { return nudgeIntegratedTimeObjectHrs('down', timeObject); },
	            },
	            // hrs24 is just an alias for hrs12 since the 24hr doesn't matter
	            hrs24: {
	                isolated: function () { return exports.modifyTimeObject(timeObject).decrement.hrs12.isolated(); },
	                integrated: function () {
	                    return exports.modifyTimeObject(timeObject).decrement.hrs12.integrated();
	                },
	            },
	            minutes: {
	                isolated: function () {
	                    var minutes = timeObject.minutes;
	                    var newMin = minutes === staticValues_1.maxAndMins.minutes.min
	                        ? staticValues_1.maxAndMins.minutes.max
	                        : nudgeMinutes(minutes, 'down');
	                    return __assign(__assign({}, timeObject), { minutes: newMin });
	                },
	                integrated: function () {
	                    var minutes = timeObject.minutes;
	                    if (minutes === staticValues_1.maxAndMins.minutes.min) {
	                        return nudgeIntegratedTimeObjectHrs('down', __assign(__assign({}, timeObject), { minutes: staticValues_1.maxAndMins.minutes.max }));
	                    }
	                    return __assign(__assign({}, timeObject), { minutes: nudgeMinutes(minutes, 'down') });
	                },
	            },
	            mode: modeToggle('PM'),
	            cursorSegment: cursorSegmentModifier('decrement'),
	        },
	        toggleMode: function (preferredModeWhenNull, isIntegrated) {
	            var hrs12 = timeObject.hrs12, hrs24 = timeObject.hrs24, mode = timeObject.mode;
	            var returnVal = __assign({}, timeObject);
	            var isAM = is_1.isAmTimeObject(timeObject);
	            var get24HrHours = function (targetMode) {
	                var hrs24Calculation;
	                if (hrs12 === null) {
	                    hrs24Calculation = null;
	                }
	                else {
	                    var is12 = hrs12 === 12;
	                    var hours24hr = {
	                        am: is12 ? 0 : hrs12,
	                        pm: is12 ? 12 : hrs12 + 12,
	                    };
	                    hrs24Calculation = (targetMode === 'AM' ? hours24hr.am : hours24hr.pm);
	                }
	                return hrs24Calculation;
	            };
	            if (mode === null) {
	                if (isIntegrated && hrs24 !== null) {
	                    returnVal.mode = hrs24 > 11 ? 'PM' : 'AM';
	                    returnVal.hrs24 = hrs24;
	                }
	                else {
	                    returnVal.mode = preferredModeWhenNull;
	                    returnVal.hrs24 = get24HrHours(preferredModeWhenNull);
	                }
	            }
	            else {
	                returnVal.mode = isAM ? 'PM' : 'AM';
	                returnVal.hrs24 = get24HrHours(isAM ? 'PM' : 'AM');
	            }
	            if (hrs12 === null && mode === null) {
	                return returnVal;
	            }
	            return straightenTimeObject('hrs24', returnVal);
	        },
	        clear: {
	            hrs24: function () { return (__assign(__assign({}, timeObject), { hrs12: null, hrs24: null })); },
	            hrs12: function () { return (__assign(__assign({}, timeObject), { hrs12: null, hrs24: null })); },
	            minutes: function () { return (__assign(__assign({}, timeObject), { minutes: null })); },
	            mode: function () { return (__assign(__assign({}, timeObject), { mode: null, hrs24: null })); },
	            all: function () { return blankValues_1.blankValues.timeObject; },
	        },
	    };
	};
	var nudgeMinutes = function (minutes, direction) {
	    var modifier = direction === 'up' ? 1 : -1;
	    var newMinutes = direction === 'up' ? 0 : 59;
	    return (minutes === null ? newMinutes : minutes + modifier);
	};
	var nudgeIsolatedTimeObjectHrs = function (direction, timeObject) {
	    return nudgeTimeObjectHrs({
	        direction: direction,
	        timeObject: timeObject,
	        integration: 'isolated',
	        blankCallback: function (copiedObject) {
	            if (direction === 'up') {
	                if (copiedObject.mode === 'PM') {
	                    copiedObject.hrs24 = 13;
	                    copiedObject.hrs12 = 1;
	                }
	                else if (copiedObject.mode === 'AM') {
	                    copiedObject.hrs24 = 1;
	                    copiedObject.hrs12 = 1;
	                }
	                else {
	                    copiedObject.hrs12 = 1;
	                }
	            }
	            else {
	                if (copiedObject.mode === 'PM') {
	                    copiedObject.hrs24 = 12;
	                    copiedObject.hrs12 = 12;
	                }
	                else if (copiedObject.mode === 'AM') {
	                    copiedObject.hrs24 = 0;
	                    copiedObject.hrs12 = 12;
	                }
	                else {
	                    copiedObject.hrs12 = 12;
	                }
	            }
	            return copiedObject;
	        },
	    });
	};
	var nudgeIntegratedTimeObjectHrs = function (direction, timeObject) {
	    return nudgeTimeObjectHrs({
	        direction: direction,
	        timeObject: timeObject,
	        integration: 'integrated',
	        blankCallback: function (copiedObject) {
	            // If hours is blank, then it is better to increment in isolation
	            return nudgeIsolatedTimeObjectHrs(direction, copiedObject);
	        },
	    });
	};
	var nudgeTimeObjectHrs = function (_a) {
	    var direction = _a.direction, timeObject = _a.timeObject, integration = _a.integration, blankCallback = _a.blankCallback;
	    var hrsType = (integration === 'integrated' ? 'hrs24' : 'hrs12');
	    var hrs = timeObject[hrsType];
	    var copiedObject = __assign({}, timeObject);
	    var isUp = direction === 'up';
	    var limit = isUp ? staticValues_1.maxAndMins[hrsType].max : staticValues_1.maxAndMins[hrsType].min;
	    var opposingLimit = isUp ? staticValues_1.maxAndMins[hrsType].min : staticValues_1.maxAndMins[hrsType].max;
	    var modifier = isUp ? 1 : -1;
	    if (typeof hrs === 'number') {
	        if (hrs === limit) {
	            copiedObject[hrsType] = opposingLimit;
	        }
	        else {
	            copiedObject[hrsType] = (hrs + modifier);
	        }
	        return straightenTimeObject(hrsType, copiedObject);
	    }
	    else {
	        return blankCallback(straightenTimeObject(hrsType, copiedObject));
	    }
	};
	var straightenTimeObject = function (basedOn, invalidTimeObj) {
	    var hrs24 = invalidTimeObj.hrs24, hrs12 = invalidTimeObj.hrs12, minutes = invalidTimeObj.minutes;
	    var mode = straightenTimeObjectMode(basedOn, invalidTimeObj);
	    var isAM = mode === 'AM';
	    var use12hr = basedOn === 'hrs12';
	    var get12hrBasedOn24hr = function () {
	        var hr12 = (hrs24 !== null && hrs24 > 12 ? hrs24 - 12 : hrs24);
	        if (hr12 === 0) {
	            return 12;
	        }
	        return hr12;
	    };
	    var get24hrBasedOn12hr = function () {
	        var hr24 = mode === null
	            ? null
	            : (!isAM && hrs12 !== null && hrs12 !== 12 ? hrs12 + 12 : hrs12);
	        if (hr24 === null) {
	            return null;
	        }
	        if (hr24 === 24) {
	            return 0;
	        }
	        if (hr24 >= 12 && isAM) {
	            return (hr24 - 12);
	        }
	        return hr24;
	    };
	    var newTimeObject = {
	        hrs12: use12hr ? hrs12 : get12hrBasedOn24hr(),
	        hrs24: use12hr ? get24hrBasedOn12hr() : hrs24,
	        minutes: minutes,
	        mode: mode,
	    };
	    return newTimeObject;
	};
	var straightenTimeObjectMode = function (basedOn, invalidTimeObj) {
	    var hrs24 = invalidTimeObj.hrs24, mode = invalidTimeObj.mode;
	    if (mode === null) {
	        return null;
	    }
	    if (basedOn === 'hrs12') {
	        return mode === null ? 'AM' : mode;
	    }
	    if (basedOn === 'hrs24' && invalidTimeObj.hrs24 === null && mode !== null) {
	        return mode;
	    }
	    return hrs24 && hrs24 > 11 ? 'PM' : 'AM';
	};
	}(modify));

	var select = {};

	Object.defineProperty(select, "__esModule", { value: true });
	var selectCursorSegment = select.selectCursorSegment = select.selectPrevSegment = select.selectNextSegment = select.selectSegment = select.selectAll = void 0;
	var get_1 = get;
	var staticValues_1 = staticValues;
	var utils_1 = utils;
	select.selectAll = function (selector) {
	    var elements = document.querySelectorAll(selector);
	    return utils_1.toArray(elements);
	};
	select.selectSegment = function ($input, segment) {
	    if (segment === void 0) { segment = 'hrs12'; }
	    if (!$input)
	        return;
	    $input.setSelectionRange(staticValues_1.ranges[segment].start, staticValues_1.ranges[segment].end);
	};
	select.selectNextSegment = function ($input) {
	    if (!$input)
	        return;
	    var _a = get_1.getRangeOf($input).nextSegment(), start = _a.start, end = _a.end;
	    $input.setSelectionRange(start, end);
	};
	select.selectPrevSegment = function ($input) {
	    if (!$input)
	        return;
	    var _a = get_1.getRangeOf($input).prevSegment(), start = _a.start, end = _a.end;
	    $input.setSelectionRange(start, end);
	};
	selectCursorSegment = select.selectCursorSegment = function ($input) {
	    if (!$input)
	        return;
	    var _a = get_1.getRangeOf($input).cursorSegment(), start = _a.start, end = _a.end;
	    $input.setSelectionRange(start, end);
	};

	// This needs to be a JS file because Rollup can't handle TypeScript
	window.timeInputPolyfillUtils = {
	  a11yCreate: a11y.a11yCreate,
	  a11yUpdate: a11y.a11yUpdate,
	  a11yClear: a11y.a11yClear,
	  getA11yElement: a11y.getA11yElement,
	  getA11yValue: a11y.getA11yValue,
	  convertString12hr: convert.convertString12hr,
	  convertString24hr: convert.convertString24hr,
	  getNextSegment: get.getNextSegment,
	  getPrevSegment: get.getPrevSegment,
	  getCursorSegment: get.getCursorSegment,
	  isShiftHeldDown: is.isShiftHeldDown,
	  ManualEntryLog: ManualEntryLog_2,
	  modifyTimeObject: modify.modifyTimeObject,
	  regex: regex_1,
	  selectCursorSegment: selectCursorSegment,
	  matchesTimeObject: matchesTimeObject
	};

})();
