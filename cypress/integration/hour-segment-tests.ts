import { fromBlankHours, decrementHours, deleteHours, incrementHours } from "../tests/hour-segment-tests"

describe('hour segment', () => {
	incrementHours()
	decrementHours()
	deleteHours()
	fromBlankHours()
})

export {}
