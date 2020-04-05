import React, { useRef, useState, useEffect } from 'react'
import {
	TimeObject,
	String24hr,
	String12hr,
	Polyfill,
} from 'time-input-polyfill-utils/types'
import { supportsTime, blankValues } from 'time-input-polyfill-utils/common'

import { loadPolyfill } from '.'

const polyfillClassName = 'react-time-input-polyfill-target'

const flash24hrTime = ({
	isPolyfilled,
	setForcedValue,
	value24hr,
}: {
	isPolyfilled: boolean
	setForcedValue: Function
	value24hr: String24hr
}) => () => {
	if (isPolyfilled) {
		setForcedValue(value24hr)
		setTimeout(() => setForcedValue(null), 1)
	}
}

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
	const isPolyfilled = forcePolyfill || supportsTime
	const [polyfill, setPolyfill] = useState<Polyfill | null>(null)

	const [value12hr, setValue12hr] = useState<String12hr>(
		blankValues.string12hr,
	)
	const [value24hr, setValue24hr] = useState<String24hr>(
		blankValues.string24hr,
	)
	// Not sure what this is for yet
	const [forcedValue, setForcedValue] = useState<String24hr | null>(null)

	const [timeObject, setTimeObject] = useState<TimeObject>(
		blankValues.timeObject,
	)

	const { hrs12, hrs24, min, mode } = timeObject

	// Do all modifications through the timeObject. React will update the other values accordingly.
	useEffect(() => {
		if (polyfill) {
			const { convertTimeObject } = polyfill
			setValue12hr(convertTimeObject(timeObject).to12hr())
			setValue24hr(convertTimeObject(timeObject).to24hr())
		}
		// React can do better static analysis against string/number values
	}, [polyfill, hrs12, hrs24, isPolyfilled, min, mode, timeObject])

	if (isPolyfilled) {
		loadPolyfill((polyfillUtils: Polyfill) => {
			const { convertString24hr } = polyfillUtils
			setPolyfill(polyfillUtils)
			setTimeObject(convertString24hr(valueProp24hr).toTimeObject())
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
