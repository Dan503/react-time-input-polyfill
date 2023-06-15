// These polyfills are only necessary for the sake of IE11 being able to render the syntax highlighter
import 'core-js/features/symbol'
import 'core-js/features/promise'
import 'core-js/features/object/assign'
import 'core-js/features/array/includes'
import 'core-js/features/array/find'
import 'core-js/features/array/find-index'

import React, { Component, useState } from 'react'
import './App.css'
import {
	TimeInputPolyfill,
	TimeInputPolyfillProps,
} from './core/TimeInputPolyfill'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import pkg from '../package.json'
import { getIDsAndLabels } from '@time-input-polyfill/tests/dist/mjs/src/core/IDs-and-labels'
import { staticValues } from '@time-input-polyfill/tests/dist/mjs/src/core/static-values'

import { EventName, AltEventName, IDsAndLabels } from './App-tests-shared-stuff'

const version = pkg.version

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
	const { IDs } = getIDsAndLabels({ primaryTestsLabel: label })

	return (
		<form style={{ marginBottom: '2em' }} onSubmit={(e) => e.preventDefault()}>
			<h2>{label}</h2>

			<span style={{ display: 'inline-block' }}>
				<label htmlFor={IDs.primaryInputID} style={{ marginRight: '0.5em' }}>
					{label}
				</label>
				<TimeInputPolyfill
					value={value}
					setValue={setValue}
					className="exampleClass"
					id={IDs.primaryInputID}
					forcePolyfill={forcePolyfill}
					{...restProps}
				/>
				<button
					onClick={() => setForcePolyfill(!forcePolyfill)}
					style={{ marginLeft: 10 }}
					id={IDs.buttonIDs.togglePolyfillID}
					title="Toggle polyfill"
				>
					Polyfill is <strong>{forcePolyfill ? 'ON' : 'OFF'}</strong>
				</button>
			</span>

			<p>
				<button onClick={() => setValue('07:15')} id={IDs.buttonIDs.amID}>
					Set {label.toLocaleLowerCase()} time to 7:15 AM
				</button>
				<button onClick={() => setValue('15:45')} id={IDs.buttonIDs.pmID}>
					Set {label.toLocaleLowerCase()} time to 3:45 PM
				</button>
				<button onClick={() => setValue('')} id={IDs.buttonIDs.blankID}>
					Set {label.toLocaleLowerCase()} time to " "
				</button>
			</p>

			<p>
				{label} returned value: "<span id={IDs.primaryValueID}>{value}</span>"
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

class ClassBasedComponentExample extends Component {
	state = {
		value: staticValues.defaultValue.cpuValue,
		eventsValue: staticValues.defaultValue.cpuValue,
		eventsReturnValue: staticValues.defaultValue.inputValue,
		eventMainName: 'none',
		eventAltName: 'none',
		forcePolyfill: true,
	}
	exampleId = 'class-based-component-example'
	render() {
		const { value, forcePolyfill } = this.state
		const {
			eventsInputID,
			eventsAltNameID,
			eventsMainNameID,
			eventsValueID,
			primaryValueID,
			primaryInputID,
			buttonIDs,
		} = IDsAndLabels.classBased.IDs
		const { eventTestsLabel, primaryTestsLabel } =
			IDsAndLabels.classBased.labels
		return (
			<form
				style={{ marginBottom: '2em' }}
				onSubmit={(e) => e.preventDefault()}
			>
				<h2>Class based component example</h2>

				<p>
					The time input polyfill has been optimized to work best with React
					Hooks but you can still use it in a class based component.
				</p>

				<span style={{ display: 'inline-block' }}>
					<label style={{ marginRight: '0.5em' }} htmlFor={primaryInputID}>
						{primaryTestsLabel}
					</label>
					<TimeInputPolyfill
						value={value}
						setValue={(newValue) => this.setState({ value: newValue })}
						forcePolyfill={forcePolyfill}
						id={primaryInputID}
					/>
					<button
						onClick={() => this.setState({ forcePolyfill: !forcePolyfill })}
						style={{ marginLeft: 10 }}
						title="Toggle polyfill"
						id={buttonIDs.togglePolyfillID}
					>
						Polyfill is <strong>{forcePolyfill ? 'ON' : 'OFF'}</strong>
					</button>
				</span>

				<p>
					<button
						onClick={() => {
							this.setState({ value: '07:15' })
						}}
						id={buttonIDs.amID}
					>
						Set class based time to 7:15 AM
					</button>
					<button
						onClick={() => this.setState({ value: '15:45' })}
						id={buttonIDs.pmID}
					>
						Set class based time to 3:45 PM
					</button>
					<button
						onClick={() => this.setState({ value: '' })}
						id={buttonIDs.blankID}
					>
						Set class based time to " "
					</button>
				</p>

				<p>
					class based returned value: "<span id={primaryValueID}>{value}</span>"
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
				{process.env.NODE_ENV === 'development' && (
					<>
						<h2>{eventTestsLabel}</h2>

						<div>
							<label htmlFor={eventsInputID}>{eventTestsLabel}</label>
							<br />
							<TimeInputPolyfill
								id={eventsInputID}
								value={this.state.eventsValue}
								setValue={(newValue) => {
									this.setState({ eventsValue: newValue })
								}}
								forcePolyfill
								onChange={(e) => {
									this.setState({
										eventsReturnValue: e.currentTarget.value,
										eventAltName: 'change',
									})
								}}
								onFocus={(e) => {
									this.setState({
										eventsReturnValue: e.currentTarget.value,
										eventMainName: 'focus',
									})
								}}
								onBlur={(e) => {
									this.setState({
										eventsReturnValue: e.currentTarget.value,
										eventMainName: 'blur',
									})
								}}
								onMouseDown={(e) => {
									this.setState({
										eventsReturnValue: e.currentTarget.value,
										eventMainName: 'mouseDown',
									})
								}}
								onMouseUp={(e) => {
									this.setState({
										eventsReturnValue: e.currentTarget.value,
										eventMainName: 'mouseUp',
									})
								}}
								onClick={(e) => {
									this.setState({
										eventsReturnValue: e.currentTarget.value,
										eventAltName: 'click',
									})
								}}
								onKeyDown={(e) => {
									this.setState({
										eventsReturnValue: e.currentTarget.value,
										eventMainName: 'keyDown',
									})
								}}
								onKeyUp={(e) => {
									this.setState({
										eventsReturnValue: e.currentTarget.value,
										eventMainName: 'keyUp',
									})
								}}
							/>
							<p id={eventsValueID}>{this.state.eventsReturnValue}</p>
							<p id={eventsMainNameID}>{this.state.eventMainName}</p>
							<p id={eventsAltNameID}>{this.state.eventAltName}</p>
						</div>
					</>
				)}
			</form>
		)
	}
}

function App() {
	// let [addedLater, setAddedLater] = useState(false)
	// setTimeout(() => setAddedLater(true), 2000)
	const [testValue, setTestValue] = useState(
		staticValues.defaultValue.inputValue,
	)
	const [eventMainName, setEventName] = useState<EventName>('none')
	const [eventAltName, setAltEventName] = useState<AltEventName>('none')

	const { eventTestsLabel } = IDsAndLabels.functionBased.labels
	const { eventsValueID, eventsAltNameID, eventsMainNameID } =
		IDsAndLabels.functionBased.IDs

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
						label={eventTestsLabel}
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
					<p id={eventsValueID}>{testValue}</p>
					<p id={eventsMainNameID}>{eventMainName}</p>
					<p id={eventsAltNameID}>{eventAltName}</p>
				</>
			)}
		</div>
	)
}

export default App
