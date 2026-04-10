# GBC Analytics Dashboard

Мини-дашборд заказов: RetailCRM → Supabase → Next.js → Vercel + Telegram-уведомления.

**Живой дашборд:** https://gbc-dashboard-sky.vercel.app

## Стек

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + **shadcn/ui**
- **Recharts** — графики
- **Supabase** — база данных (PostgreSQL)
- **Vercel** — хостинг + Cron Jobs
- **RetailCRM** — источник заказов
- **Telegram Bot API** — уведомления

## Что умеет

- Показывает 4 метрики: количество заказов, выручку, средний чек, крупные заказы (>50 000 ₸)
- Линейный график заказов по датам
- Bar chart по UTM-источникам
- Таблица всех заказов с фильтрами по городу и UTM
- Telegram-уведомление при заказе свыше 50 000 ₸

## Запуск локально

```bash
npm install
cp .env.example .env.local
# заполни .env.local своими ключами
npm run dev
```

## Загрузка тестовых заказов в RetailCRM

```bash
npm run load-orders
```

## Ручной запуск синхронизации

```bash
curl.exe -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.vercel.app/api/sync
curl.exe -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.vercel.app/api/notify
```

---

## Как я это делал — Claude Code CLI

Задание выполнено с помощью **Claude Code CLI** (AI-инструмент от Anthropic).

### Промпты которые я давал

1. **Первый промпт — опрос и спецификация:**
   > "Мы делали тестовое задание https://github.com/ruslangbc-code/gbc-analytics-dashboard"
   
   Claude прочитал README задания, провёл опрос через brainstorming skill, собрал требования и составил полный design spec с архитектурой, схемой БД, структурой файлов.

2. **Второй промпт — план реализации:**
   > "Составь план реализации"
   
   Claude написал пошаговый план на 12 задач с конкретными командами, кодом и проверками для каждого шага.

3. **Третий промпт — реализация:**
   > "с 1" (начать с Task 1)
   
   Claude автоматически выполнил все задачи: создал Next.js проект, написал все файлы (lib клиенты, API routes, UI компоненты), прогнал тесты, починил TypeScript ошибки.

### Где застрял и как решил

**1. Ошибка `ts-node` с ESM:**
```
TypeError: Unknown file extension ".ts"
```
Next.js 14 использует ESM модули, а `ts-node` с ними не совместим. Claude заменил на `tsx` — он работает без настроек.

**2. `orderType: "eshop-individual"` не существует в RetailCRM:**
```
"OrderType" with "code"="eshop-individual" does not exist
```
В демо-аккаунте RetailCRM есть только тип `main`. Claude запросил список доступных типов через API и заменил значение в скрипте.

**3. `curl` в PowerShell не отправляет заголовки:**
```
{"error":"Unauthorized"}
```
В Windows PowerShell `curl` — это псевдоним для `Invoke-WebRequest`, он игнорирует флаг `-H`. Решение: использовать `curl.exe` вместо `curl`.

**4. Environment Variables не добавились на Vercel:**
```
"Failed to parse URL from undefined/api/v5/orders"
```
При деплое env vars нужно добавлять вручную в Settings → Environment Variables. После добавления — Redeploy.

**5. Cron каждые 5 минут недоступен на бесплатном плане Vercel:**
```
Hobby accounts are limited to daily cron jobs
```
Изменили расписание с `*/5 * * * *` на `0 9 * * *` (раз в день в 9:00).
