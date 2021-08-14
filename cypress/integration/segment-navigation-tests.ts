import { getCursorSegment, selectSegment } from "@time-input-polyfill/utils"
import { Segment } from "@time-input-polyfill/utils/npm/types"
import { loadTestPage } from "../support/loadTestPage"
import { cyInput } from "../support/utils"

const sendFocus = () => {
	return cyInput().focus().wait(100)
}
const navigate = {
	left: () => cyInput().type('{leftarrow}'),
	right: () => cyInput().type('{rightarrow}'),
}

describe('Segment navigation', () => {
	viaJS()
	viaArrowKeys()

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
					sendFocus()
						.then(() => navigate.right())
						.then(() => {
							const segment = getCursorSegment($input)
							const expectation: Segment = 'minutes'
							expect(segment).to.eq(expectation)
						})
				})
			})
			it('minutes [->] mode', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'minutes')
					navigate.right().then(() => {
						const segment = getCursorSegment($input)
						const expectation: Segment = 'mode'
						expect(segment).to.eq(expectation)
					})
				})
			})
			it('mode [->] mode', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'mode')
					navigate.right().then(() => {
						const segment = getCursorSegment($input)
						const expectation: Segment = 'mode'
						expect(segment).to.eq(expectation)
					})
				})
			})
			it('mode [<-] minutes', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'mode')
					navigate.left().then(() => {
						const segment = getCursorSegment($input)
						const expectation: Segment = 'minutes'
						expect(segment).to.eq(expectation)
					})
				})
			})
			it('minutes [<-] hours', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'minutes')
					navigate.left().then(() => {
						const segment = getCursorSegment($input)
						const expectation: Segment = 'hrs12'
						expect(segment).to.eq(expectation)
					})
				})
			})
			it('hours [<-] hours', () => {
				loadTestPage().then(({ $input }) => {
					selectSegment($input, 'hrs12')
					navigate.left().then(() => {
						const segment = getCursorSegment($input)
						const expectation: Segment = 'hrs12'
						expect(segment).to.eq(expectation)
					})
				})
			})
		})
	}
})

export {}
