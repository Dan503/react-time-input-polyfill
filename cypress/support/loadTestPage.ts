import { selectSegment, Segment } from "@time-input-polyfill/utils"

export const demoSiteUrl = 'http://localhost:3000/react-time-input-polyfill'

interface LoadTestPageParams {
	inputId?: string,
	htmlFileOrUrl?: string
	segment: Segment
}

interface LoadTestPageReturn {
	document: Document
	window: Window
	$input: HTMLInputElement
	segment?: Segment
}

export type LoadedPage = Promise<LoadTestPageReturn>

export const loadTestPage = ({ segment, inputId = 'Forced-polyfill-input', htmlFileOrUrl = demoSiteUrl }: LoadTestPageParams): LoadedPage => {
	return new Cypress.Promise((resolve) => {
		cy.visit(htmlFileOrUrl).then((contentWindow: Window) => {
			const { document } = contentWindow
			const $input = document.getElementById(inputId) as HTMLInputElement

			cy.wait(10).then(() => {
				selectSegment($input, segment)
				return cy.wait(10)
			}).then(() => {
				resolve({ document, window: contentWindow, $input, segment })
			})
		})
	})
}

export const cyVisit = () => cy.visit(demoSiteUrl)
