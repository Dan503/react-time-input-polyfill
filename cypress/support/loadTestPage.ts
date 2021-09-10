import { Segment } from "@time-input-polyfill/utils"
import { cyInput, cySelectSegment } from "."

export const demoSiteUrl = 'http://localhost:3000/react-time-input-polyfill'

interface LoadTestPageParams {
	htmlFileOrUrl?: string
	segment?: Segment
}

export const loadTestPage = ({ segment, htmlFileOrUrl = demoSiteUrl }: LoadTestPageParams = {}) => {
	return cy.visit(htmlFileOrUrl).wait(100).then(() => {
		if (segment) {
			return cySelectSegment(segment)
		}
		return cyInput().wait(10)
	})
}
