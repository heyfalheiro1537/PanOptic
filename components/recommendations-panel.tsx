"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, TrendingDown } from "lucide-react"
import { useData } from "@/lib/data-context"

export function RecommendationsPanel() {
  const { recommendations } = useData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Optimization</CardTitle>
        <CardDescription>AI-powered recommendations to reduce spend</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recommendations at this time</p>
        ) : (
          recommendations.map((rec) => (
            <div key={rec.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-accent mt-0.5" />
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-sm">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  {rec.potentialSavings && (
                    <div className="flex items-center gap-1 text-sm text-accent font-medium">
                      <TrendingDown className="h-4 w-4" />
                      Potential savings: ${rec.potentialSavings.toLocaleString()}/mo
                    </div>
                  )}
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full bg-transparent">
                {rec.action}
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
