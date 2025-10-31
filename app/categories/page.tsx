"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useMemo } from "react"
import type { Category, ExpenseEvent } from "@/lib/types"

const categoryIcons: Record<Category, string> = {
  Infrastructure: "🏗️",
  "AI Tokens / APIs": "🤖",
  "Hosting & DevOps": "🚀",
  "Third-Party Tools": "🔧",
}

const serviceLogos: Record<string, string> = {
  "AWS EC2": "https://img.logo.dev/aws.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
  "AWS S3": "https://img.logo.dev/aws.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
  "OpenAI GPT-4": "https://img.logo.dev/chatgpt.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
  "Anthropic Claude": "https://img.logo.dev/anthropic.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
  Vercel: "https://img.logo.dev/v0.dev?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
  Datadog: "https://img.logo.dev/datadoghq.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
  GitHub: "https://img.logo.dev/github.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
  Stripe: "https://img.logo.dev/stripe.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
  "MongoDB Atlas": "https://img.logo.dev/mongodb.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
  Cloudflare: "https://img.logo.dev/cloudflare.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
}

function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

function aggregateCategoryData(events: ExpenseEvent[]) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const currentPeriod = events.filter((e) => new Date(e.date) >= thirtyDaysAgo)
  const previousPeriod = events.filter((e) => new Date(e.date) >= sixtyDaysAgo && new Date(e.date) < thirtyDaysAgo)

  const categoryMap = new Map<Category, { current: number; previous: number }>()

  currentPeriod.forEach((event) => {
    const data = categoryMap.get(event.category) || { current: 0, previous: 0 }
    data.current += event.amountUsd
    categoryMap.set(event.category, data)
  })

  previousPeriod.forEach((event) => {
    const data = categoryMap.get(event.category) || { current: 0, previous: 0 }
    data.previous += event.amountUsd
    categoryMap.set(event.category, data)
  })

  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      total: data.current,
      trend: calculateTrend(data.current, data.previous),
    }))
    .sort((a, b) => b.total - a.total)
}

function aggregateServiceData(events: ExpenseEvent[]) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const currentPeriod = events.filter((e) => new Date(e.date) >= thirtyDaysAgo)
  const previousPeriod = events.filter((e) => new Date(e.date) >= sixtyDaysAgo && new Date(e.date) < thirtyDaysAgo)

  const serviceMap = new Map<string, { current: number; previous: number; category: Category; pricingModel: string }>()

  currentPeriod.forEach((event) => {
    const data = serviceMap.get(event.service) || {
      current: 0,
      previous: 0,
      category: event.category,
      pricingModel: event.pricingModel,
    }
    data.current += event.amountUsd
    serviceMap.set(event.service, data)
  })

  previousPeriod.forEach((event) => {
    const data = serviceMap.get(event.service) || {
      current: 0,
      previous: 0,
      category: event.category,
      pricingModel: event.pricingModel,
    }
    data.previous += event.amountUsd
    serviceMap.set(event.service, data)
  })

  return Array.from(serviceMap.entries())
    .map(([service, data]) => ({
      service,
      total: data.current,
      trend: calculateTrend(data.current, data.previous),
      category: data.category,
      pricingModel: data.pricingModel,
    }))
    .sort((a, b) => b.total - a.total)
}

export default function CategoriesPage() {
  const { events } = useData()
  const [expandedCategory, setExpandedCategory] = useState<Category | null>(null)

  const categoryData = useMemo(() => aggregateCategoryData(events), [events])
  const serviceData = useMemo(() => aggregateServiceData(events), [events])

  const toggleCategory = (category: Category) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground">View expenses organized by category and service</p>
      </div>

      <div className="grid gap-4">
        {categoryData.map((cat) => {
          const isExpanded = expandedCategory === cat.category
          const servicesInCategory = serviceData.filter((s) => s.category === cat.category)

          const trend = cat.trend > 0 ? "up" : "down"
          const TrendIcon = trend === "up" ? TrendingUp : TrendingDown

          return (
            <Card key={cat.category} className="overflow-hidden">
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleCategory(cat.category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{categoryIcons[cat.category]}</span>
                    <div>
                      <CardTitle className="text-xl">{cat.category}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {servicesInCategory.length} service{servicesInCategory.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold">${cat.total.toLocaleString()}</div>
                      <div
                        className={`flex items-center gap-1 text-sm ${trend === "up" ? "text-red-500" : "text-green-500"}`}
                      >
                        <TrendIcon className="h-3 w-3" />
                        {Math.abs(cat.trend).toFixed(1)}%
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      {servicesInCategory.map((service) => {
                        const serviceTrend = service.trend > 0 ? "up" : "down"
                        const ServiceTrendIcon = serviceTrend === "up" ? TrendingUp : TrendingDown

                        return (
                          <div
                            key={service.service}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={serviceLogos[service.service] || "/placeholder.svg"}
                                alt={service.service}
                                className="h-6 w-6 rounded"
                              />
                              <div>
                                <div className="font-medium">{service.service}</div>
                                <div className="text-xs text-muted-foreground capitalize">
                                  {service.pricingModel} pricing
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">${service.total.toLocaleString()}</div>
                              <div
                                className={`flex items-center gap-1 text-xs ${serviceTrend === "up" ? "text-red-500" : "text-green-500"}`}
                              >
                                <ServiceTrendIcon className="h-3 w-3" />
                                {Math.abs(service.trend).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
