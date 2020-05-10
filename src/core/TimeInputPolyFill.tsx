import React, { useRef, useState, useEffect } from 'react'
import {
	TimeObject,
	String24hr,
	String12hr,
	Polyfill,
	Segment,
} from 'time-input-polyfill-utils/types'

// Avoid bulk importing from index files to be more tree-shake friendly
import supportsTime from 'time-input-polyfill-utils/common/supportsTime'
import { blankValues } from 'time-input-polyfill-utils/common/blankValues'
import loadJS from 'time-input-polyfill-utils/common/loadJS'
import { ManualEntryLog } from 'time-input-polyfill-utils/core/ManualEntryLog/ManualEntryLog'
import { isShiftHeldDown } from 'time-input-polyfill-utils/core/is/is'

const polyfillClassName = 'react-time-input-polyfill-target'

// Needed for the sake of IE to work
interface Element {
	msMatchesSelector(selectors: string): boolean
}

export interface TimePolyfill {
	value?: String24hr
	forcePolyfill?: boolean
	onChange: Function
	onFocus?: Function
	onBlur?: Function
	onMouseDown?: Function
	onMouseUp?: Function
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
	onMouseUp,
	onClick,
	onKeyDown,
	className,
	style,
	...restProps
}: TimePolyfill) => {
	const isPolyfilled = forcePolyfill || !supportsTime
	const [polyfill, setPolyfill] = useState<Polyfill | null>(null)

	const [focusedViaClick, setFocusedViaClick] = useState<boolean>(false)

	const [value12hr, setValue12hr] = useState<String12hr>(
		blankValues.string12hr,
	)

	const [value24hr, setValue24hr] = useState<String24hr>(valueProp24hr)
	const [forcedValue, setForcedValue] = useState<String24hr | null>(null)

	const [timeObject, setTimeObject] = useState<TimeObject>(
		blankValues.timeObject,
	)

	const [cursorSegment, setCursorSegment] = useState<Segment | null>(null)
	const [allowSegmentSelection, setAllowSegmentSelection] = useState<boolean>(
		false,
	)

	const [manualEntryLog, setManualEntryLog] = useState<ManualEntryLog | null>(
		null,
	)

	// Run this on form submit incase people are submitting forms normally
	const flash24hrTime = (value24hr: String24hr) => {
		setForcedValue(value24hr)
		setTimeout(() => setForcedValue(null), 1)
	}

	// Do all modifications through the timeObject. React will update the other values accordingly.
	useEffect(() => {
		if (polyfill) {
			const {
				convertTimeObject,
				getCursorSegment,
				selectSegment,
			} = polyfill
			const segment = cursorSegment || getCursorSegment($input.current)
			setValue12hr(convertTimeObject(timeObject).to12hr())
			setValue24hr(convertTimeObject(timeObject).to24hr())
			if (allowSegmentSelection) {
				setTimeout(() => {
					selectSegment($input.current, segment)
				})
			}
		}
	}, [allowSegmentSelection, cursorSegment, polyfill, timeObject])

	if (isPolyfilled) {
		// TO DO 1st: Use this when v1.0.0 of the utils is released: https://cdn.jsdelivr.net/npm/time-input-polyfill-utils@1
		// TO DO 2nd: Create a local polyfill file that only holds the things that are needed
		// Don't worry, it only downloads the polyfill once no matter how many inputs you have on the page
		loadJS(
			'https://cdn.jsdelivr.net/npm/time-input-polyfill-utils@1.0.0-beta.22/time-input-polyfill-utils.min.js',
			() => {
				const {
					convertString24hr,
					a11yCreate,
					ManualEntryLog,
				} = window.timeInputPolyfillUtils
				setPolyfill(window.timeInputPolyfillUtils)
				setTimeObject(convertString24hr(valueProp24hr).toTimeObject())
				a11yCreate()
				setManualEntryLog(new ManualEntryLog())
			},
		)
	}

	const $input = useRef<HTMLInputElement>(null)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) onChange(e)
	}
	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		if (onFocus) onFocus(e)
		if (polyfill) {
			setAllowSegmentSelection(true)
			const { isShiftHeldDown, getCursorSegment } = polyfill

			if (focusedViaClick) {
				setCursorSegment(getCursorSegment($input.current))
			} else {
				setCursorSegment(isShiftHeldDown ? 'mode' : 'hrs12')
			}
		}
	}
	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (onBlur) onBlur(e)
		setAllowSegmentSelection(false)
		setFocusedViaClick(false)
	}
	const handleMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
		if (onMouseDown) onMouseDown(e)
		setFocusedViaClick(true)
	}
	const handleMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
		if (onMouseUp) onMouseUp(e)
		if (polyfill) {
			polyfill.selectCursorSegment($input.current)
		}
	}
	const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
		if (onClick) onClick(e)
	}
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (onKeyDown) onKeyDown(e)
		if (polyfill) {
			const key = e.key

			const {
				modifyTimeObject,
				getCursorSegment,
				getNextSegment,
				getPrevSegment,
			} = polyfill

			const segment = cursorSegment || getCursorSegment($input.current)

			if (key === 'ArrowUp') {
				if (!cursorSegment) setCursorSegment(segment)
				e.preventDefault()
				setTimeObject(
					modifyTimeObject(timeObject).increment[segment].isolated(),
				)
			}
			if (key === 'ArrowDown') {
				if (!cursorSegment) setCursorSegment(segment)
				e.preventDefault()
				setTimeObject(
					modifyTimeObject(timeObject).decrement[segment].isolated(),
				)
			}
			if (key === 'ArrowLeft') {
				e.preventDefault()
				setCursorSegment(getPrevSegment(cursorSegment))
			}
			if (key === 'ArrowRight') {
				e.preventDefault()
				setCursorSegment(getNextSegment(cursorSegment))
			}
			if (key === 'Tab') {
				const isNormal =
					(isShiftHeldDown && cursorSegment === 'hrs12') ||
					(!isShiftHeldDown && cursorSegment === 'mode')
				if (!isNormal) {
					e.preventDefault()
					const theNextSegment = isShiftHeldDown
						? getPrevSegment(cursorSegment)
						: getNextSegment(cursorSegment)
					setCursorSegment(theNextSegment)
				}
			}
		}
	}

	const polyfillClass = isPolyfilled ? polyfillClassName : ''

	const styles = {
		fontFamily: 'monospace',
		...style,
	}

	return (
		<input
			{...restProps}
			onChange={handleChange}
			onFocus={handleFocus}
			onBlur={handleBlur}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			ref={$input}
			type={isPolyfilled ? 'text' : 'time'}
			value={isPolyfilled ? forcedValue || value12hr : value24hr}
			style={styles}
			className={
				[className || '', polyfillClass].join(' ').trim() || undefined
			}
		/>
	)
}

export default React.memo(TimeInputPolyfill)
