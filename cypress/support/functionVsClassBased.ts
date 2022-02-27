
type params = { functionBased: () => void, classBased: () => void }

export const functionVsClassBased = ({ functionBased, classBased }: params): void => {
	describe('Function based', () => {
		functionBased()
	})
	describe('Class based', () => {
		classBased()
	})
}
