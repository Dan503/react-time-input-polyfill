import React from 'react'
import supportsTime from 'time-input-polyfill/core/helpers/supportsTime'
import loadJS from 'time-input-polyfill/core/helpers/loadJS'

const debugMode = true
// const debugMode = false

let shiftKey = false

const timeInputs = []

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
		46: 'Delete',
	}[e.which])

let polyfillLoadCalled = false

const loadPolyfill = () => {
	if (polyfillLoadCalled) return null
	polyfillLoadCalled = true

	loadJS(
		debugMode
			? './timePolyfillHelpers.js'
			: 'https://cdn.jsdelivr.net/npm/react-time-input-polyfill/dist/timePolyfillHelpers.js',
		() => {
			timeInputs.forEach(input =>
				input.onPolyfillLoad(window.timePolyfillHelpers),
			)
		},
	)
}

let accessibility_block_created = false
let $a11y

export default class TimeInput extends React.Component {
	constructor(props) {
		super(props)
		this.$input = React.createRef()
		this.focused_via_click = false

		this.state = {
			time: {
				hrs: '--',
				min: '--',
				mode: '--',
			},
			value24hr: props.value || '',
			currentSegment: null,
			usePolyfill: !supportsTime,
		}

		if (props.forcePolyfill || !supportsTime) {
			timeInputs.push(this)
			loadPolyfill()
		}
	}

	onPolyfillLoad(loadedPolyfill) {
		this.polyfill = loadedPolyfill

		this.setState({
			usePolyfill: true,
			time: this.polyfill.get_values_from_24hr(this.state.value24hr),
		})

		if (!accessibility_block_created) {
			$a11y = this.polyfill.create_a11y_block()
			accessibility_block_created = true
		}

		const $input = this.$input.current
		$input.polyfill = {
			label: this.polyfill.get_label($input),
			$a11y,
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const hasNewPropsValue = prevProps.value !== this.props.value
		const hasNewStateValue = prevState.value24hr !== this.state.value24hr

		if (!hasNewPropsValue && !hasNewStateValue) return null

		if (hasNewStateValue) {
			this.onTimeChange()
		} else if (hasNewPropsValue) {
			this.setState({
				time: this.state.usePolyfill
					? this.polyfill.get_values_from_24hr(this.props.value)
					: null,
				value24hr: this.props.value,
			})
		}
	}

	nudge_current_segment(direction) {
		const segment = this.state.currentSegment

		const current_values = this.state.time
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

	get_12hr_value(timeObj) {
		const time = timeObj || this.state.time
		return !time
			? ''
			: [
					leading_zero(time.hrs),
					':',
					leading_zero(time.min),
					' ',
					time.mode,
			  ].join('')
	}

	set_segment(segment, value) {
		const time = {
			...this.state.time,
			[segment]: isNaN(value) ? value : parseInt(value),
		}

		const value12hr = this.get_12hr_value(time)
		const value24hr = this.polyfill.convert_to_24hr_time(value12hr)

		this.setState({
			time,
			value24hr,
		})
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

	clear_current_segment() {
		this.set_segment(this.state.currentSegment, '--')
	}

	onTimeChange() {
		if (this.props.onChange) {
			this.props.onChange({
				value: this.state.value24hr,
				time: this.state.time,
				element: this.$input.current,
			})
		}
	}

	handleChange(e) {
		if (this.state.usePolyfill) return null
		this.setState({ value24hr: e.target.value })
	}

	handleMouseDown(e) {
		this.props.onMouseDown && this.props.onMouseDown(e)
		this.focused_via_click = true
	}

	handleClick(e) {
		this.props.onClick && this.props.onClick(e)
		if (!this.state.usePolyfill) return null
		this.polyfill.select_cursor_segment(this.$input.current)
		this.setState({
			currentSegment: this.polyfill.get_current_segment(this.$input.current),
		})
	}

	handleFocus(e) {
		this.props.onFocus && this.props.onFocus(e)
		if (!this.state.usePolyfill) return null
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
		if (!this.state.usePolyfill) return null
		const key = keyName(e)
		const actions = {
			ArrowRight: () => this.next_segment(),
			ArrowLeft: () => this.prev_segment(),

			ArrowUp: () => this.nudge_current_segment('up'),
			ArrowDown: () => this.nudge_current_segment('down'),

			Delete: () => this.clear_current_segment(),
			Backspace: () => this.clear_current_segment(),
		}

		if (actions[key]) {
			e.preventDefault()
			actions[key]()
		}
	}

	render() {
		const { value, forcePolyfill, ...props } = this.props
		const { usePolyfill, value24hr, currentSegment } = this.state

		const value12hr = usePolyfill ? this.get_12hr_value() : null

		if (usePolyfill && currentSegment !== null) {
			const highlightSegment = () =>
				this.polyfill.select_segment(this.$input.current, currentSegment)
			setTimeout(highlightSegment, 0)
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
				type: usePolyfill ? 'text' : 'time',
				value: usePolyfill ? value12hr : value24hr,
			},
			null,
		)
	}
}
