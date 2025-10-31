"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useData } from "@/lib/data-context"

export function TrendChart() {
    const { dailyData } = useData()

    // Get last 30 days
    const last30Days = dailyData.slice(-30)

    const chartData = last30Days.map((d) => ({
        date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        amount: Math.round(d.amountUsd),
    }))

    return (
        <Card>
            <CardHeader>
                <CardTitle>Daily Spend Trend</CardTitle>
                <CardDescription>Last 30 days of expense data</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis
                            className="text-xs"
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                            tickFormatter={(value) => `$${value}`}
                            domain={[(dataMin: number) => Math.floor(dataMin * 0.9), (dataMax: number) => Math.ceil(dataMax * 1.1)]}
                        />
                        <Tooltip
                            contentStyle={{
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                padding: "12px",
                            }}
                            wrapperStyle={{
                                zIndex: 9999,
                                outline: "none",
                            }}
                            formatter={(value: number) => `$${value.toLocaleString()}`}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="#3b82f6"
                            fillOpacity={0.2}
                            dot={{ fill: "#3b82f6", stroke: "#3b82f6", strokeWidth: 2 }}
                            activeDot={{ fill: "#3b82f6", stroke: "#ffffff", strokeWidth: 3, r: 6 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
