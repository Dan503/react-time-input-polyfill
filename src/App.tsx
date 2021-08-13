import React, { Component, useState } from 'react'
import './App.css'
import TimeInput, { SetValue } from './core/TimeInputPolyFill'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const Input = ({
	value,
	setValue,
	onChange,
	className,
	usePolyfill = true,
	...restProps
}: {
	value: string
	setValue?: SetValue
	onChange?: (props: { value: string; element: HTMLInputElement }) => void
	className?: string
	usePolyfill?: boolean
	[key: string]: any
}) => {
	if (usePolyfill) {
		return (
			<TimeInput
				value={value}
				setValue={setValue}
				className={className}
				{...restProps}
			/>
		)
	}

	return (
		<input
			type="time"
			id="non-polyfill-time-input"
			value={value}
			onChange={(e) => setValue(e.target.value)}
			className={className}
		/>
	)
}

const ExampleBlock = ({
	label,
	extraInputProps,
	codeString,
	usePolyfill,
}: {
	label: string
	codeString: string
	usePolyfill?: boolean
	extraInputProps?: {
		[prop: string]: any
	}
}) => {
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
					usePolyfill={usePolyfill}
					value={value}
					setValue={setValue}
					className="exampleClass"
					id={label.replace(/\s/g, '-') + '-input'}
					{...extraInputProps}
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
					Set {label} time to " "
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

class TestClassInput extends Component<{
	value: string
	setValue: React.Dispatch<React.SetStateAction<string>>
}> {
	render() {
		const { value, setValue } = this.props
		return (
			<label style={{ display: 'inline-block' }}>
				<span style={{ marginRight: '0.5em' }}>
					Class based version
				</span>
				<TimeInput
					value={value}
					setValue={setValue}
					forcePolyfill
					id="class-based-component-example-input"
				/>
			</label>
		)
	}
}

class ClassBasedComponentExample extends Component {
	state = { value: '20:30' }
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
				<h2>Class based component example (forced polyfill)</h2>

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
					<button onClick={() => this.setValue('07:15')}>
						Set class based time to 7:15 AM
					</button>
					<button onClick={() => this.setValue('15:45')}>
						Set class based time to 3:45 PM
					</button>
				</p>

				<p>class based returned value: "{value}"</p>

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
	import TimeInputPolyfill from 'react-time-input-polyfill'

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
							forcePolyfill // Don't force in production
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
				codeString={`
	/* TimeInput.js */

	import React from 'react'

	// Import the component into your project
	import TimeInputPolyfill from 'react-time-input-polyfill'

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

			<ExampleBlock
				label="Forced polyfill"
				extraInputProps={{ forcePolyfill: true }}
				codeString={`
	/* TimeInput.js */

	import React from 'react'
	import TimeInputPolyfill from 'react-time-input-polyfill'

	export const TimeInput = ({ label, value, setValue }) => {
		return (
			<label>
				<span>{label}</span>
				<TimeInputPolyfill
					value={value}
					setValue={setValue}

					/*  Force browsers that support input[type=time]
						to use the polyfill.
						(useful for testing and debugging)
					*/  forcePolyfill={true}
				/>
			</label>
		)
	}
`}
			/>

			<ExampleBlock
				label="Non-polyfill"
				usePolyfill={false}
				codeString={`
	/* TimeInput.js */

	// View this example in Internet Explorer
	// This is a normal time input with no polyfill applied

	import React from 'react'

	export const TimeInput = ({ label, value, setValue }) => {
		return (
			<label>
				<span>{label}</span>
				<input
					type="time"
					value={value}
					onChange={(e) => {
						console.log(e) // the default browser event
						setValue(e.target.value)
					}
				/>
			</label>
		)
	}`}
			/>

			<ClassBasedComponentExample />

			{/* {addedLater && (
				<ExampleBlock
					label="Delayed forced polyfill"
					Input={({ value, setValue, className }) => (
						<TimeInput
							value={value}
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
