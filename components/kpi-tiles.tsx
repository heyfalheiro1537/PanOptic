"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle } from "lucide-react"
import { useData } from "@/lib/data-context"

export function KpiTiles() {
  const { getFilteredEvents, monthProjection, totalBudget, alerts } = useData()

  const last30Days = getFilteredEvents(30)
  const last90Days = getFilteredEvents(90)
  const mtdSpend = last30Days.reduce((sum, e) => sum + e.amountUsd, 0)
  const last90Spend = last90Days.reduce((sum, e) => sum + e.amountUsd, 0)

  const budgetUsage = (mtdSpend / totalBudget) * 100
  const highAlerts = alerts.filter((a) => a.severity === "high").length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">MTD Spend</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${Math.round(mtdSpend).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">{budgetUsage.toFixed(1)}% of monthly budget</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Month Projection</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${Math.round(monthProjection).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {monthProjection > totalBudget ? (
              <span className="text-destructive">Over budget</span>
            ) : (
              <span className="text-accent">Within budget</span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">90-Day Spend</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${Math.round(last90Spend).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Last 90 days total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{alerts.length}</div>
          <p className="text-xs text-muted-foreground">{highAlerts} high priority</p>
        </CardContent>
      </Card>
    </div>
  )
}
