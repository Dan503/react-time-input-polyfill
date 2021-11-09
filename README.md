# {DEPRECATED} react-time-input-polyfill

## IMPORTANT! This package has been renamed

The new name for the polyfill is:

[@time-input-polyfill/react](https://www.npmjs.com/package/@time-input-polyfill/react)

You can install the new version using:

```
npm i @time-input-polyfill/react
```

Version 1 ("react-time-input-polyfill") is not supported anymore, please migrate to version 2.

### Migration details

There were breaking changes made in v2.0.0 for the sake of making the usage of the component more streamlined.

See the [v2 release notes](https://github.com/Dan503/react-time-input-polyfill/releases/tag/v2.0.0-major-overhaul) for more details.

## DEPRECATED documentation...

[![hits per month badge](https://data.jsdelivr.com/v1/package/npm/react-time-input-polyfill/badge)](https://www.jsdelivr.com/package/npm/react-time-input-polyfill)

This is a pre-built, plug-and-play, fully accessible React component that will produce an `<input type="time">` element with a built in polyfill for IE and Safari support.

- ✔️ Modeled after the Chrome 78 and Firefox 70 desktop implementations.
- ✔️ Fully keyboard and screen reader accessible.
- ✔️ Sends back the same values as real time inputs (24 hour time).
- ✔️ Only downloads the full polyfill code in the browsers that need it

You may have already come across the [plain JavaScript version](https://www.npmjs.com/package/time-input-polyfill). This is not just a wrapper component though. This package was built from the ground up in React, for React. It does import some functionality from the original though where it made sense to.

You can [view a demo](https://dan503.github.io/react-time-input-polyfill/) of `react-time-input-polyfill` in action here: https://dan503.github.io/react-time-input-polyfill/

You can view a demo of the original plain javascript version here: https://dan503.github.io/time-input-polyfill/

## Install

The component needs an ES6 compatible environment to run in. It also needs React installed on the project. Take a look at [create-react-app](https://create-react-app.dev/docs/getting-started) to get started with React.

You can then install this polyfill component with npm:

```
npm i react-time-input-polyfill
```

## Usage

```jsx
/* TimeInput.js */

import React from 'react'

// Import the component into your project
import TimeInputPolyfill from 'react-time-input-polyfill'

export const TimeInput = ({ label, currentValue, onInputChange }) => {
    return (
        <label>
            <span>{label}</span>
            <TimeInputPolyfill

                // set the value through props
                value={currentValue}

                // onChange will run every time the value is updated
                onChange={({ value, element }) => {
                    console.log({

                        // The current value in 24 hour time format
                        value,

                        // The <input> HTML element
                        element,

                    })

                    // Export the new value to the parent component
                    onInputChange(value)
                }}
            />
        </label>
    )
}
```

```jsx
/* ExampleForm.js */

import React, { useState } from 'react'

// import your local time input component into your form component
import { TimeInput } from './TimeInput'

export const ExampleForm = ()=> {

    // Use state to keep track of the value
    const [inputValue, setInputValue] = useState('20:30') // default to 8:30 PM

    return (
        <form>
            <TimeInput
                label="Label text"

                // Use the state value to set the time
                currentValue={inputValue}

                // Use the set state function to update the time when it changes
                onInputChange={ newValue => setInputValue(newValue) }
            />
            <button type="submit">Submit</button>
        </form>
    )
}
```

You can also force-enable the polyfill so that it is active in modern browsers that support `<input type="time">` natively. This is helpful when it comes to debugging since it gives you access to modern dev tools (just make sure to disable it again when you are done).

```jsx
/* TimeInput.js */

import React from 'react'
import TimeInputPolyfill from 'react-time-input-polyfill'

export const TimeInput = ({ label, currentValue, onInputChange }) => {
    return (
        <label>
            <span>{label}</span>
            <TimeInputPolyfill
                value={currentValue}

                /*  Force browsers that support input[type=time]
                    to use the polyfill.
                    (useful for testing and debugging)
                */  forcePolyfill={true}

                onChange={({ value, element }) => {
                    onInputChange(value)
                }}
            />
        </label>
    )
}
```

## Content Security Policy (CSP) work around

The way that the polyfill avoids downloading the full polyfill code in modern browsers is by injecting the following script tag onto the page:

```html
<script src="https://cdn.jsdelivr.net/npm/react-time-input-polyfill@1/dist/timePolyfillHelpers.js"></script>
```

That downloads the extra helper functions that the polyfill needs to function.

Your CSP might not allow for this.

To work around the issue, first create a `timePolyfillHelpers.js` file and ensure that whatever you are using to compile your JS also compiles this file as it's own separate thing. Don't import it into your main js file.

```js
// timePolyfillHelpers.js

// ES5
require('react-time-input-polyfill/timePolyfillHelpers.js')

// ES6
import 'react-time-input-polyfill/timePolyfillHelpers.js'
```

Then when using the component, add a `polyfillSource` prop that points to the compiled helpers file on your server.

```jsx
<TimeInput
    value={currentValue}
    onChange={({ value }) => setCurrentValue(value)}
    polyfillSource="/path/to/local/timePolyfillHelpers.js"
/>
```
