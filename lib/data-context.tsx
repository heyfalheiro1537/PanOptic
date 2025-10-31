"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { ExpenseEvent, Alert, Recommendation } from "./types"
import { mockExpenses } from "./mock-expenses"
import { aggregateByDay, aggregateByCategory, aggregateByService } from "./aggregate"
import { linearProjectionMonth } from "./forecast"
import { generateAlerts } from "./alerts"
import { generateRecommendations } from "./recommendations"
import { getTotalBudget } from "./budgets"

interface DataContextType {
  events: ExpenseEvent[]
  setEvents: (events: ExpenseEvent[]) => void
  alerts: Alert[]
  recommendations: Recommendation[]
  monthProjection: number
  totalBudget: number
  dailyData: Array<{ date: string; amountUsd: number }>
  categoryData: Array<{ category: string; amountUsd: number }>
  serviceData: Array<{ service: string; amountUsd: number }>
  getFilteredEvents: (days: number) => ExpenseEvent[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<ExpenseEvent[]>(mockExpenses)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [monthProjection, setMonthProjection] = useState(0)

  useEffect(() => {
    const dailyData = aggregateByDay(events)
    const projection = linearProjectionMonth(dailyData)
    setMonthProjection(projection)
    setAlerts(generateAlerts(events))
    setRecommendations(generateRecommendations(events))
  }, [events])

  const getFilteredEvents = (days: number) => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return events.filter((e) => new Date(e.date) >= cutoff)
  }

  const dailyData = aggregateByDay(events)
  const categoryData = aggregateByCategory(events)
  const serviceData = aggregateByService(events)

  return (
    <DataContext.Provider
      value={{
        events,
        setEvents,
        alerts,
        recommendations,
        monthProjection,
        totalBudget: getTotalBudget(),
        dailyData,
        categoryData,
        serviceData,
        getFilteredEvents,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within DataProvider")
  }
  return context
}
