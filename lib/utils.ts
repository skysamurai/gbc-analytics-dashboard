import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ru-RU').replace(/\u00a0/g, '\u0020')} ₸`
}

export function calculateOrderTotal(
  items: Array<{ initialPrice: number; quantity: number }>
): number {
  return items.reduce((sum, item) => sum + item.initialPrice * item.quantity, 0)
}
