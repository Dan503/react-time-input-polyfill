import { viaArrowKeys, viaJS, viaTabKey } from "../tests/segement-navigation-tests"

describe('Segment navigation', () => {
	viaJS()
	viaArrowKeys()
	// Cypress Tab plugin doesn't support `event.preventDefault()` yet
	// https://github.com/Bkucera/cypress-plugin-tab/issues/52
	// viaTabKey()
})

export {}
