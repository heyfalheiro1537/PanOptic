"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/lib/data-context"
import { categoryBudgetsUsd } from "@/lib/budgets"

export function BudgetStatusSimplified() {
  const { categoryData } = useData()

  // Calculate status for each category
  const budgetStatus = categoryData.map((cat) => {
    const budget = categoryBudgetsUsd[cat.category]
    const percentage = (cat.amountUsd / budget) * 100
    
    let status: 'critical' | 'high' | 'ok'
    let icon: string
    let colorClass: string
    
    if (percentage >= 90) {
      status = 'critical'
      icon = '🔴'
      colorClass = 'text-red-600 dark:text-red-400'
    } else if (percentage >= 75) {
      status = 'high'
      icon = '🟠'
      colorClass = 'text-orange-600 dark:text-orange-400'
    } else {
      status = 'ok'
      icon = '🟢'
      colorClass = 'text-green-600 dark:text-green-400'
    }
    
    return {
      category: cat.category,
      spent: cat.amountUsd,
      budget,
      percentage,
      status,
      icon,
      colorClass
    }
  })

  // Sort by percentage (highest first)
  budgetStatus.sort((a, b) => b.percentage - a.percentage)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
        <CardDescription>Category-level spending summary</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {budgetStatus.map((item) => (
            <div 
              key={item.category} 
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xl" role="img" aria-label={item.status}>
                  {item.icon}
                </span>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-medium text-sm">{item.category}</p>
                    <span className={`text-xs font-semibold ${item.colorClass}`}>
                      {item.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      ${item.spent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} of ${item.budget.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span>🟢</span>
              <span>{"<"} 75%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🟠</span>
              <span>75-90%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🔴</span>
              <span>≥ 90%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

