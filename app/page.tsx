import { Suspense } from 'react'
import { getOrders } from '@/lib/supabase'
import { MetricsCards } from '@/components/MetricsCards'
import { OrdersChart } from '@/components/OrdersChart'
import { UtmBreakdown } from '@/components/UtmBreakdown'
import { OrdersTable } from '@/components/OrdersTable'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

const CITIES = ['Алматы', 'Астана', 'Шымкент', 'Актау']
const UTMS = ['instagram', 'google', 'tiktok', 'direct', 'referral']

interface PageProps {
  searchParams: Promise<{ city?: string; utm?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const orders = await getOrders({
    city: params.city && params.city !== 'all' ? params.city : undefined,
    utm_source: params.utm && params.utm !== 'all' ? params.utm : undefined,
  })

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">GBC Analytics Dashboard</h1>
          <div className="flex gap-2">
            <FilterSelect name="city" placeholder="Все города" options={CITIES} current={params.city} />
            <FilterSelect name="utm" placeholder="Все источники" options={UTMS} current={params.utm} />
          </div>
        </div>

        {/* Metrics */}
        <MetricsCards orders={orders} />

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-white p-4">
            <h2 className="mb-4 font-semibold">Заказы по датам</h2>
            <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded" />}>
              <OrdersChart orders={orders} />
            </Suspense>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <h2 className="mb-4 font-semibold">По источникам (UTM)</h2>
            <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded" />}>
              <UtmBreakdown orders={orders} />
            </Suspense>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-4 font-semibold">
            Все заказы <span className="text-muted-foreground font-normal">({orders.length})</span>
          </h2>
          <OrdersTable orders={orders} />
        </div>

      </div>
    </main>
  )
}

function FilterSelect({
  name, placeholder, options, current,
}: {
  name: string; placeholder: string; options: string[]; current?: string
}) {
  return (
    <form>
      <Select name={name} defaultValue={current ?? 'all'}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{placeholder}</SelectItem>
          {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </form>
  )
}
