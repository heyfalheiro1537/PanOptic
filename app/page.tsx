"use client"
import { KpiTiles } from "@/components/kpi-tiles"
import { TrendChart } from "@/components/trend-chart"
import { CategoryBreakdown } from "@/components/category-breakdown"
import { TopServicesTable } from "@/components/top-services-table"

export default function DashboardPage() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your tech infrastructure spending and trends</p>
            </div>

            <KpiTiles />

            <div className="grid gap-6 lg:grid-cols-2">
                <TrendChart />
                <CategoryBreakdown />
            </div>

            <TopServicesTable />
        </div>
    )
}
