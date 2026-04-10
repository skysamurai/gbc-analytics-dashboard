'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { OrderRecord } from '@/lib/supabase'

interface Props {
  orders: OrderRecord[]
}

export function OrdersChart({ orders }: Props) {
  const byDate = orders.reduce<Record<string, { count: number; revenue: number }>>((acc, order) => {
    const date = order.created_at.slice(0, 10)
    if (!acc[date]) acc[date] = { count: 0, revenue: 0 }
    acc[date].count++
    acc[date].revenue += order.total
    return acc
  }, {})

  const data = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, stats]) => ({
      date: new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      заказов: stats.count,
      выручка: stats.revenue,
    }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value, name) =>
              name === 'выручка' ? `${Number(value).toLocaleString('ru-RU')} ₸` : value
            }
          />
          <Line yAxisId="left" type="monotone" dataKey="заказов" stroke="#6366f1" strokeWidth={2} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="выручка" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
