interface LoadedPageProps {
	document: Document
	window: Window
	$input: HTMLInputElement
}

export type LoadedPage = Promise<LoadedPageProps>

export const loadTestPage = ({ inputId = 'Forced-polyfill-input', htmlFileOrUrl = 'http://localhost:3000/react-time-input-polyfill' } = {}): LoadedPage => {
	return new Cypress.Promise((resolve) => {
		cy.visit(htmlFileOrUrl).then((contentWindow: Window) => {
			const { document } = contentWindow
			const $input = document.getElementById(inputId) as HTMLInputElement
			resolve({ document, window: contentWindow, $input })
		})
	})
}

export const forcedPolyfillId = 'Forced-polyfill-input'
export const _forcedPolyfillId = `#${forcedPolyfillId}`
