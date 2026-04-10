import { NextRequest, NextResponse } from 'next/server'
import { fetchRetailCRMOrders } from '@/lib/retailcrm'
import { upsertOrders } from '@/lib/supabase'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const secret = req.headers.get('authorization')
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const orders = await fetchRetailCRMOrders(
      process.env.RETAILCRM_URL!,
      process.env.RETAILCRM_API_KEY!
    )
    await upsertOrders(orders)
    return NextResponse.json({ success: true, count: orders.length })
  } catch (err) {
    console.error('Sync error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
