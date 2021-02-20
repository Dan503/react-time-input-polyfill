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

export interface TimePolyfillProps
	extends React.HTMLAttributes<HTMLInputElement> {
	/** The string value of the input in 24 hour time. */
	value?: String24hr
	/** The setState function that updates the `value` prop. */
	setValue: SetValue
	/**
	 * Set to true to force browsers that support input[type=time]
	 * to use the polyfill.
	 *
	 * (Useful for testing and debugging)
	 *
	 * @default false */
	forcePolyfill?: boolean
	/** TO DO: Add support for `polyfillSource` prop */
	polyfillSource?: string
}

/**
 * An `input[type=time]` element with a built in polyfill for browsers that don't support the time input natively.
 *
 * Only browsers that _need_ the polyfill code will download the polyfill.
 *
 * ```jsx
 * import TimeInput from '@time-input-polyfill/react'
 * // ...
 * const [value, setValue] = useState()
 * // ...
 * <TimeInput value={value} setValue={setValue} />
 * ```
 *
 * __Resources:__
 * - [Demo website](https://dan503.github.io/react-time-input-polyfill/)
 * - [GitHub repository](https://github.com/Dan503/react-time-input-polyfill)
 * - [npm package](https://www.npmjs.com/package/@time-input-polyfill/react)
 */
const TimeInputPolyfill = ({
	value: value24hr = '',
	setValue: setValue24hr,
	forcePolyfill = false,
	onChange,
	onFocus,
	onBlur,
	onMouseDown,
	onMouseUp,
	onClick,
	onKeyDown,
	className,
	style,
	...restProps
}: TimePolyfillProps) => {
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
	const cursorSegmentRef = useRef(cursorSegment)
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allowSegmentSelection, cursorSegment, polyfill, timeObject])

	useEffect(() => {
		if (polyfill) {
			const { a11yUpdate, getA11yValue } = polyfill
			setTimeout(() => {
				if (getA11yValue()) {
					a11yUpdate($input.current, ['update'])
				}
			})
		}
	}, [timeObject, polyfill])

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
			'https://cdn.jsdelivr.net/npm/@time-input-polyfill/utils@1.0.0-beta.47/npm/time-input-polyfill-utils.min.js',
			() => {
				const {
					convertString12hr,
					convertString24hr,
					a11yCreate,
					getA11yElement,
					ManualEntryLog,
					getNextSegment,
				} = window.timeInputPolyfillUtils
				setPolyfill(window.timeInputPolyfillUtils)
				const timeObject = convertString24hr(value24hr).toTimeObject()
				setTimeObject(timeObject)
				if (!getA11yElement()) {
					a11yCreate()
				}
				setManualEntryLog(
					new ManualEntryLog({
						timeObject,
						onUpdate({ fullValue12hr }) {
							const timeObj = convertString12hr(
								fullValue12hr,
							).toTimeObject()
							setTimeObject(timeObj)
						},
						onLimitHit() {
							setCursorSegment(
								getNextSegment(cursorSegmentRef.current),
							)
						},
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

	useEffect(() => {
		cursorSegmentRef.current = cursorSegment
		const hasFocus = document.activeElement === $input.current
		if (polyfill && hasFocus) {
			const { a11yUpdate, getA11yValue } = polyfill
			setTimeout(() => {
				if (getA11yValue()) {
					a11yUpdate($input.current, ['select'])
				} else {
					a11yUpdate($input.current, ['initial', 'select'])
				}
			})
		}
	}, [cursorSegment, polyfill])

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
		polyfill?.a11yClear()
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
				resetSegmentEntryLog()
				setTimeObject(
					modifyTimeObject(timeObject).increment[segment].isolated(),
				)
			} else if (key === 'ArrowDown') {
				if (!cursorSegment) setCursorSegment(segment)
				e.preventDefault()
				resetSegmentEntryLog()
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
