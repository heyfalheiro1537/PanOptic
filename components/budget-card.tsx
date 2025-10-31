"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useData } from "@/lib/data-context"
import { categoryBudgetsUsd } from "@/lib/budgets"

export function BudgetCard() {
  const { categoryData, totalBudget } = useData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Status</CardTitle>
        <CardDescription>Category-level budget utilization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoryData.map((cat) => {
          const budget = categoryBudgetsUsd[cat.category]
          const percentage = (cat.amountUsd / budget) * 100
          const isOverBudget = percentage > 100

          return (
            <div key={cat.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{cat.category}</span>
                <span className={isOverBudget ? "text-destructive font-semibold" : "text-muted-foreground"}>
                  ${Math.round(cat.amountUsd).toLocaleString()} / ${budget.toLocaleString()}
                </span>
              </div>
              <Progress value={Math.min(percentage, 100)} className={isOverBudget ? "[&>div]:bg-destructive" : ""} />
              <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% utilized</p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
