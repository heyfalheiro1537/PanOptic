import type { ExpenseEvent, Category } from "./types"

export function aggregateByDay(events: ExpenseEvent[]) {
  const byDay = new Map<string, number>()

  events.forEach((event) => {
    const date = event.date.split("T")[0]
    byDay.set(date, (byDay.get(date) || 0) + event.amountUsd)
  })

  return Array.from(byDay.entries())
    .map(([date, amountUsd]) => ({ date, amountUsd }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function aggregateByCategory(events: ExpenseEvent[]) {
  const byCategory = new Map<Category, number>()

  events.forEach((event) => {
    byCategory.set(event.category, (byCategory.get(event.category) || 0) + event.amountUsd)
  })

  return Array.from(byCategory.entries())
    .map(([category, amountUsd]) => ({ category, amountUsd }))
    .sort((a, b) => b.amountUsd - a.amountUsd)
}

export function aggregateByService(events: ExpenseEvent[]) {
  const byService = new Map<string, number>()

  events.forEach((event) => {
    byService.set(event.service, (byService.get(event.service) || 0) + event.amountUsd)
  })

  return Array.from(byService.entries())
    .map(([service, amountUsd]) => ({ service, amountUsd }))
    .sort((a, b) => b.amountUsd - a.amountUsd)
}
