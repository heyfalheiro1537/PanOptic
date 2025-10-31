import { SpendSummaryHeader } from "@/components/insights/spend-summary-header"
import { CriticalAlertsSection } from "@/components/insights/critical-alerts-section"
import { BudgetStatusSimplified } from "@/components/insights/budget-status-simplified"
import { CostOptimizationSection } from "@/components/insights/cost-optimization-section"

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