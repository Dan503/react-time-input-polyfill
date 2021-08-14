import { blankHours, decrementHours, deleteHours, incrementHours } from "../tests/hour-segment-tests"

describe('hour segment', () => {
	incrementHours()
	decrementHours()
	deleteHours()
	blankHours()
})

export {}
