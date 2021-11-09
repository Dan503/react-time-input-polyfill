import React, { Component, useState } from 'react'
import './App.css'
import {
	TimeInputPolyfill,
	TimeInputPolyfillProps,
} from './core/TimeInputPolyfill'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { version } from '../package.json'

import { EventName, AltEventName } from './App-tests-shared-stuff'

interface ExampleBlockProps
	extends Omit<TimeInputPolyfillProps, 'value' | 'setValue'> {
	label: string
	codeString?: string
}

const ExampleBlock = ({
	label,
	codeString,
	...restProps
}: ExampleBlockProps) => {
	const [value, setValue] = useState('20:30')
	const [forcePolyfill, setForcePolyfill] = useState(true)
	const exampleId = label.replace(/[^A-z]+/g, '-').replace(/-+$/g, '')

	return (
		<form
			style={{ marginBottom: '2em' }}
			onSubmit={(e) => e.preventDefault()}
		>
			<h2>{label}</h2>

			<span style={{ display: 'inline-block' }}>
				<label
					htmlFor={exampleId + '-input'}
					style={{ marginRight: '0.5em' }}
				>
					{label}
				</label>
				<TimeInputPolyfill
					value={value}
					setValue={setValue}
					className="exampleClass"
					id={exampleId + '-input'}
					forcePolyfill={forcePolyfill}
					{...restProps}
				/>
				<button
					onClick={() => setForcePolyfill(!forcePolyfill)}
					style={{ marginLeft: 10 }}
					id={exampleId + '-toggle-polyfill'}
					title="Toggle polyfill"
				>
					Polyfill is <strong>{forcePolyfill ? 'ON' : 'OFF'}</strong>
				</button>
			</span>

			<p>
				<button
					onClick={() => setValue('07:15')}
					id={exampleId + '-button-1'}
				>
					Set {label.toLocaleLowerCase()} time to 7:15 AM
				</button>
				<button
					onClick={() => setValue('15:45')}
					id={exampleId + '-button-2'}
				>
					Set {label.toLocaleLowerCase()} time to 3:45 PM
				</button>
				<button
					onClick={() => setValue('')}
					id={exampleId + '-button-3'}
				>
					Set {label.toLocaleLowerCase()} time to " "
				</button>
			</p>

			<p>
				{label} returned value: "
				<span id={exampleId + '-return-value'}>{value}</span>"
			</p>

			{Boolean(codeString) && (
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

class TestClassInput extends Component<{
	value: string
	setValue: React.Dispatch<React.SetStateAction<string>>
}> {
	state = { forcePolyfill: true }
	render() {
		const { value, setValue } = this.props
		const { forcePolyfill } = this.state
		const identifier = 'class-based-component-example'
		return (
			<span style={{ display: 'inline-block' }}>
				<label
					style={{ marginRight: '0.5em' }}
					htmlFor={`${identifier}-input`}
				>
					Class based version
				</label>
				<TimeInputPolyFill
					value={value}
					setValue={setValue}
					forcePolyfill={forcePolyfill}
					id={`${identifier}-input`}
				/>
				<button
					onClick={() =>
						this.setState({ forcePolyfill: !forcePolyfill })
					}
					style={{ marginLeft: 10 }}
					title="Toggle polyfill"
					id={`${identifier}-toggle-polyfill`}
				>
					Polyfill is <strong>{forcePolyfill ? 'ON' : 'OFF'}</strong>
				</button>
			</span>
		)
	}
}

class ClassBasedComponentExample extends Component {
	state = { value: '20:30' }
	exampleId = 'class-based-component-example'
	setValue(newValue) {
		this.setState({ value: newValue })
	}
	render() {
		const { value } = this.state
		return (
			<form
				style={{ marginBottom: '2em' }}
				onSubmit={(e) => e.preventDefault()}
			>
				<h2>Class based component example</h2>

				<p>
					The time input polyfill has been optimized to work best with
					React Hooks but you can still use it in a class based
					component.
				</p>

				<TestClassInput
					value={this.state.value}
					setValue={(newValue) => this.setState({ value: newValue })}
				/>

				<p>
					<button
						onClick={() => this.setValue('07:15')}
						id={this.exampleId + '-button-1'}
					>
						Set class based time to 7:15 AM
					</button>
					<button
						onClick={() => this.setValue('15:45')}
						id={this.exampleId + '-button-2'}
					>
						Set class based time to 3:45 PM
					</button>
					<button
						onClick={() => this.setValue('')}
						id={this.exampleId + '-button-3'}
					>
						Set class based time to " "
					</button>
				</p>

				<p id="class-based-component-return-value">
					class based returned value: "{value}"
				</p>

				<SyntaxHighlighter
					style={dark}
					className="code"
					language="javascript"
					showLineNumbers={true}
				>
					{`
	/* TimeInput.js */

	import React, { Component } from 'react'

	// Import the component into your project
	import TimeInputPolyfill from '@time-input-polyfill/react'

	export class TimeInput extends Component {
		render() {
			const { value, setValue, label } = this.props
			return (
					<label>
						<span>
							{label}
						</span>
						<TimeInputPolyfill
							value={value}
							setValue={setValue}
						/>
					</label>
			)
		}
	}

	///////////////////////////////////////////////////

	/* ExampleForm.js */

	import React, { Component } from 'react'

	// import your local time input component into your form component
	import { TimeInput } from './TimeInput'

	export class ExampleForm extends Component {
		state = { inputValue: '20:30' }
		render() {
			return (
				<form>
					<TimeInput
						label="Label text"

						// Use the state value to set the time
						value={this.state.inputValue}

						// Pass a state setter function into the component
						setValue={(newValue) => this.setState({inputValue: newValue})}
					/>
					<button type="submit">Submit</button>
				</form>
			)
		}
	}
`.replace(/^\n/, '')}
				</SyntaxHighlighter>
			</form>
		)
	}
}

function App() {
	// let [addedLater, setAddedLater] = useState(false)
	// setTimeout(() => setAddedLater(true), 2000)
	const [testValue, setTestValue] = useState('default')
	const [eventName, setEventName] = useState<EventName>('none')
	const [altEventName, setAltEventName] = useState<AltEventName>('none')

	return (
		<div className="App">
			<h1>React Time Input Polyfill</h1>
			<p>
				<i>v{version}</i>
			</p>

			<p>Code examples are simplified guides, not exact code replicas.</p>

			<SyntaxHighlighter
				style={dark}
				className="code centered"
				language="text"
				showLineNumbers={false}
			>
				npm install @time-input-polyfill/react
			</SyntaxHighlighter>

			<p>
				<a href="https://github.com/Dan503/react-time-input-polyfill#react-time-input-polyfill">
					Visit me on GitHub
				</a>
			</p>

			<ExampleBlock
				label="Polyfill demo"
				codeString={`
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

					/*  Force browsers that support input[type=time]
						to use the polyfill.
						(useful for testing and debugging)
					*/  forcePolyfill={true}
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

		// Make use of useEffect to react to inputValue changes
		useEffect(() => {
			console.log({ inputValue })
		}, [ inputValue ])

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
`}
			/>

			<ClassBasedComponentExample />

			{process.env.NODE_ENV === 'development' && (
				<>
					<ExampleBlock
						label="Events test (localhost only)"
						onChange={(e) => {
							setTestValue(e.currentTarget.value)
							setAltEventName('change')
						}}
						onFocus={(e) => {
							setTestValue(e.currentTarget.value)
							setEventName('focus')
						}}
						onBlur={(e) => {
							setTestValue(e.currentTarget.value)
							setEventName('blur')
						}}
						onMouseDown={(e) => {
							setTestValue(e.currentTarget.value)
							setEventName('mouseDown')
						}}
						onMouseUp={(e) => {
							setTestValue(e.currentTarget.value)
							setEventName('mouseUp')
						}}
						onClick={(e) => {
							setTestValue(e.currentTarget.value)
							setAltEventName('click')
						}}
						onKeyDown={(e) => {
							setTestValue(e.currentTarget.value)
							setEventName('keyDown')
						}}
						onKeyUp={(e) => {
							setTestValue(e.currentTarget.value)
							setEventName('keyUp')
						}}
					/>
					<p id="events-test-value">{testValue}</p>
					<p id="events-test-eventName">{eventName}</p>
					<p id="events-test-altEventName">{altEventName}</p>
				</>
			)}
		</div>
	)
}

export default App
