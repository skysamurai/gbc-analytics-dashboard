import { transformRetailCRMOrder } from '../retailcrm'

describe('transformRetailCRMOrder', () => {
  const rawOrder = {
    id: 123,
    createdAt: '2024-01-15 10:00:00',
    status: 'new',
    items: [
      { offer: { name: 'Товар А' }, quantity: 2, initialPrice: 15000 },
    ],
    delivery: { address: { city: 'Алматы' } },
    customFields: { utm_source: 'instagram' },
    firstName: 'Айгуль',
    lastName: 'Касымова',
  }

  it('transforms order to DB shape', () => {
    const result = transformRetailCRMOrder(rawOrder)
    expect(result.id).toBe('123')
    expect(result.total).toBe(30000)
    expect(result.city).toBe('Алматы')
    expect(result.utm_source).toBe('instagram')
    expect(result.customer_name).toBe('Айгуль Касымова')
    expect(result.items).toHaveLength(1)
    expect(result.items[0].name).toBe('Товар А')
  })
})
