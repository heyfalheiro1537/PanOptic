import type { ExpenseEvent, Recommendation } from "./types"
import { aggregateByService, aggregateByCategory } from "./aggregate"

export function generateRecommendations(events: ExpenseEvent[]): Recommendation[] {
  const recommendations: Recommendation[] = []
  const byService = aggregateByService(events)
  const byCat = aggregateByCategory(events)

  // AI Token optimization
  const aiSpend = byCat.find((c) => c.category === "AI Tokens / APIs")?.amountUsd ?? 0
  if (aiSpend > 2500) {
    recommendations.push({
      id: "r1",
      title: "Switch to Enterprise AI Plan",
      description: "Your AI token usage suggests an enterprise plan would be more cost-effective",
      potentialSavings: Math.round(aiSpend * 0.25),
      action: "Compare Plans",
    })
  }

  // Infrastructure optimization
  const ec2Spend = byService.find((s) => s.service === "AWS EC2")?.amountUsd ?? 0
  if (ec2Spend > 1500) {
    recommendations.push({
      id: "r2",
      title: "Rightsize EC2 Instances",
      description: "Analysis shows potential for instance optimization during off-peak hours",
      potentialSavings: Math.round(ec2Spend * 0.15),
      action: "View Instances",
    })
  }

  // Seat-based optimization
  const vercelSpend = byService.find((s) => s.service === "Vercel")?.amountUsd ?? 0
  if (vercelSpend > 500) {
    recommendations.push({
      id: "r3",
      title: "Optimize Seat Allocation",
      description: "Review active seat usage to ensure optimal team plan",
      potentialSavings: Math.round(vercelSpend * 0.2),
      action: "Review Seats",
    })
  }

  // Database optimization
  const mongoSpend = byService.find((s) => s.service === "MongoDB Atlas")?.amountUsd ?? 0
  if (mongoSpend > 800) {
    recommendations.push({
      id: "r4",
      title: "Database Tier Optimization",
      description: "Consider reserved capacity for predictable workloads",
      potentialSavings: Math.round(mongoSpend * 0.3),
      action: "View Options",
    })
  }

  return recommendations
}
