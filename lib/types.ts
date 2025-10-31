export type Category = "Infrastructure" | "AI Tokens / APIs" | "Hosting & DevOps" | "Third-Party Tools"

export type PricingModel = "usage" | "seat" | "tiered" | "flat"

export interface ExpenseEvent {
  id: string
  date: string // ISO
  service: string // e.g., AWS EC2, OpenAI, Vercel, Datadog
  amountUsd: number
  category: Category
  pricingModel: PricingModel
  meta?: Record<string, number | string> // seats, tokens, requests, etc.
}

export type Alert = {
  id: string
  type: "budget" | "anomaly" | "plan"
  severity: "low" | "med" | "high"
  message: string
}

export type Recommendation = {
  id: string
  title: string
  description: string
  potentialSavings?: number
  action: string
}
