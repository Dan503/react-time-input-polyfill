import React, { useRef, useState, useEffect } from 'react'
import {
	TimeObject,
	String24hr,
	String12hr,
	Polyfill,
} from 'time-input-polyfill-utils/types'

// Avoid bulk importing from index files to be more tree-shake friendly
import supportsTime from 'time-input-polyfill-utils/common/supportsTime'
import { blankValues } from 'time-input-polyfill-utils/common/blankValues'
import loadJS from 'time-input-polyfill-utils/common/loadJS'
import { ManualEntryLog } from 'time-input-polyfill-utils/core/ManualEntryLog/ManualEntryLog'

const polyfillClassName = 'react-time-input-polyfill-target'

export interface TimePolyfill {
	value?: String24hr
	forcePolyfill?: boolean
	onChange: Function
	onFocus?: Function
	onBlur?: Function
	onMouseDown?: Function
	onClick?: Function
	onKeyDown?: Function
	className?: string
	[key: string]: any
}

const TimeInputPolyfill = ({
	onChange,
	value: valueProp24hr = '',
	forcePolyfill = false,
	onFocus,
	onBlur,
	onMouseDown,
	onClick,
	onKeyDown,
	className,
	...restProps
}: TimePolyfill) => {
	const isPolyfilled = forcePolyfill || !supportsTime
	const [polyfill, setPolyfill] = useState<Polyfill | null>(null)

	const [value12hr, setValue12hr] = useState<String12hr>(
		blankValues.string12hr,
	)

	const [value24hr, setValue24hr] = useState<String24hr>(valueProp24hr)
	const [forcedValue, setForcedValue] = useState<String24hr | null>(null)

	const [timeObject, setTimeObject] = useState<TimeObject>(
		blankValues.timeObject,
	)

	const [manualEntryLog, setManualEntryLog] = useState<ManualEntryLog | null>(
		null,
	)

	// Run this on form submit incase people are submitting forms normally
	const flash24hrTime = (value24hr: String24hr) => {
		setForcedValue(value24hr)
		setTimeout(() => setForcedValue(null), 1)
	}

	// const { hrs12, hrs24, min, mode } = timeObject

	// Do all modifications through the timeObject. React will update the other values accordingly.
	useEffect(() => {
		if (polyfill) {
			const { convertTimeObject } = polyfill
			setValue12hr(convertTimeObject(timeObject).to12hr())
			setValue24hr(convertTimeObject(timeObject).to24hr())
		}
	}, [polyfill, timeObject])

	if (isPolyfilled) {
		// TO DO 1st: Use this when v1.0.0 of the utils is released: https://cdn.jsdelivr.net/npm/time-input-polyfill-utils@1
		// TO DO 2nd: Create a local polyfill file that only holds the things that are needed
		// Don't worry, it only downloads the polyfill once no matter how many inputs you have on the page
		loadJS('https://cdn.jsdelivr.net/npm/time-input-polyfill-utils', () => {
			const {
				convertString24hr,
				a11yCreate,
				ManualEntryLog,
			} = window.timeInputPolyfillUtils
			setPolyfill(window.timeInputPolyfillUtils)
			setTimeObject(convertString24hr(valueProp24hr).toTimeObject())
			a11yCreate()
			setManualEntryLog(new ManualEntryLog())
		})
	}

	const $input = useRef<HTMLInputElement>(null)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) onChange(e)
	}
	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		if (onFocus) onFocus(e)
	}
	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (onBlur) onBlur(e)
	}
	const handleMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
		if (onMouseDown) onMouseDown(e)
	}
	const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
		if (onClick) onClick(e)
	}
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (onKeyDown) onKeyDown(e)
	}

	const polyfillClass = isPolyfilled ? polyfillClassName : ''

	return (
		<input
			{...restProps}
			onChange={handleChange}
			onFocus={handleFocus}
			onBlur={handleBlur}
			onMouseDown={handleMouseDown}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			ref={$input}
			type={isPolyfilled ? 'text' : 'time'}
			value={isPolyfilled ? forcedValue || value12hr : value24hr}
			className={
				[className || '', polyfillClass].join(' ').trim() || undefined
			}
		/>
	)
}

export default React.memo(TimeInputPolyfill)
