import React from 'react'
import supportsTime from 'time-input-polyfill/core/helpers/supportsTime'
import loadJS from 'time-input-polyfill/core/helpers/loadJS'

const debugMode = true
// const debugMode = false

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
				events.emit('polyfill_loaded', window.timePolyfillHelpers)
			},
		)
	}
})

export default class TimeInput extends React.Component {
	constructor(props) {
		super(props)
		this.$input = React.createRef()
		events.on('polyfill_loaded', polyfill => {
			this.polyfill = polyfill
		})
		this.state = {
			value24hr: props.value || '',
		}
	}

	componentDidMount() {}

	componentDidUpdate(prevProps) {}

	onTimeChange(event) {
		if (this.props.onChange) {
			this.props.onChange({
				value: this.state.value24hr,
				value12hr: this.state.value12hr,
				element: this.$input.current,
				event,
			})
		}
	}

	render() {
		const { value, ...props } = this.props
		return React.createElement(
			'input',
			{
				...props,
				onInput: () =>
					!hasPolyfill &&
					this.setState({ value24hr: this.$input.current.value }),
				ref: this.$input,
				type: hasPolyfill ? 'text' : 'time',
				value: hasPolyfill ? this.state.value12hr : this.state.value24hr,
			},
			null,
		)
	}
}
