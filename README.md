# @time-input-polyfill/react

This is a pre-built, plug-and-play, fully accessible React component that will produce an `<input type="time">` element with a built in polyfill for IE and Safari support.

-   ✔️ Modeled after the Chrome 78 and Firefox 70 desktop implementations.
-   ✔️ Fully keyboard and screen reader accessible.
-   ✔️ Sends back the same values as real time inputs (24 hour time).
-   ✔️ Only downloads the full polyfill code in the browsers that need it
-   ✔️ Quality assured with [Cypress](https://www.cypress.io/) tests

You may have already come across the [plain JavaScript version](https://www.npmjs.com/package/time-input-polyfill). This is not just a wrapper component though. This package was built from the ground up in React, for React.

You can [view a demo](https://dan503.github.io/react-time-input-polyfill/) of the time input polyfill in action here: https://dan503.github.io/react-time-input-polyfill/

You can view a demo of the original plain javascript version here: https://dan503.github.io/time-input-polyfill/

## Install

The component was built to work in [create-react-app](https://create-react-app.dev/docs/getting-started) projects. It should work ok in other React based frameworks though as well.

> **`react-scripts` v5 is currently not supported.**
>
> This is related to React upgrading to Webpack v5. [This linked issue](https://github.com/facebook/create-react-app/issues/11865) is blocking my ability to support `react-scripts` v5.

Install the polyfill component with npm:

```
npm i @time-input-polyfill/react
```

or install via Yarn:

```
yarn add @time-input-polyfill/react
```

## Usage

```jsx
/* TimeInput.js */

import React from 'react'

// Import the component into your project
import { TimeInputPolyfill } from '@time-input-polyfill/react'
// Note: default import is also supported

export function TimeInput({ label, value, setValue }) {
    return (
        <label>
            <span>{label}</span>
            <TimeInputPolyfill
                // Set the value through props
                value={value}
                // Pass in the state setter
                setValue={setValue}
            />
        </label>
    )
}
```

```jsx
/* ExampleForm.js */

import React, { useState, useEffect } from 'react'

// import your local time input component into your form component
import { TimeInput } from './TimeInput'

export function ExampleForm() {
    // Use state to keep track of the value
    const [inputValue, setInputValue] = useState('20:30') // default to 8:30 PM

    // Use useEffect to trigger functionality when the value changes
    useEffect(() => {
        console.log({ inputValue })
    }, [inputValue])

    return (
        <form>
            <TimeInput
                label="Label text"
                // Use the state value to set the time
                value={inputValue}
                // Pass the state setter function into the component
                setValue={setInputValue}
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
import { TimeInputPolyfill } from '@time-input-polyfill/react'

export function TimeInput({ label, value, setValue }) {
    return (
        <label>
            <span>{label}</span>
            <TimeInputPolyfill
                value={value}
                setValue={setValue}
                /* Force browsers that support input[type=time]
                   to use the polyfill.
                   (useful for testing and debugging) */
                forcePolyfill={true}
            />
        </label>
    )
}
```

## Content Security Policy (CSP) work around

The way that the polyfill avoids downloading the full polyfill code in modern browsers is by injecting the following script tag onto the page:

```html
<script src="https://cdn.jsdelivr.net/npm/@time-input-polyfill/utils@2.0.0-beta.0"></script>
```

That downloads the extra helper functions that the polyfill needs to function.

Your CSP might not allow for this.

To work around the issue, first create a `timePolyfillUtils.js` file and ensure that whatever you are using to compile your JS also compiles this file as it's own separate thing. Don't import it into your main js file.

```js
// timePolyfillUtils.js

// ES5
require('@time-input-polyfill/utils/dist/time-input-polyfill-utils.min.js')

// ES6
import '@time-input-polyfill/utils/dist/time-input-polyfill-utils.min.js'
```

Then when using the component, add a `polyfillSource` prop that points to the compiled helpers file on your server.

```jsx
<TimeInput
    value={currentValue}
    setValue={setCurrentValue}
    polyfillSource="/path/to/timePolyfillUtils.js"
/>
```

## Breaking changes in v2

### `onChange` replaced with `setValue`

In v1 you updated the value using an `onChange` event. This was really clunky though.

```jsx
// v1 syntax

const [value, setValue] = useState()

// ...

<TimeInput value={value} onChange={({ value }) => {
    doStuff(value)
    setValue(value)
}} />
```

In v2, the syntax has been simplified down to this:

```jsx
// v2 syntax

const [value, setValue] = useState()

useEffect(()=>{
    doStuff(value)
}, [value])

// ...

<TimeInput value={value} setValue={setValue} />
```

Note: It is still possible to use `onChange`, however this is just an extension of the native `<input type="time">` `onChange` event now. It is not compatible with v1 and it does not provide a consistent value between polyfilled and non-polyfilled browsers.

**Warning:** events like `onChange` and `onKeyUp` fire **before** the state in the polyfill has settled. This means that `event.target.currentValue` will **not** return the expected value in the polyfill version. It was out of scope to adjust the timing on every possible event to fire _after_ the state has settled.

### `polyfillSource` value has changed location

In version 1, you would import the polyfill utils from here:

`react-time-input-polyfill/dist/timePolyfillUtils.js`.

In version 2, you will need to import from here instead now:

`@time-input-polyfill/utils/dist/time-input-polyfill-utils.min.js`
