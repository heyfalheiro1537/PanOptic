"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useMemo, useRef, useEffect } from "react"
import type { Category, ExpenseEvent } from "@/lib/types"

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
  const [expandedCategories, setExpandedCategories] = useState<Set<Category>>(new Set())
  const cardRefs = useRef<Map<Category, HTMLDivElement>>(new Map())

  const categoryData = useMemo(() => aggregateCategoryData(events), [events])
  const serviceData = useMemo(() => aggregateServiceData(events), [events])

  const toggleCategory = (category: Category) => {
    const isCurrentlyExpanded = expandedCategories.has(category)
    
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  
    // Scroll into view when expanding (not when collapsing)
    if (!isCurrentlyExpanded) {
      setTimeout(() => {
        const cardElement = cardRefs.current.get(category)
        if (cardElement) {
          const rect = cardElement.getBoundingClientRect()
          const padding = 24 // pixels of padding
          const isBottomVisible = rect.bottom <= window.innerHeight - padding
    
          if (!isBottomVisible) {
            const targetScroll = window.scrollY + (rect.bottom - window.innerHeight) + padding
    
            window.scrollTo({
              top: targetScroll,
              behavior: "smooth",
            })
          }
        }
      }, 100)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground">View expenses organized by category and service</p>
      </div>

      <div className="grid gap-4 max-w-5xl mx-auto">
        {categoryData.map((cat) => {
          const isExpanded = expandedCategories.has(cat.category)
          const servicesInCategory = serviceData.filter((s) => s.category === cat.category)

          const trend = cat.trend > 0 ? "up" : "down"
          const TrendIcon = trend === "up" ? TrendingUp : TrendingDown

          return (
            <Card 
              key={cat.category} 
              className="overflow-hidden"
              ref={(el) => {
                if (el) {
                  cardRefs.current.set(cat.category, el)
                } else {
                  cardRefs.current.delete(cat.category)
                }
              }}
            >
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors py-7 mr-2"
                onClick={() => toggleCategory(cat.category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-2xl mr-2">{cat.category}</CardTitle>
                      <p className="text-base text-muted-foreground mt-1">
                        {servicesInCategory.length} service{servicesInCategory.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold">${cat.total.toLocaleString()}</div>
                      <div
                        className={`flex items-center gap-1 text-base ${trend === "up" ? "text-red-500" : "text-green-500"}`}
                      >
                        <TrendIcon className="h-4 w-4" />
                        {Math.abs(cat.trend).toFixed(1)}%
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0 pb-0">
                  <div className="border-t">
                    <div className="divide-y divide-border">
                      {servicesInCategory.map((service) => {
                        const serviceTrend = service.trend > 0 ? "up" : "down"
                        const ServiceTrendIcon = serviceTrend === "up" ? TrendingUp : TrendingDown

                        return (
                          <div
                            key={service.service}
                            className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={serviceLogos[service.service] || "/placeholder.svg"}
                                alt={service.service}
                                className="h-8 w-8 rounded"
                              />
                              <div>
                                <div className="font-medium text-base">{service.service}</div>
                                <div className="text-sm text-muted-foreground capitalize">
                                  {service.pricingModel} pricing
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-lg">${service.total.toLocaleString()}</div>
                              <div
                                className={`flex items-center justify-end gap-1 text-sm ${serviceTrend === "up" ? "text-red-500" : "text-green-500"}`}
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
