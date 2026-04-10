export async function sendTelegramMessage(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN!
  const chatId = process.env.TELEGRAM_CHAT_ID!
  const url = `https://api.telegram.org/bot${token}/sendMessage`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Telegram API error: ${err}`)
  }
}

export function formatOrderNotification(order: {
  id: string
  customer_name: string | null
  total: number
  city: string | null
  utm_source: string | null
}): string {
  return [
    `🛒 <b>Новый крупный заказ!</b>`,
    ``,
    `📦 Заказ #${order.id}`,
    `👤 ${order.customer_name ?? 'Неизвестно'}`,
    `💰 ${order.total.toLocaleString('ru-RU')} ₸`,
    `🏙 ${order.city ?? 'Не указан'}`,
    `📣 Источник: ${order.utm_source ?? 'не указан'}`,
  ].join('\n')
}
