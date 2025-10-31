"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { aggregateByService } from "@/lib/aggregate"
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Model mapping for AI services
const modelMapping: Record<string, string[]> = {
  "OpenAI GPT-4": ["GPT-4", "GPT-4 Turbo", "GPT-4o"],
  "Anthropic Claude": ["Claude 3.5 Sonnet", "Claude 3 Opus", "Claude 3 Haiku"],
}

export default function AITokensPage() {
  const { expenses } = useData()

  // Filter only AI services
  const aiExpenses = expenses.filter((e) => e.category === "AI Tokens / APIs")

  const serviceData = aggregateByService(aiExpenses)

  // Calculate total tokens and costs
  const totalTokens = aiExpenses.reduce((sum, e) => sum + (Number(e.meta?.tokens) || 0), 0)
  const totalCost = aiExpenses.reduce((sum, e) => sum + e.amountUsd, 0)
  const costPer1MTokens = totalTokens > 0 ? (totalCost / totalTokens) * 1_000_000 : 0

  // Prepare trend data (last 30 days)
  const last30Days = aiExpenses.filter((e) => {
    const expenseDate = new Date(e.date)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return expenseDate >= thirtyDaysAgo
  })

  const dailyData = last30Days.reduce(
    (acc, expense) => {
      const date = new Date(expense.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      if (!acc[date]) {
        acc[date] = { date, tokens: 0, cost: 0 }
      }
      acc[date].tokens += Number(expense.meta?.tokens) || 0
      acc[date].cost += expense.amountUsd
      return acc
    },
    {} as Record<string, { date: string; tokens: number; cost: number }>,
  )

  const chartData = Object.values(dailyData).slice(-30)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Token Usage</h1>
        </div>
        <p className="text-muted-foreground">Monitor your AI API consumption and costs by model</p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tokens Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(totalTokens / 1_000_000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground mt-1">Last 90 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total AI Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 90 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cost per 1M Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${costPer1MTokens.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Average rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Token Usage Trend */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Token Usage Trend (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              tokens: {
                label: "Tokens",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="tokens" stroke="var(--color-tokens)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Model Breakdown */}
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold">Models</h2>
        {serviceData.map((service) => {
          const models = modelMapping[service.service] || []
          const trend = service.trend > 0 ? "up" : "down"
          const TrendIcon = trend === "up" ? TrendingUp : TrendingDown

          // Calculate tokens for this service
          const serviceExpenses = aiExpenses.filter((e) => e.service === service.service)
          const serviceTokens = serviceExpenses.reduce((sum, e) => sum + (Number(e.meta?.tokens) || 0), 0)

          return (
            <Card key={service.service}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{service.service}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{models.join(", ")}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${service.total.toLocaleString()}</div>
                    <div
                      className={`flex items-center gap-1 text-sm ${trend === "up" ? "text-red-500" : "text-green-500"}`}
                    >
                      <TrendIcon className="h-3 w-3" />
                      {Math.abs(service.trend).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Tokens Used</div>
                    <div className="text-xl font-semibold">{(serviceTokens / 1_000_000).toFixed(2)}M</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Cost per 1M</div>
                    <div className="text-xl font-semibold">
                      ${serviceTokens > 0 ? ((service.total / serviceTokens) * 1_000_000).toFixed(2) : "0.00"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
