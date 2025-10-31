import type { Category } from "./types"

export const categoryBudgetsUsd: Record<Category, number> = {
  Infrastructure: 15000,
  "AI Tokens / APIs": 4000,
  "Hosting & DevOps": 3000,
  "Third-Party Tools": 5000,
}

export const getTotalBudget = () => {
  return Object.values(categoryBudgetsUsd).reduce((a, b) => a + b, 0)
}
