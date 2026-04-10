import { formatCurrency, calculateOrderTotal } from '../utils'

describe('formatCurrency', () => {
  it('formats number as KZT', () => {
    expect(formatCurrency(50000)).toBe('50 000 ₸')
  })
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('0 ₸')
  })
})

describe('calculateOrderTotal', () => {
  it('sums items price * quantity', () => {
    const items = [
      { initialPrice: 15000, quantity: 1 },
      { initialPrice: 10000, quantity: 2 },
    ]
    expect(calculateOrderTotal(items)).toBe(35000)
  })
  it('handles single item', () => {
    expect(calculateOrderTotal([{ initialPrice: 50000, quantity: 1 }])).toBe(50000)
  })
})
