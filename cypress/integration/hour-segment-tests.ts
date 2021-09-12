import { fromBlankHours, decrementHours, deleteHours, incrementHours, hrs24Values } from "../tests/hour-segment-tests"

describe('hour segment', () => {
	incrementHours()
	decrementHours()
	deleteHours()
	fromBlankHours()
	hrs24Values()
})

export {}
