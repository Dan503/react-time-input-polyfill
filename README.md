# react-time-input-polyfill (failed experiment)

This was my attempt at building a simple React component that produces an input[type=time] element with a built in Polyfill for Safari and IE support.

Like it's parent module ([time-input-polyfill](https://www.npmjs.com/package/time-input-polyfill)) it only downloads the polyfill code if the browser actually needs it.

You can view a demo of this react-time-input-polyfill project in action here: https://dan503.github.io/react-time-input-polyfill/

You can view a demo of the original plain javascript version of this polyfill here: https://dan503.github.io/time-input-polyfill/

## Install

The project needs an ES6 compatible environment to run in. It also needs React installed on the project. Take a look at [create-react-app](https://create-react-app.dev/docs/getting-started) To get started with React.

You can then install this polyfill component with npm:

```
npm i react-time-input-polyfill
```

## Usage

```js
import React from 'react'
import TimeInput from 'react-time-input-polyfill'

// logs: { value: '20:30', element: <input/>, event: [change event] }
const doStuff = (event)=> console.log(event)

export default ()=> (
	<label>
		<span>Label text</span>Label text
		<TimeInput value="20:30" onChange={doStuff}>
	</label>
)

```

Or using a for attribute

```js
import React from 'react'
import TimeInput from 'react-time-input-polyfill'

// logs: { value: '20:30', element: <input/>, event: [change event] }
const doStuff = (event)=> console.log(event)

export default ()=> (
	<>
		<label for="uniquID">Label text</label>
		<TimeInput value="20:30" id="uniquID" onChange={doStuff}>
	</>
)

```

## Why it is a failure

There are some minor flaws that make the component unacceptable to use in production:

1. In all browsers, using one of the set time buttons (a representation of setting the time using external props), then changing the time manually, then clicking the same set time button again does not apply the time like it is supposed to.
2. onChange doesn't work properly in IE.
3. onInput works in IE but it causes havoc on the polyfill functionality
4. onBlur is the closest thing I could get to having it working... except almost every time it blurs, it visually switches the time from PM to AM. I have no idea why.

I'm mainly posting this up as a sort of starting point to help others who might want to attempt to do this.
