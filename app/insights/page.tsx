"use client"

import { AlertsPanel } from "@/components/alerts-panel"
import { RecommendationsPanel } from "@/components/recommendations-panel"
import { BudgetCard } from "@/components/budget-card"

export default function InsightsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Insights & Alerts</h1>
        <p className="text-muted-foreground">AI-powered analysis and cost optimization recommendations</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <AlertsPanel />
          <BudgetCard />
        </div>
        <RecommendationsPanel />
      </div>
    </div>
  )
}
