'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { OrderRecord } from '@/lib/supabase'

interface Props {
  orders: OrderRecord[]
}

export function UtmBreakdown({ orders }: Props) {
  const byUtm = orders.reduce<Record<string, { count: number; revenue: number }>>((acc, order) => {
    const source = order.utm_source ?? 'direct'
    if (!acc[source]) acc[source] = { count: 0, revenue: 0 }
    acc[source].count++
    acc[source].revenue += order.total
    return acc
  }, {})

  const data = Object.entries(byUtm)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([source, stats]) => ({
      source,
      заказов: stats.count,
      выручка: Math.round(stats.revenue / 1000),
    }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis dataKey="source" type="category" tick={{ fontSize: 12 }} width={70} />
          <Tooltip
            formatter={(value, name) =>
              name === 'выручка' ? `${value}к ₸` : value
            }
          />
          <Bar dataKey="заказов" fill="#6366f1" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
