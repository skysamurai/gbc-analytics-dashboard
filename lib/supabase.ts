import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { OrderRecord } from './retailcrm'

export type { OrderRecord }

let _supabase: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )
  }
  return _supabase
}

export async function upsertOrders(orders: OrderRecord[]): Promise<void> {
  if (orders.length === 0) return
  const { error } = await getSupabase().from('orders').upsert(orders, { onConflict: 'id' })
  if (error) throw new Error(`Supabase upsert error: ${error.message}`)
}

export async function getOrders(filters: {
  city?: string
  utm_source?: string
} = {}): Promise<OrderRecord[]> {
  let query = getSupabase().from('orders').select('*').order('created_at', { ascending: false })
  if (filters.city) query = query.eq('city', filters.city)
  if (filters.utm_source) query = query.eq('utm_source', filters.utm_source)
  const { data, error } = await query
  if (error) throw new Error(`Supabase select error: ${error.message}`)
  return data ?? []
}

export async function getUnnotifiedBigOrders(): Promise<OrderRecord[]> {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  const { data, error } = await getSupabase()
    .from('orders')
    .select('*')
    .gt('total', 50000)
    .is('notified_at', null)
    .gte('created_at', fiveMinutesAgo)
  if (error) throw new Error(`Supabase query error: ${error.message}`)
  return data ?? []
}

export async function markOrderNotified(id: string): Promise<void> {
  const { error } = await getSupabase()
    .from('orders')
    .update({ notified_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(`Supabase update error: ${error.message}`)
}
