import React from 'react'
import supportsTime from 'time-input-polyfill/core/helpers/supportsTime'
import loadJS from 'time-input-polyfill/core/helpers/loadJS'

const debugMode = true

const hasPolyfill = !supportsTime || debugMode

class EventBus {
	constructor() {
		this.calls = {}
	}
	on(string, callback) {
		this.calls[string] = callback
	}
	emit(string, ...props) {
		return this.calls[string](...props)
	}
}

const events = new EventBus()

document.addEventListener('DOMContentLoaded', function() {
	if (hasPolyfill) {
		loadJS(
			debugMode
				? './timePolyfillHelpers.js'
				: 'https://cdn.jsdelivr.net/npm/time-input-polyfill/dist/time-input-polyfill.min.js',
			function() {
				events.emit('polyfill_loaded', window.TimePolyfill)
			},
		)
	}
})

export default class TimeInput extends React.Component {
	constructor(props) {
		super(props)
		this.$input = React.createRef()
		events.on('polyfill_loaded', polyfill => {
			new polyfill(this.$input.current)
		})
		this.state = {
			value: props.value || '',
		}
	}

	componentDidMount() {
		if (this.props.value) this.$input.current.value = this.props.value
	}

	getInputValue() {
		const $input = this.$input.current
		return supportsTime ? $input.value : $input.dataset.value
	}

	onTimeChange(event) {
		if (this.props.onChange) {
			const value = this.getInputValue()
			this.props.onChange({
				value,
				element: this.$input.current,
				event,
			})

			this.setState({ value })
		}
	}

	componentDidUpdate(prevProps) {
		const propsHaveUpdated =
			prevProps.value !== this.props.value &&
			this.props.value !== this.state.value

		const $input = this.$input.current

		if (propsHaveUpdated) {
			$input.value = this.props.value
			setTimeout(() => this.onTimeChange('props update'), 0)
		}

		if (!supportsTime) {
			if ($input.dataset.value !== this.state.value) {
				this.setState({ value: $input.dataset.value })
			}

			this.$input.current.polyfill.update()
		}
	}

	render() {
		const { value, ...props } = this.props
		return React.createElement(
			'input',
			{
				...props,
				onBlur: e => {
					// The only way to get IE to fire the props onChange event without breaking the base polyfill functionality
					this.onTimeChange(e)
					if (this.props.onBlur) this.props.onBlur(e)
				},
				onChange: e => this.onTimeChange(e), // only works in non-ie browsers
				// onInput: e => this.onTimeChange(e), // Can't use this because it breaks the selection functionality
				ref: this.$input,
				type: hasPolyfill ? 'tel' : 'time',
				'data-state-value': this.state.value,
				'data-props-value': value,
			},
			null,
		)
	}
}
