// cypress was failing when trying to find cypress-promise
import cyPromise from '../../node_modules/cypress-promise/index'

interface LoadedPageProps {
	document: Document
	window: Window
}

export type LoadedPage = Promise<LoadedPageProps>

export const loadTestPage = (htmlFileOrUrl = 'http://localhost:3000/react-time-input-polyfill'): LoadedPage => {
	return cyPromise(cy.visit(htmlFileOrUrl)).then((contentWindow: Window) => {
		const { document } = contentWindow
		return { document, window: contentWindow }
	})
}
