import { NextRequest, NextResponse } from 'next/server'
import { getUnnotifiedBigOrders, markOrderNotified } from '@/lib/supabase'
import { sendTelegramMessage, formatOrderNotification } from '@/lib/telegram'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const secret = req.headers.get('authorization')
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const orders = await getUnnotifiedBigOrders()
    let notified = 0

    for (const order of orders) {
      const text = formatOrderNotification(order)
      await sendTelegramMessage(text)
      await markOrderNotified(order.id)
      notified++
    }

    return NextResponse.json({ success: true, notified })
  } catch (err) {
    console.error('Notify error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
