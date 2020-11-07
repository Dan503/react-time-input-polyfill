import React, { useRef, useState, useEffect } from 'react'
import loadJS from '@dan503/load-js'

import {
	TimeObject,
	String24hr,
	String12hr,
	Polyfill,
	Segment,
} from '@time-input-polyfill/utils/npm/types/index'

// Avoid bulk importing from index files to be more tree-shake friendly
import supportsTime from '@time-input-polyfill/utils/npm/common/supportsTime'
import { blankValues } from '@time-input-polyfill/utils/npm/common/blankValues'
import { ManualEntryLog } from '@time-input-polyfill/utils/npm/core/ManualEntryLog/ManualEntryLog'

const polyfillClassName = 'react-time-input-polyfill-target'

// Needed for the sake of IE to work
interface Element {
	msMatchesSelector(selectors: string): boolean
}

export type SetValue = React.Dispatch<React.SetStateAction<String24hr | null>>

export interface TimePolyfill {
	value?: String24hr
	setValue: SetValue
	forcePolyfill?: boolean
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
	onMouseDown?: (e: React.MouseEvent<HTMLInputElement>) => void
	onMouseUp?: (e: React.MouseEvent<HTMLInputElement>) => void
	onClick?: (e: React.MouseEvent<HTMLInputElement>) => void
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
	className?: string
	[key: string]: any
}

const TimeInputPolyfill = ({
	onChange,
	value: value24hr = '',
	setValue: setValue24hr,
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

	const $input = useRef<HTMLInputElement>(null)

	const [polyfill, setPolyfill] = useState<Polyfill | null>(null)
	const [hasInitialised, setHasInitialised] = useState(false)

	const [focusedViaClick, setFocusedViaClick] = useState<boolean>(false)

	const [value12hr, setValue12hr] = useState<String12hr>(
		blankValues.string12hr,
	)

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

	/*
		<Forced override value code>

		If a developer for some reason wants to use normal submit functionality
		This will quickly switch IE form inputs to 24 hour time before submitting
		then switch back afterwards so the user doesn't notice
	*/
	const [forcedValue, setForcedValue] = useState<String24hr | null>(null)
	// Watch for form submission events and override the displayed time value on submit
	useEffect(() => {
		const overrideTime = () => {
			setForcedValue(value24hr)
			setTimeout(() => setForcedValue(null), 1)
		}
		const $inputElement = $input.current
		$inputElement?.form?.addEventListener('submit', overrideTime)
		return () => {
			$inputElement?.form?.removeEventListener('submit', overrideTime)
		}
	}, [value24hr])
	/* </Forced override value code>	*/

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
	}, [
		allowSegmentSelection,
		cursorSegment,
		polyfill,
		timeObject,
		setValue24hr,
	])

	useEffect(() => {
		if (polyfill) {
			const { convertString24hr, matchesTimeObject } = polyfill
			const newTimeObject = convertString24hr(value24hr).toTimeObject()
			if (
				!matchesTimeObject(newTimeObject, timeObject) &&
				hasInitialised
			) {
				setTimeObject(newTimeObject)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value24hr, polyfill])

	if (isPolyfilled) {
		// TO DO 1st: Use this when v1.0.0 of the utils is released: https://cdn.jsdelivr.net/npm/@time-input-polyfill/utils@1
		// TO DO 2nd: Create a local polyfill file that only holds the things that are needed
		// Don't worry, it only downloads the polyfill once no matter how many inputs you have on the page
		loadJS(
			'https://cdn.jsdelivr.net/npm/@time-input-polyfill/utils@1.0.0-beta.38/npm/time-input-polyfill-utils.min.js',
			() => {
				const {
					convertString12hr,
					convertString24hr,
					a11yCreate,
					ManualEntryLog,
				} = window.timeInputPolyfillUtils
				setPolyfill(window.timeInputPolyfillUtils)
				const timeObject = convertString24hr(value24hr).toTimeObject()
				setTimeObject(timeObject)
				a11yCreate()
				setManualEntryLog(
					// TO DO: if entry log has reached it's limit, go to next segment
					new ManualEntryLog(timeObject, ({ fullValue12hr }) => {
						const timeObj = convertString12hr(
							fullValue12hr,
						).toTimeObject()
						setTimeObject(timeObj)
					}),
				)
				setHasInitialised(true)
			},
		)
	}

	const resetSegmentEntryLog = () => {
		if (manualEntryLog && cursorSegment) {
			manualEntryLog[cursorSegment].reset()
		}
	}

	//Reset entry log cursor segmet
	useEffect(() => {
		resetSegmentEntryLog()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cursorSegment, manualEntryLog])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) onChange(e)
		if (!isPolyfilled) setValue24hr(e.target.value)
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
			resetSegmentEntryLog()
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
				isShiftHeldDown,
				regex,
			} = polyfill

			const segment = cursorSegment || getCursorSegment($input.current)

			if (key === 'ArrowUp') {
				if (!cursorSegment) setCursorSegment(segment)
				e.preventDefault()
				setTimeObject(
					modifyTimeObject(timeObject).increment[segment].isolated(),
				)
			} else if (key === 'ArrowDown') {
				if (!cursorSegment) setCursorSegment(segment)
				e.preventDefault()
				setTimeObject(
					modifyTimeObject(timeObject).decrement[segment].isolated(),
				)
			} else if (key === 'ArrowLeft') {
				e.preventDefault()
				setCursorSegment(getPrevSegment(cursorSegment))
			} else if (key === 'ArrowRight') {
				e.preventDefault()
				setCursorSegment(getNextSegment(cursorSegment))
			} else if (key === 'Tab') {
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
			} else if (['Backspace', 'Delete'].includes(key)) {
				e.preventDefault()
				if (cursorSegment) {
					setTimeObject(
						modifyTimeObject(timeObject).clear[cursorSegment](),
					)
				}
			} else if (regex.alphaNumericKeyName.test(key) && manualEntryLog) {
				e.preventDefault()
				manualEntryLog[segment].add(key)
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
