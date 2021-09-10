import { initialValues, incrementScreenReaderHours, decrementScreenReaderHours, toggleScreenReaderMode } from "../tests/screen-reader-tests"
import { decrementScreenReaderMinutes } from "../tests/screen-reader-tests/modify-minutes/decrement-SR-minutes"
import { incrementScreenReaderMinutes } from "../tests/screen-reader-tests/modify-minutes/increment-SR-minutes"

describe('Screen reader tests', () => {
	initialValues()
	modifyHours()
	modifyMinutes()
	toggleScreenReaderMode()
})

function modifyHours() {
	describe('Modify hours', () => {
		incrementScreenReaderHours()
		decrementScreenReaderHours()
	})
}
function modifyMinutes() {
	describe('Modify Minutes', () => {
		incrementScreenReaderMinutes()
		decrementScreenReaderMinutes()
	})
}

export {}
