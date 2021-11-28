// IE11 needs these polyfills to run React
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import loadJS from '@dan503/load-js'

loadJS(
	// Promise and object.assign polyfills are only needed because of the syntax highlighter package
	'https://polyfill.io/v3/polyfill.min.js?features=Promise%2CObject.assign&flags=gated',
	() => {
		ReactDOM.render(<App />, document.getElementById('root'))
	},
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
