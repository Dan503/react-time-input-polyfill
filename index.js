import React from 'react'
import supportsTime from 'time-input-polyfill/core/helpers/supportsTime'
import loadJS from 'time-input-polyfill/core/helpers/loadJS'

const debugMode = true
// const debugMode = false

const hasPolyfill = !supportsTime || debugMode

let shiftKey = false

window.addEventListener('keyup', e => (shiftKey = e.shiftKey))
window.addEventListener('keydown', e => (shiftKey = e.shiftKey))

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
				: 'https://cdn.jsdelivr.net/npm/react-time-input-polyfill/dist/timePolyfillHelpers.js',
			function() {
				events.emit('polyfill_loaded', window.timePolyfillHelpers)
			},
		)
	}
})

const blank12hr = '--:-- --'

export default class TimeInput extends React.Component {
	constructor(props) {
		super(props)
		this.$input = React.createRef()
		this.focused_via_click = false
		events.on('polyfill_loaded', polyfill => {
			this.polyfill = polyfill
			console.log('polyfill', polyfill)

			this.setState({
				value12hr: props.value
					? polyfill.convert_to_12hr_time(props.value)
					: blank12hr,
			})
		})
		this.state = {
			value24hr: props.value || '',
			value12hr: blank12hr,
		}
	}

	componentDidMount() {}

	componentDidUpdate(prevProps, prevState) {
		const hasNewPropsValue = prevProps.value !== this.props.value
		const hasNewStateValue = prevState.value24hr !== this.state.value24hr

		if (!hasNewPropsValue && !hasNewStateValue) return null

		if (hasNewStateValue) {
			this.onTimeChange()
		} else if (hasNewPropsValue) {
			this.setState({
				value24hr: this.props.value,
				value12hr: this.convert_to_12hr(this.props.value),
			})
		}
	}

	convert_to_12hr(time24hr) {
		return hasPolyfill
			? this.polyfill.convert_to_12hr_time(time24hr)
			: blank12hr
	}

	onTimeChange() {
		if (this.props.onChange) {
			this.props.onChange({
				value: this.state.value24hr,
				value12hr: this.state.value12hr,
				element: this.$input.current,
			})
		}
	}

	handleChange(e) {
		if (hasPolyfill) return null
		this.setState({ value24hr: e.target.value })
	}

	handleMouseDown(e) {
		this.props.onMouseDown && this.props.onMouseDown(e)
		this.focused_via_click = true
	}

	handleClick(e) {
		this.props.onClick && this.props.onClick(e)
		if (!hasPolyfill) return null
		this.polyfill.select_cursor_segment(this.$input.current)
	}

	handleFocus(e) {
		this.props.onFocus && this.props.onFocus(e)
		if (!hasPolyfill) return null
		if (!this.focused_via_click) {
			const segment = shiftKey ? 'mode' : 'hrs'
			this.polyfill.select_segment(this.$input.current, segment)
		}
	}

	handleBlur(e) {
		this.props.onBlur && this.props.onBlur(e)
		this.focused_via_click = false
	}

	render() {
		const { value, ...props } = this.props
		return React.createElement(
			'input',
			{
				...props,
				onChange: e => this.handleChange(e),
				onFocus: e => this.handleFocus(e),
				onBlur: e => this.handleBlur(e),
				onMouseDown: e => this.handleMouseDown(e),
				onClick: e => this.handleClick(e),
				ref: this.$input,
				type: hasPolyfill ? 'text' : 'time',
				value: hasPolyfill ? this.state.value12hr : this.state.value24hr,
			},
			null,
		)
	}
}
