import React, { useState } from 'react'
import './App.css'
import TimeInput from '../time-polyfill/ReactTimeInputPolyfill'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'

// const debugMode = true
const debugMode = false

const ExampleBlock = ({ label, Input, codeString }) => {
	const [value, setValue] = useState('20:30')

	return (
		<form
			style={{ marginBottom: '2em' }}
			onSubmit={(e) => e.preventDefault()}
		>
			<h2>{label} time input</h2>

			<label style={{ display: 'inline-block' }}>
				<span style={{ marginRight: '0.5em' }}>{label} time input</span>
				<Input
					currentValue={value}
					setValue={setValue}
					className="exampleClass"
				/>
			</label>

			<p>
				<button onClick={() => setValue('07:15')}>
					Set {label} time to 7:15 AM
				</button>
				<button onClick={() => setValue('15:45')}>
					Set {label} time to 3:45 PM
				</button>
				<button onClick={() => setValue('')}>
					Set {label} time to ""
				</button>
			</p>

			<p>
				{label} returned value: "{value}"
			</p>

			{!!codeString && (
				<SyntaxHighlighter
					style={dark}
					className="code"
					language="javascript"
					showLineNumbers={true}
				>
					{codeString.replace(/^\n/, '')}
				</SyntaxHighlighter>
			)}
		</form>
	)
}

function App() {
	// let [addedLater, setAddedLater] = useState(false)
	// setTimeout(() => setAddedLater(true), 2000)

	return (
		<div className="App">
			<h1>React Time Input Polyfill</h1>

			<p>Code examples are simplified guides, not exact code replicas.</p>

			<SyntaxHighlighter
				style={dark}
				className="code centered"
				language="text"
				showLineNumbers={false}
			>
				npm install react-time-input-polyfill
			</SyntaxHighlighter>

			<p>
				<a href="https://github.com/Dan503/react-time-input-polyfill#react-time-input-polyfill">
					Visit me on GitHub
				</a>
			</p>

			<ExampleBlock
				label="Non-forced polyfill"
				Input={({ currentValue, setValue, className }) => (
					<TimeInput
						value={currentValue}
						onChange={({ value }) => setValue(value)}
						className={className}
						polyfillSource={debugMode && './timePolyfillHelpers.js'}
					/>
				)}
				codeString={`
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

///////////////////////////////////////////////////

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
`}
			/>

			<ExampleBlock
				label="Forced polyfill"
				Input={({ currentValue, setValue, className }) => (
					<TimeInput
						value={currentValue}
						onChange={({ value }) => setValue(value)}
						forcePolyfill={true}
						polyfillSource={debugMode && './timePolyfillHelpers.js'}
					/>
				)}
				codeString={`
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
`}
			/>

			<ExampleBlock
				label="Non-polyfill"
				Input={({ currentValue, setValue, className }) => (
					<input
						type="time"
						value={currentValue}
						onChange={(e) => setValue(e.target.value)}
						className={className}
					/>
				)}
				codeString={`
/* TimeInput.js */

// View this example in Internet Explorer
// This is a normal time input with no polyfill applied

import React from 'react'

export const TimeInput = ({ label, currentValue, onInputChange }) => {
	return (
		<label>
			<span>{label}</span>
			<input
				type="time"
				value={currentValue}
				onChange={(e) => {
					console.log(e) // the default browser event
					onInputChange(e.target.value)
				}}
			/>
		</label>
	)
}`}
			/>

			{/* {addedLater && (
				<ExampleBlock
					label="Delayed forced polyfill"
					Input={({ currentValue, setValue, className }) => (
						<TimeInput
							value={currentValue}
							onChange={({ value }) => setValue(value)}
							forcePolyfill={true}
							className={className}
						/>
					)}
				/>
			)} */}
		</div>
	)
}

export default App
