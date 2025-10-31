import type { ExpenseEvent } from "./types"

// Generate 90 days of mock expense data
export const mockExpenses: ExpenseEvent[] = []

const services = [
  { name: "AWS EC2", category: "Infrastructure" as const, pricingModel: "usage" as const, baseAmount: 800 },
  { name: "AWS S3", category: "Infrastructure" as const, pricingModel: "usage" as const, baseAmount: 200 },
  { name: "OpenAI GPT-4", category: "AI Tokens / APIs" as const, pricingModel: "usage" as const, baseAmount: 1200 },
  { name: "Anthropic Claude", category: "AI Tokens / APIs" as const, pricingModel: "usage" as const, baseAmount: 600 },
  { name: "Vercel", category: "Hosting & DevOps" as const, pricingModel: "seat" as const, baseAmount: 400 },
  { name: "Datadog", category: "Third-Party Tools" as const, pricingModel: "tiered" as const, baseAmount: 900 },
  { name: "GitHub", category: "Third-Party Tools" as const, pricingModel: "seat" as const, baseAmount: 300 },
  { name: "Stripe", category: "Third-Party Tools" as const, pricingModel: "usage" as const, baseAmount: 150 },
  { name: "MongoDB Atlas", category: "Infrastructure" as const, pricingModel: "tiered" as const, baseAmount: 500 },
  { name: "Cloudflare", category: "Hosting & DevOps" as const, pricingModel: "flat" as const, baseAmount: 200 },
]

const startDate = new Date()
startDate.setDate(startDate.getDate() - 90)

let idCounter = 1

for (let day = 0; day < 90; day++) {
  const currentDate = new Date(startDate)
  currentDate.setDate(currentDate.getDate() + day)

  services.forEach((service) => {
    // Add some randomness and growth trend
    const variance = 0.7 + Math.random() * 0.6 // 70% to 130%
    const growthFactor = 1 + (day / 90) * 0.3 // 30% growth over 90 days
    const amount = service.baseAmount * variance * growthFactor

    mockExpenses.push({
      id: `exp-${idCounter++}`,
      date: currentDate.toISOString(),
      service: service.name,
      amountUsd: Math.round(amount * 100) / 100,
      category: service.category,
      pricingModel: service.pricingModel,
      meta: {
        tokens:
          service.pricingModel === "usage" && service.category === "AI Tokens / APIs"
            ? Math.floor(amount * 1000)
            : undefined,
        seats: service.pricingModel === "seat" ? Math.floor(5 + Math.random() * 3) : undefined,
      },
    })
  })
}
