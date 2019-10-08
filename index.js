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
		this.input = React.createRef();
		events.on('polyfill_loaded', polyfill => new polyfill(this.input.current))
	}

	render(){
		return React.createElement('input', {ref: this.input, type:'time', ...this.props}, null)
	}
}