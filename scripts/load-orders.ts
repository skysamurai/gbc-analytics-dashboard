import * as fs from 'fs'
import * as path from 'path'

const RETAILCRM_URL = process.env.RETAILCRM_URL!
const RETAILCRM_API_KEY = process.env.RETAILCRM_API_KEY!

interface MockOrder {
  firstName: string
  lastName: string
  phone: string
  email: string
  orderType: string
  orderMethod: string
  status: string
  items: Array<{ productName: string; quantity: number; initialPrice: number }>
  delivery: { address: { city: string; text: string } }
  customFields: { utm_source: string }
}

async function createOrder(order: MockOrder): Promise<void> {
  const body = new URLSearchParams()
  body.append('apiKey', RETAILCRM_API_KEY)
  body.append('order', JSON.stringify({
    firstName: order.firstName,
    lastName: order.lastName,
    phone: order.phone,
    email: order.email,
    orderType: order.orderType,
    orderMethod: order.orderMethod,
    status: order.status,
    items: order.items.map(item => ({
      productName: item.productName,
      quantity: item.quantity,
      initialPrice: item.initialPrice,
    })),
    delivery: {
      address: {
        city: order.delivery.address.city,
        text: order.delivery.address.text,
      },
    },
    customFields: order.customFields,
  }))

  const res = await fetch(`${RETAILCRM_URL}/api/v5/orders/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  const data = await res.json()
  if (!data.success) {
    throw new Error(`Failed to create order: ${JSON.stringify(data)}`)
  }
}

async function main(): Promise<void> {
  const ordersPath = path.join(__dirname, '..', '..', 'mock_orders.json')
  const orders: MockOrder[] = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'))
  console.log(`Loading ${orders.length} orders into RetailCRM...`)

  let success = 0
  let failed = 0
  for (const [i, order] of orders.entries()) {
    try {
      await createOrder(order)
      success++
      process.stdout.write(`\r[${i + 1}/${orders.length}] ✓ ${order.firstName} ${order.lastName}`)
      // Rate limit: RetailCRM разрешает ~5 запросов/сек
      await new Promise(r => setTimeout(r, 250))
    } catch (err) {
      failed++
      console.error(`\nFailed order ${i + 1}:`, err)
    }
  }
  console.log(`\n\nDone! Success: ${success}, Failed: ${failed}`)
}

main().catch(console.error)
