import { categoryBudgetsUsd, getTotalBudget } from "./budgets"
import { aggregateByDay, aggregateByCategory } from "./aggregate"
import { linearProjectionMonth } from "./forecast"
import type { ExpenseEvent, Alert } from "./types"

export function generateAlerts(events: ExpenseEvent[]): Alert[] {
  const alerts: Alert[] = []
  const byDay = aggregateByDay(events)
  const byCat = aggregateByCategory(events)
  const monthProjection = linearProjectionMonth(byDay)
  const monthBudget = getTotalBudget()

  if (monthProjection > monthBudget) {
    alerts.push({
      id: "a1",
      type: "budget",
      severity: "high",
      message: `Projected month spend $${Math.round(monthProjection).toLocaleString()} exceeds total budget $${monthBudget.toLocaleString()}`,
    })
  }

  // Check category budgets
  byCat.forEach(({ category, amountUsd }) => {
    const budget = categoryBudgetsUsd[category]
    if (amountUsd > budget * 0.9) {
      alerts.push({
        id: `cat-${category}`,
        type: "budget",
        severity: amountUsd > budget ? "high" : "med",
        message: `${category} spending at $${Math.round(amountUsd).toLocaleString()} (${Math.round((amountUsd / budget) * 100)}% of budget)`,
      })
    }
  })

  // Simple anomaly: last day > mean + 2*std
  if (byDay.length >= 7) {
    const amounts = byDay.map((d) => d.amountUsd)
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length
    const variance = amounts.reduce((a, b) => a + (b - mean) ** 2, 0) / amounts.length
    const std = Math.sqrt(variance)
    const last = amounts[amounts.length - 1]

    if (last > mean + 2 * std) {
      alerts.push({
        id: "a2",
        type: "anomaly",
        severity: "med",
        message: "Latest daily spend is anomalously high vs baseline",
      })
    }
  }

  // Plan hint example
  const aiSpend = byCat.find((c) => c.category === "AI Tokens / APIs")?.amountUsd ?? 0
  if (aiSpend > 3000) {
    alerts.push({
      id: "a3",
      type: "plan",
      severity: "low",
      message: "Consider enterprise AI token plan to reduce per-token cost",
    })
  }

  return alerts
}
