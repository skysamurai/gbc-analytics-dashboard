import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import type { OrderRecord } from '@/lib/supabase'

interface Props {
  orders: OrderRecord[]
}

export function OrdersTable({ orders }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Клиент</TableHead>
            <TableHead>Город</TableHead>
            <TableHead>Сумма</TableHead>
            <TableHead>Источник</TableHead>
            <TableHead>Дата</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(order => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-sm">#{order.id}</TableCell>
              <TableCell>{order.customer_name ?? '—'}</TableCell>
              <TableCell>{order.city ?? '—'}</TableCell>
              <TableCell className={order.total > 50000 ? 'font-bold text-emerald-600' : ''}>
                {order.total.toLocaleString('ru-RU')} ₸
              </TableCell>
              <TableCell>
                {order.utm_source ? (
                  <Badge variant="secondary">{order.utm_source}</Badge>
                ) : '—'}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString('ru-RU')}
              </TableCell>
            </TableRow>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                Заказов не найдено
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
