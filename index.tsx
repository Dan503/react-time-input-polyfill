import React, { useRef, useState } from 'react'

const polyfillClassName = 'react-time-input-polyfill-target'

const TimeInputPolyfill = ({
	onChange,
	onFocus,
	onBlur,
	onMouseDown,
	onClick,
	onKeyDown,
	className,
	...restProps
}) => {
	const [usePolyfill, setUsePolyfill] = useState(false)
	const [value12hr, setValue12hr] = useState('--:-- --')
	const [value24hr, setValue24hr] = useState('')

	// Not sure what this is for yet
	let forcedValue = null

	const $input = useRef()

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

	const polyfillClass = usePolyfill ? polyfillClassName : ''

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
			type={usePolyfill ? 'text' : 'time'}
			value={usePolyfill ? forcedValue || value12hr : value24hr}
			className={
				[className || '', polyfillClass].join(' ').trim() || undefined
			}
		/>
	)
}

export default React.memo(TimeInputPolyfill)
