import { getCursorSegment, selectSegment } from "@time-input-polyfill/utils"
import { Segment } from "@time-input-polyfill/utils/npm/types"
import { loadTestPage } from "../support/loadTestPage"
import { cyInput } from "../support/utils"

const sendFocus = () => {
	return cyInput().focus().wait(100)
}
const use = {
	leftArrow: () => cyInput().type('{leftarrow}'),
	rightArrow: () => cyInput().type('{rightarrow}'),
	tab: () => cyInput().tab(),
	shiftTab: () => cyInput().tab({ shift: true }),
}

describe('Segment navigation', () => {
	viaJS()
	viaArrowKeys()
	viaTabKey()

	function viaJS() {
		describe('Via JS', () => {
			it('Should send focus to hours segment', () => {
				loadTestPage().then(({ $input }) => {
					sendFocus().then(() => {
						const segment = getCursorSegment($input)
						const expectation: Segment = 'hrs12'
						expect(segment).to.eq(expectation)
					})
				})
			})
		})
	}

	function viaArrowKeys() {
		describe('Via Arrow keys', () => {
			it('hours [->] minutes', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'hrs12')
					use.rightArrow().then(() => {
						const segment = getCursorSegment($input)
						const expectation: Segment = 'minutes'
						expect(segment).to.eq(expectation)
					})
				})
			})
			it('minutes [->] mode', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'minutes')
					use.rightArrow().then(() => {
						const segment = getCursorSegment($input)
						const expectation: Segment = 'mode'
						expect(segment).to.eq(expectation)
					})
				})
			})
			it('mode [->] mode', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'mode')
					use.rightArrow().then(() => {
						const segment = getCursorSegment($input)
						const expectation: Segment = 'mode'
						expect(segment).to.eq(expectation)
					})
				})
			})
			it('mode [<-] minutes', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'mode')
					use.leftArrow().then(() => {
						const segment = getCursorSegment($input)
						const expectation: Segment = 'minutes'
						expect(segment).to.eq(expectation)
					})
				})
			})
			it('minutes [<-] hours', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'minutes')
					use.leftArrow().then(() => {
						const segment = getCursorSegment($input)
						const expectation: Segment = 'hrs12'
						expect(segment).to.eq(expectation)
					})
				})
			})
			it('hours [<-] hours', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'hrs12')
					use.leftArrow().then(() => {
						const segment = getCursorSegment($input)
						const expectation: Segment = 'hrs12'
						expect(segment).to.eq(expectation)
					})
				})
			})
		})
	}

	function viaTabKey() {
		describe('Via Tab key', () => {
			it('hours [tab] minutes', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'hrs12')
					use.tab().then(() => {
						const segment = getCursorSegment($input)
						const expectation: Segment = 'minutes'
						cyInput().should('have.focus')
						expect(segment).to.eq(expectation)
					})
				})
			})
			it('minutes [tab] mode', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'minutes')
					use.tab().then(() => {
						const segment = getCursorSegment($input)
						const expectation: Segment = 'mode'
						cyInput().should('have.focus')
						expect(segment).to.eq(expectation)
					})
				})
			})
			it('mode [tab] off', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'mode')
					use.tab().then(() => {
						cyInput().should('not.have.focus')
					})
				})
			})
			it('mode [shift + tab] minutes', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'mode')
					use.shiftTab().then(() => {
						const segment = getCursorSegment($input)
						const expectation: Segment = 'minutes'
						cyInput().should('have.focus')
						expect(segment).to.eq(expectation)
					})
				})
			})
			it('minutes [shift + tab] hours', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'minutes')
					use.shiftTab().then(() => {
						const segment = getCursorSegment($input)
						const expectation: Segment = 'hrs12'
						cyInput().should('have.focus')
						expect(segment).to.eq(expectation)
					})
				})
			})
			it('hours [shift + tab] off', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'hrs12')
					use.shiftTab().then(() => {
						cyInput().should('not.have.focus')
					})
				})
			})
		})
	}
})

export {}
