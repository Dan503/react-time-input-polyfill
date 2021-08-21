import * as React from 'react'
import supportsTime from 'time-input-polyfill/core/helpers/supportsTime'
import loadJS from 'time-input-polyfill/core/helpers/loadJS'

let shiftKey = false

const leading_zero = (number) => {
	if (isNaN(number)) return number
	const purified = parseInt(number)
	return purified < 10 ? '0' + purified : number
}

window.addEventListener('keyup', (e) => (shiftKey = e.shiftKey))
window.addEventListener('keydown', (e) => (shiftKey = e.shiftKey))

const loadPolyfill = (polyfillSource, callback) => {
	if (window.timePolyfillHelpers) {
		callback()
		return null
	}

	const cdn =
		'https://cdn.jsdelivr.net/npm/react-time-input-polyfill@1/dist/timePolyfillHelpers.js'

	loadJS(polyfillSource || cdn, callback)
}

let accessibility_block_created = false
let $a11y

const polyfillClassName = 'react-time-input-polyfill-target'

const customStyles = document.createElement('style')
customStyles.innerHTML = `.${polyfillClassName}::-ms-clear { display: none; }`
document.getElementsByTagName('head')[0].appendChild(customStyles)

const flash24hrTime = (component) => () => {
	if (component.state.usePolyfill) {
		component.setState({ forcedValue: component.state.value24hr })
		setTimeout(() => component.setState({ forcedValue: null }), 1)
	}
}

export default class TimeInputPolyfill extends React.Component {
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
			forcedValue: null,
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

		this.manual_entry_log = {
			hrs: new this.polyfill.manual_entry_log(),
			min: new this.polyfill.manual_entry_log(),
		}

		const $input = this.$input.current
		$input.polyfill = {
			label: this.polyfill.get_label($input),
			$a11y,
		}
	}

	update_a11y(announcementArray) {
		if (!this.state.usePolyfill) return null
		this.polyfill.update_a11y(this.$input.current, announcementArray)
	}

	componentDidMount() {
		setTimeout(() => {
			this.flash24hrTime = flash24hrTime(this)

			if (this.$input.current && this.$input.current.form) {
				this.$input.current.form.addEventListener(
					'submit',
					this.flash24hrTime,
				)
			}
		}, 0)

		if (this.props.forcePolyfill || !supportsTime) {
			loadPolyfill(this.props.polyfillSource, () => {
				this.onPolyfillLoad(window.timePolyfillHelpers)
			})
		}
	}
	componentWillUnmount() {
		if (this.$input.current && this.$input.current.form) {
			this.$input.current.form.removeEventListener(
				'submit',
				this.flash24hrTime,
			)
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const hasNewPropsValue = prevProps.value !== this.props.value
		const hasNewStateValue = prevState.value24hr !== this.state.value24hr

		if (!hasNewPropsValue && !hasNewStateValue) return null

		if (hasNewStateValue) {
			this.onTimeChange()
		} else if (hasNewPropsValue) {
			this.set_time(this.props.value)
		}
	}

	set_time(time24hr) {
		const [hrs, min] = time24hr
			.split(':')
			.map((value) => (isNaN(value) ? value : parseInt(value)))

		const newTimeValues = this.state.usePolyfill
			? {
					hrs: this.polyfill.convert_hours_to_12hr_time(hrs),
					min,
					mode: hrs > 12 ? 'PM' : 'AM',
			  }
			: null

		this.setState({
			time: this.state.usePolyfill
				? time24hr
					? newTimeValues
					: {
							hrs: '--',
							min: '--',
							mode: '--',
					  }
				: null,
			value24hr: time24hr,
		})
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
					this.polyfill.convert_hours_to_12hr_time(
						current_time().getHours(),
					),
				min: () => current_time().getMinutes(),
				mode: () => (current_time().getHours() > 11 ? 'PM' : 'AM'),
			}
		} else {
			var minutes = {
				up: current_values.min < 59 ? current_values.min + modifier : 0,
				down:
					current_values.min === 0
						? 59
						: current_values.min + modifier,
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
		const modifier = direction === 'left' ? -1 : 1
		const newIndex = segments.indexOf(this.state.currentSegment) + modifier
		const finalIndex = newIndex <= 0 ? 0 : newIndex >= 2 ? 2 : newIndex
		const currentSegment = segments[finalIndex]
		this.clear_entry_log()
		this.setState({ currentSegment })
		setTimeout(() => {
			this.update_a11y(['select'])
		}, 0)
	}

	clear_entry_log() {
		const { currentSegment } = this.state
		if (currentSegment !== 'mode') {
			this.manual_entry_log[currentSegment].clear()
		}
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
				element: this.$input.current,
			})
		}
		setTimeout(() => {
			this.update_a11y(['update'])
		}, 0)
	}

	handleChange(e) {
		if (this.state.usePolyfill) return null
		this.setState({ value24hr: e.target.value })
	}

	handleMouseDown(e) {
		this.props.onMouseDown && this.props.onMouseDown(e)
		this.focused_via_click = true

		if (this.$input.current.matches(':focus')) {
			this.update_a11y(['select'])
		}
	}

	handleClick(e) {
		this.props.onClick && this.props.onClick(e)
		if (!this.state.usePolyfill) return null
		this.polyfill.select_cursor_segment(this.$input.current)
		this.setState({
			currentSegment: this.polyfill.get_current_segment(
				this.$input.current,
			),
		})
	}

	handleFocus(e) {
		this.props.onFocus && this.props.onFocus(e)
		if (!this.state.usePolyfill) return null
		const segment = shiftKey ? 'mode' : 'hrs'
		if (!this.focused_via_click) {
			this.setState({ currentSegment: segment })
		}
		this.update_a11y(['initial', 'select'])
	}

	handleBlur(e) {
		this.props.onBlur && this.props.onBlur(e)
		this.focused_via_click = false
		this.setState({ currentSegment: null })
	}

	handleTab(e) {
		if (e.shiftKey && this.state.currentSegment !== 'hrs') {
			e.preventDefault()
			this.prev_segment()
		} else if (!e.shiftKey && this.state.currentSegment !== 'mode') {
			e.preventDefault()
			this.next_segment()
		}
	}

	handleKeyDown(e) {
		this.props.onKeyDown && this.props.onKeyDown(e)
		if (!this.state.usePolyfill) return null
		const key = e.key
		const actions = {
			ArrowRight: () => this.next_segment(),
			ArrowLeft: () => this.prev_segment(),

			ArrowUp: () => this.nudge_current_segment('up'),
			ArrowDown: () => this.nudge_current_segment('down'),

			Delete: () => this.clear_current_segment(),
			Backspace: () => this.clear_current_segment(),

			numberKey: () => this.enter_number(e.key),
			A_or_P: () => this.enter_A_or_P(e.key),
		}

		const isNumberKey = /\d/.test(e.key)
		const is_A_or_P = /[ap]/i.test(e.key)

		if (key === 'Tab') {
			this.handleTab(e)
		} else if (actions[key]) {
			e.preventDefault()
			actions[key]()
		} else if (isNumberKey) {
			actions.numberKey()
		} else if (is_A_or_P) {
			actions.A_or_P()
		} else if (key !== 'Escape') {
			e.preventDefault()
		}
	}

	enter_A_or_P(key) {
		const isA = /a/i.test(key)
		this.set_segment('mode', isA ? 'AM' : 'PM')
	}

	enter_number(key) {
		const segment = this.state.currentSegment
		const number = parseInt(key)
		const entry_log = this.manual_entry_log[segment]
		const entry_count = entry_log.items.length
		const upper_limits = {
			hrs: [1, 2],
			min: [5, 9],
		}
		const limit = upper_limits[segment][entry_count]

		if (entry_count < 2) {
			entry_log.add(number)
		}

		// Can't be 00 in hours.
		// If the user sets hours to 00 the input automatically changes hours to 12
		// The same behaviour like default input[type="time"].
		if (segment === 'hrs' && entry_log.items.join('') === '00') {
			entry_log.items = [1, 2]
		}

		const full_limit = parseInt(upper_limits[segment].join(''))
		const full_entry = parseInt(entry_log.items.join(''))

		if (full_limit >= full_entry) {
			this.set_segment(segment, full_entry)
		}

		const at_limit = number > limit || entry_log.items.length === 2

		if (at_limit) {
			this.next_segment()
		}
	}

	render() {
		const {
			value,
			forcePolyfill,
			className,
			polyfillSource,
			...props
		} = this.props
		const {
			usePolyfill,
			value24hr,
			currentSegment,
			forcedValue,
		} = this.state

		const value12hr = usePolyfill ? this.get_12hr_value() : null

		if (usePolyfill && currentSegment !== null) {
			const highlightSegment = () =>
				this.polyfill.select_segment(
					this.$input.current,
					currentSegment,
				)
			setTimeout(highlightSegment, 0)
		}

		const polyfillClass = this.state.usePolyfill ? polyfillClassName : ''

		return React.createElement(
			'input',
			{
				...props,
				onChange: (e) => this.handleChange(e),
				onFocus: (e) => this.handleFocus(e),
				onBlur: (e) => this.handleBlur(e),
				onMouseDown: (e) => this.handleMouseDown(e),
				onClick: (e) => this.handleClick(e),
				onKeyDown: (e) => this.handleKeyDown(e),
				ref: this.$input,
				type: usePolyfill ? 'text' : 'time',
				value: usePolyfill ? forcedValue || value12hr : value24hr,
				className:
					[className || '', polyfillClass].join(' ').trim() ||
					undefined,
			},
			null,
		)
	}
}
