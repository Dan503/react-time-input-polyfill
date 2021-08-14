interface LoadedPageProps {
	document: Document
	window: Window
	$input: HTMLInputElement
}

export const demoSiteUrl = 'http://localhost:3000/react-time-input-polyfill'

export type LoadedPage = Promise<LoadedPageProps>

export const loadTestPage = ({ inputId = 'Forced-polyfill-input', htmlFileOrUrl = demoSiteUrl } = {}): LoadedPage => {
	return new Cypress.Promise((resolve) => {
		cy.visit(htmlFileOrUrl).then((contentWindow: Window) => {
			const { document } = contentWindow
			const $input = document.getElementById(inputId) as HTMLInputElement
			resolve({ document, window: contentWindow, $input })
		})
	})
}

export const cyVisit = () => cy.visit(demoSiteUrl)
