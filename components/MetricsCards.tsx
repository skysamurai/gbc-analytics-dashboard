import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { OrderRecord } from '@/lib/supabase'

interface Props {
  orders: OrderRecord[]
}

export function MetricsCards({ orders }: Props) {
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const avgCheck = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  const bigOrders = orders.filter(o => o.total > 50000).length

  const metrics = [
    { title: 'Заказов', value: totalOrders.toLocaleString('ru-RU'), sub: 'всего' },
    { title: 'Выручка', value: `${totalRevenue.toLocaleString('ru-RU')} ₸`, sub: 'сумма' },
    { title: 'Средний чек', value: `${avgCheck.toLocaleString('ru-RU')} ₸`, sub: 'на заказ' },
    { title: 'Крупных заказов', value: bigOrders.toLocaleString('ru-RU'), sub: 'свыше 50 000 ₸' },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {metrics.map(m => (
        <Card key={m.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{m.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{m.value}</div>
            <p className="text-xs text-muted-foreground">{m.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
