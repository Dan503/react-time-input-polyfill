import React from 'react'
import supportsTime from 'time-input-polyfill/core/helpers/supportsTime'
import loadJS from 'time-input-polyfill/core/helpers/loadJS'

const debugMode = true
// const debugMode = false

const hasPolyfill = !supportsTime || debugMode

let shiftKey = false

const leading_zero = number => {
	if (isNaN(number)) return number
	const purified = parseInt(number)
	return purified < 10 ? '0' + purified : number
}

window.addEventListener('keyup', e => (shiftKey = e.shiftKey))
window.addEventListener('keydown', e => (shiftKey = e.shiftKey))

// IE doesn't support event.key properly
const keyName = e =>
	({
		8: 'Backspace',
		9: 'Tab',
		37: 'ArrowLeft',
		38: 'ArrowUp',
		39: 'ArrowRight',
		40: 'ArrowDown',
	}[e.which])

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
let accessibility_block_created = false
let $a11y

export default class TimeInput extends React.Component {
	constructor(props) {
		super(props)
		this.$input = React.createRef()
		this.focused_via_click = false
		events.on('polyfill_loaded', polyfill => {
			this.polyfill = polyfill

			this.setState({
				value12hr: props.value
					? polyfill.convert_to_12hr_time(props.value)
					: blank12hr,
			})

			if (!accessibility_block_created) {
				$a11y = polyfill.create_a11y_block()
				accessibility_block_created = true
			}

			events.emit('polyfill_ready', polyfill)
		})
		this.state = {
			value24hr: props.value || '',
			value12hr: blank12hr,
			currentSegment: null,
		}
	}

	componentDidMount() {
		if (!hasPolyfill) return null

		events.on('polyfill_ready', () => {
			const $input = this.$input.current
			$input.polyfill = {
				label: this.polyfill.get_label($input),
				$a11y,
			}
		})
	}

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

	nudge_current_segment(direction) {
		const segment = this.polyfill.get_current_segment(this.$input.current)

		const current_values = this.get_current_values(this.$input.current)
		let time = {}

		const modifier = direction === 'up' ? 1 : -1

		if (current_values[segment] === '--') {
			var current_time = () => new Date()
			time = {
				hrs: () =>
					this.polyfill.convert_hours_to_12hr_time(current_time().getHours()),
				min: () => current_time().getMinutes(),
				mode: () => current_time().getHours() > 11,
			}
		} else {
			var minutes = {
				up: current_values.min < 59 ? current_values.min + modifier : 0,
				down: current_values.min === 0 ? 59 : current_values.min + modifier,
			}
			time = {
				hrs: () =>
					this.polyfill.convert_hours_to_12hr_time(
						current_values.hrs + modifier,
					),
				min: () => minutes[direction],
				mode: () => (current_values.mode === 'AM' ? 'PM' : 'AM'),
			}
		}
		this.set_segment(segment, time[segment]())
	}

	set_segment(segment, value) {
		const values = this.get_current_values()
		values[segment] = value
		const value12hr = [
			leading_zero(values.hrs),
			':',
			leading_zero(values.min),
			' ',
			values.mode,
		].join('')
		const value24hr = this.polyfill.convert_to_24hr_time(value12hr)
		this.setState({ value12hr, value24hr, currentSegment: segment })
	}

	traverse_segments(direction) {
		const { segments } = this.polyfill
		const modifier = direction == 'left' ? -1 : 1
		const newIndex = segments.indexOf(this.state.currentSegment) + modifier
		const finalIndex = newIndex <= 0 ? 0 : newIndex >= 2 ? 2 : newIndex
		this.setState({ currentSegment: segments[finalIndex] })
	}

	next_segment() {
		this.traverse_segments('right')
	}
	prev_segment() {
		this.traverse_segments('left')
	}

	get_current_values() {
		return this.polyfill.get_values(this.$input.current)
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
		this.setState({
			currentSegment: this.polyfill.get_current_segment(this.$input.current),
		})
	}

	handleFocus(e) {
		this.props.onFocus && this.props.onFocus(e)
		if (!hasPolyfill) return null
		if (!this.focused_via_click) {
			const segment = shiftKey ? 'mode' : 'hrs'
			this.setState({ currentSegment: segment })
		}
	}

	handleBlur(e) {
		this.props.onBlur && this.props.onBlur(e)
		this.focused_via_click = false
		this.setState({ currentSegment: null })
	}

	handleKeyDown(e) {
		if (!hasPolyfill) return null
		e.preventDefault()
		const key = keyName(e)
		const actions = {
			ArrowRight: () => this.next_segment(),
			ArrowLeft: () => this.prev_segment(),
			ArrowUp: () => this.nudge_current_segment('up'),
			ArrowDown: () => this.nudge_current_segment('down'),
		}
		actions[key]()
	}

	render() {
		const { value, ...props } = this.props

		if (hasPolyfill && this.state.currentSegment !== null) {
			this.polyfill.select_segment(
				this.$input.current,
				this.state.currentSegment,
			)
		}

		return React.createElement(
			'input',
			{
				...props,
				onChange: e => this.handleChange(e),
				onFocus: e => this.handleFocus(e),
				onBlur: e => this.handleBlur(e),
				onMouseDown: e => this.handleMouseDown(e),
				onClick: e => this.handleClick(e),
				onKeyDown: e => this.handleKeyDown(e),
				ref: this.$input,
				type: hasPolyfill ? 'text' : 'time',
				value: hasPolyfill ? this.state.value12hr : this.state.value24hr,
			},
			null,
		)
	}
}
