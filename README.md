# TO DO

-   Fix blank set time button not clearing all values
-   Apply tests to Class component version
-   Fix class component version not working
-   convert the Cypress test suite into a separate package
-   Move the forced example version to the top and update the example code sample

# @time-input-polyfill/react

[![hits per month badge](https://data.jsdelivr.com/v1/package/npm/@time-input-polyfill/react/badge)](https://www.jsdelivr.com/package/npm/@time-input-polyfill/react)

This is a pre-built, plug-and-play, fully accessible React component that will produce an `<input type="time">` element with a built in polyfill for IE and Safari support.

-   ✔️ Modeled after the Chrome 78 and Firefox 70 desktop implementations.
-   ✔️ Fully keyboard and screen reader accessible.
-   ✔️ Sends back the same values as real time inputs (24 hour time).
-   ✔️ Only downloads the full polyfill code in the browsers that need it

You may have already come across the [plain JavaScript version](https://www.npmjs.com/package/time-input-polyfill). This is not just a wrapper component though. This package was built from the ground up in React, for React.

You can [view a demo](https://dan503.github.io/react-time-input-polyfill/) of the time input polyfill in action here: https://dan503.github.io/react-time-input-polyfill/

You can view a demo of the original plain javascript version here: https://dan503.github.io/time-input-polyfill/

## Install

The component needs an ES6 compatible environment to run in. It also needs React installed on the project. Take a look at [create-react-app](https://create-react-app.dev/docs/getting-started) to get started with React.

You can then install this polyfill component with npm:

```
npm i @time-input-polyfill/react
```

## Usage

```jsx
/* TimeInput.js */

import React from 'react'

// Import the component into your project
import TimeInputPolyfill from '@time-input-polyfill/react'

export const TimeInput = ({ label, value, setValue }) => {
	return (
		<label>
			<span>{label}</span>
			<TimeInputPolyfill
				// Set the value through props
				value={value}
				// Pass the state setter
				setValue={setValue}
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

export const ExampleForm = () => {
	// Use state to keep track of the value
	const [inputValue, setInputValue] = useState('20:30') // default to 8:30 PM

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
import TimeInputPolyfill from '@time-input-polyfill/react'

export const TimeInput = ({ label, currentValue, onInputChange }) => {
	return (
		<label>
			<span>{label}</span>
			<TimeInputPolyfill
				value={currentValue}
				/*  Force browsers that support input[type=time]
                    to use the polyfill.
                    (useful for testing and debugging)
                */ forcePolyfill={true}
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
<script src="https://cdn.jsdelivr.net/npm/@time-input-polyfill/react@1/dist/timePolyfillUtils.js"></script>
```

That downloads the extra helper functions that the polyfill needs to function.

Your CSP might not allow for this.

To work around the issue, first create a `timePolyfillUtils.js` file and ensure that whatever you are using to compile your JS also compiles this file as it's own separate thing. Don't import it into your main js file.

```js
// timePolyfillUtils.js

// ES5
require('@time-input-polyfill/react/dist/timePolyfillUtils.js')

// ES6
import '@time-input-polyfill/react/dist/timePolyfillUtils.js'
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

In v1 you updated the value using an `onChange` event. This was really clunky though.

```jsx
// v1 syntax

const [value, setValue] = useState()
// ...
<TimeInput value={value} onChange={({ value }) => setValue(value)} />
```

In v2, the syntax has been simplified down to this:

```jsx
// v2 syntax

const [value, setValue] = useState()
// ...
<TimeInput value={value} setValue={setValue} />
```
