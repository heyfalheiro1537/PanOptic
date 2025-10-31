"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TrendingDown, ArrowRight, CheckCircle2, Info } from "lucide-react"
import { useData } from "@/lib/data-context"
import type { Recommendation } from "@/lib/types"

// Extended details for each recommendation
const getRecommendationDetails = (rec: Recommendation) => {
  const details: Record<string, { impact: string; steps: string[]; timeline: string }> = {
    r1: {
      impact: "Enterprise AI plans typically offer 20-30% cost savings at scale, plus priority support and dedicated infrastructure.",
      steps: [
        "Review current token usage patterns and peak demand",
        "Compare enterprise pricing tiers from multiple providers",
        "Calculate ROI based on your usage projections",
        "Schedule a demo with sales team for custom pricing",
        "Plan migration timeline with minimal service disruption"
      ],
      timeline: "Implementation: 1-2 weeks after approval"
    },
    r2: {
      impact: "Right-sizing instances can reduce EC2 costs by 15-40% while maintaining performance. This is one of the quickest wins in cloud optimization.",
      steps: [
        "Analyze CloudWatch metrics for CPU, memory, and network utilization",
        "Identify over-provisioned instances running below 40% capacity",
        "Test workload on smaller instance types in staging environment",
        "Implement auto-scaling for variable workloads",
        "Schedule instances to stop during non-business hours"
      ],
      timeline: "Quick wins within 1 week, full optimization in 2-3 weeks"
    },
    r3: {
      impact: "Unused or underutilized seats can cost $20-50/month each. Regular audits ensure you're only paying for active team members.",
      steps: [
        "Review last login dates for all users across platforms",
        "Identify inactive accounts (no activity in 30+ days)",
        "Contact team leads to confirm who needs continued access",
        "Remove or downgrade unused seats",
        "Set up quarterly access reviews to prevent future waste"
      ],
      timeline: "Can be completed within 2-3 days"
    },
    r4: {
      impact: "Reserved capacity offers 30-50% savings for predictable database workloads. Ideal for production environments with steady usage.",
      steps: [
        "Analyze database utilization trends over the past 3 months",
        "Identify stable workloads suitable for reserved capacity",
        "Compare 1-year vs 3-year reserved pricing options",
        "Calculate break-even point for your usage patterns",
        "Purchase reserved capacity during next billing cycle"
      ],
      timeline: "Savings begin immediately after reservation purchase"
    }
  }

  return details[rec.id] || {
    impact: rec.description,
    steps: ["Contact our support team for personalized recommendations"],
    timeline: "Varies by implementation"
  }
}

export function CostOptimizationSection() {
  const { recommendations } = useData()
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Sort recommendations by potential savings (highest first)
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const savingsA = a.potentialSavings || 0
    const savingsB = b.potentialSavings || 0
    return savingsB - savingsA
  })

  // Calculate total potential savings
  const totalSavings = recommendations.reduce((sum, rec) => sum + (rec.potentialSavings || 0), 0)

  const handleOpenDialog = (rec: Recommendation) => {
    setSelectedRecommendation(rec)
    setDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Cost Optimization Opportunities
            </CardTitle>
            <CardDescription className="mt-1.5">
              {totalSavings > 0 
                ? `Potential monthly savings: $${totalSavings.toLocaleString()}`
                : 'AI-powered recommendations to optimize your spending'}
            </CardDescription>
          </div>
          {totalSavings > 0 && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-950">
              <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div className="text-right">
                <p className="text-xs text-green-700 dark:text-green-300 font-medium">Total Savings</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                  ${totalSavings.toLocaleString()}<span className="text-xs font-normal">/mo</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {sortedRecommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <TrendingDown className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No optimization recommendations</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Your spending patterns look efficient. We'll notify you if we identify any cost-saving opportunities.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sortedRecommendations.map((rec) => (
                <Card key={rec.id} className="border-2 hover:border-primary/50 transition-colors flex flex-col">
                  <CardContent className="pt-6 flex flex-col flex-1">
                    <div className="flex flex-col gap-4 flex-1">
                      {/* Savings Badge */}
                      {rec.potentialSavings && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 self-start">
                          <TrendingDown className="h-3.5 w-3.5" />
                          <span className="text-sm font-semibold">
                            ${rec.potentialSavings.toLocaleString()}/mo
                          </span>
                        </div>
                      )}

                      {/* Title and Description */}
                      <div className="space-y-2 flex-1">
                        <h4 className="font-semibold text-base leading-tight">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {rec.description}
                        </p>
                      </div>

                      {/* Action Button */}
                      <Button 
                        size="sm" 
                        className="w-full group mt-auto"
                        variant="default"
                        onClick={() => handleOpenDialog(rec)}
                      >
                        {rec.action}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Details Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                {selectedRecommendation && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="text-xl flex items-start gap-3">
                        {selectedRecommendation.title}
                      </DialogTitle>
                      <DialogDescription className="text-base pt-2">
                        {selectedRecommendation.description}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 pt-4">
                      {/* Potential Savings */}
                      {selectedRecommendation.potentialSavings && (
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                            <TrendingDown className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Potential Monthly Savings</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              ${selectedRecommendation.potentialSavings.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Impact */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <h3 className="font-semibold text-base">Impact & Benefits</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {getRecommendationDetails(selectedRecommendation).impact}
                        </p>
                      </div>

                      {/* Implementation Steps */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <h3 className="font-semibold text-base">Implementation Steps</h3>
                        </div>
                        <ol className="space-y-2">
                          {getRecommendationDetails(selectedRecommendation).steps.map((step, idx) => (
                            <li key={idx} className="flex gap-3 text-sm">
                              <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                                {idx + 1}
                              </span>
                              <span className="text-muted-foreground leading-relaxed pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Timeline */}
                      <div className="p-4 rounded-lg bg-muted/50 border">
                        <p className="text-sm font-semibold mb-1">Timeline</p>
                        <p className="text-sm text-muted-foreground">
                          {getRecommendationDetails(selectedRecommendation).timeline}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="flex gap-3 pt-2">
                        <Button 
                          className="flex-1"
                          onClick={() => {
                            setDialogOpen(false)
                            // In a real app, this would navigate or trigger an action
                          }}
                        >
                          {selectedRecommendation.action}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setDialogOpen(false)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  )
}

