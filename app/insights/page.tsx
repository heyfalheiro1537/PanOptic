"use client"

import { AlertsPanel } from "@/components/alerts-panel"
import { RecommendationsPanel } from "@/components/recommendations-panel"
import { BudgetCard } from "@/components/budget-card"

export default function InsightsPage() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Page Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Insights & Alerts</h1>
                <p className="text-muted-foreground">AI-powered cost analysis and optimization recommendations</p>
            </div>

            {/* Summary Header */}
            <SpendSummaryHeader />

            {/* Critical Alerts & Budget Status */}
            <div className="grid gap-6 lg:grid-cols-2">
                <CriticalAlertsSection />
                <BudgetStatusSimplified />
            </div>

            {/* Cost Optimization Section */}
            <CostOptimizationSection />
        </div>
    )
}
