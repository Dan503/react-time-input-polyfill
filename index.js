import React from 'react'
import supportsTime from 'time-input-polyfill/core/helpers/supportsTime'
import loadJS from 'time-input-polyfill/core/helpers/loadJS'

class EventBus {
	constructor(){
		this.calls = {}
	}
	on (string, callback) {
		this.calls[string] = callback
	}
	emit (string, ...props) {
		return this.calls[string](...props)
	}
}

const events = new EventBus()

document.addEventListener("DOMContentLoaded", function() {
	if (!supportsTime) {
		loadJS('https://cdn.jsdelivr.net/npm/time-input-polyfill/dist/time-input-polyfill.min.js', function(){
			events.emit('polyfill_loaded', window.TimePolyfill)
		})
	}
})

export default class TimeInput extends React.Component {
	constructor(props){
		super(props)
		this.$input = React.createRef();
		events.on('polyfill_loaded', polyfill => new polyfill(this.$input.current))
	}

	onTimeChange(event){
		if (this.props.onChange) {
			this.props.onChange({
				value: supportsTime ? this.$input.current.value : this.$input.current.dataset.value,
				element: this.$input.current,
				event
			})
		}
	}

	componentDidUpdate(){
		if (!supportsTime) {
			this.$input.current.polyfill.update()
		}
	}

	render(){
		return React.createElement('input', {
			...this.props,
			onChange: e => this.onTimeChange(e),
			ref: this.$input,
			type:'time',
		}, null)
	}
}