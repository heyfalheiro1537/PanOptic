"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, DollarSign, AlertCircle } from "lucide-react"
import { useData } from "@/lib/data-context"

export function SpendSummaryHeader() {
  const { categoryData, totalBudget, monthProjection } = useData()
  
  // Calculate total actual spend
  const totalSpend = categoryData.reduce((sum, cat) => sum + cat.amountUsd, 0)
  
  // Calculate percent over budget
  const percentOfBudget = (totalSpend / totalBudget) * 100
  const overBudget = totalSpend - totalBudget
  const isOverBudget = overBudget > 0

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Spend */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Spend (MTD)</p>
              <h3 className="text-3xl font-bold tracking-tight">
                ${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </h3>
              <p className="text-xs text-muted-foreground pt-1">
                Projected: ${monthProjection.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mo
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Budget */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Monthly Budget</p>
              <h3 className="text-3xl font-bold tracking-tight">
                ${totalBudget.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </h3>
              <p className="text-xs text-muted-foreground pt-1">
                Remaining: ${Math.max(0, totalBudget - totalSpend).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Status */}
      <Card className={`border-2 ${isOverBudget ? 'border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20' : 'border-green-200 dark:border-green-900'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Budget Status</p>
              <h3 className={`text-3xl font-bold tracking-tight ${isOverBudget ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                {isOverBudget ? '+' : ''}{percentOfBudget.toFixed(1)}%
              </h3>
              <p className="text-xs text-muted-foreground pt-1">
                {isOverBudget 
                  ? `Over by $${overBudget.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                  : 'Within budget'}
              </p>
            </div>
            <div className={`h-12 w-12 rounded-full ${isOverBudget ? 'bg-orange-100 dark:bg-orange-950' : 'bg-green-100 dark:bg-green-950'} flex items-center justify-center`}>
              <AlertCircle className={`h-6 w-6 ${isOverBudget ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

