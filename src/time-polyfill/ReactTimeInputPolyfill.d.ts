import * as React from "react";

export interface TimeInputOnChangeParams {
  /** The current value in 24 hour time format (hh:mm) */
  value: string,
  /** The HTML <input> DOM element that the polyfill is affecting */
  element: HTMLInputElement,
}

export interface TimeInputProps {
  /** The current value in 24 hour time format (hh:mm) */
  value?: string;
  /** onChange will run every time the value is updated */
  onChange: (params: TimeInputOnChangeParams) => void
  /**
   * Force browsers that support input[type=time] to use the polyfill. (useful for testing and debugging)
   */
  forcePolyfill?: boolean = false,
  /**
   * Tell the polyfill where the timePolyfillHelpers.js file is stored.
   *
   * The way that the polyfill avoids downloading the full polyfill code
   * in modern browsers is by injecting the following script tag onto the page:
   *
   * ```html
   * <script src="https://cdn.jsdelivr.net/npm/react-time-input-polyfill@1/dist/timePolyfillHelpers.js"></script>
   * ```
   *
   * That downloads the extra helper functions that the polyfill needs to function.
   *
   * Your CSP (Content Security Policy) might not allow for this.
   *
   * To work around the issue, first create a timePolyfillHelpers.js file and ensure that whatever you are
   * using to compile your JS also compiles this file as it's own separate thing.
   * Don't import it into your main js file.
   *
   * ```js
   * // timePolyfillHelpers.js
   *
   * // ES5
   * require('react-time-input-polyfill/timePolyfillHelpers.js')
   *
   * // ES6
   * import 'react-time-input-polyfill/timePolyfillHelpers.js'
   * ```
   *
   * Then when using the component, add a polyfillSource prop that points to the compiled helpers file on your server.
   *
   * ```jsx
   * <TimeInput
   *     value={currentValue}
   *     onChange={({ value }) => setCurrentValue(value)}
   *     polyfillSource="/path/to/local/timePolyfillHelpers.js"
   * />
   * ```
   */
  polyfillSource?: string = 'https://cdn.jsdelivr.net/npm/react-time-input-polyfill@1/dist/timePolyfillHelpers.js'
};

export default class TimeInputPolyfill extends React.Component<TimeInputProps> {
  // Users don't really need this but I'll keep it around for now unless it gets annoying (was auto-generated)
  onPolyfillLoad(loadedPolyfill: any): any;
  update_a11y(announcementArray: any): any;
  set_time(time24hr: any): any;
  nudge_current_segment(direction: any): any;
  get_12hr_value(timeObj: any): any;
  set_segment(segment: any, value: any): any;
  traverse_segments(direction: any): any;
  clear_entry_log(): any;
  next_segment(): any;
  prev_segment(): any;
  clear_current_segment(): any;
  onTimeChange(): any;
  handleChange(e: any): any;
  handleMouseDown(e: any): any;
  handleClick(e: any): any;
  handleFocus(e: any): any;
  handleBlur(e: any): any;
  handleTab(e: any): any;
  handleKeyDown(e: any): any;
  enter_A_or_P(key: any): any;
  enter_number(key: any): any;
}
