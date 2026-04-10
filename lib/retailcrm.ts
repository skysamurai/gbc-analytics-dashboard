export interface RetailCRMOrderItem {
  name: string
  quantity: number
  price: number
}

export interface OrderRecord {
  id: string
  created_at: string
  status: string
  total: number
  city: string | null
  utm_source: string | null
  customer_name: string | null
  items: RetailCRMOrderItem[]
}

export function transformRetailCRMOrder(raw: any): OrderRecord {
  const items: RetailCRMOrderItem[] = (raw.items ?? []).map((item: any) => ({
    name: item.offer?.name ?? item.productName ?? '',
    quantity: item.quantity ?? 1,
    price: item.initialPrice ?? 0,
  }))
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  return {
    id: String(raw.id),
    created_at: raw.createdAt,
    status: raw.status ?? 'new',
    total,
    city: raw.delivery?.address?.city ?? null,
    utm_source: raw.customFields?.utm_source ?? null,
    customer_name: [raw.firstName, raw.lastName].filter(Boolean).join(' ') || null,
    items,
  }
}

export async function fetchRetailCRMOrders(
  baseUrl: string,
  apiKey: string
): Promise<OrderRecord[]> {
  const results: OrderRecord[] = []
  let page = 1
  while (true) {
    const url = `${baseUrl}/api/v5/orders?apiKey=${apiKey}&limit=100&page=${page}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`RetailCRM API error: ${res.status}`)
    const data = await res.json()
    const orders: OrderRecord[] = (data.orders ?? []).map(transformRetailCRMOrder)
    results.push(...orders)
    if (!data.pagination || page >= data.pagination.totalPageCount) break
    page++
  }
  return results
}
