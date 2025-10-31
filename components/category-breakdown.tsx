"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useData } from "@/lib/data-context"
import { categoryBudgetsUsd } from "@/lib/budgets"

export function CategoryBreakdown() {
    const { categoryData } = useData()

    const chartData = categoryData.map((d) => ({
        category: d.category.replace(" / ", "/\n"),
        Spend: Math.round(d.amountUsd),
        Budget: categoryBudgetsUsd[d.category],
    }))

    return (
        <Card>
            <CardHeader>
                <CardTitle>Spend by Category</CardTitle>
                <CardDescription>Current spend vs budget allocation</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis
                            dataKey="category"
                            className="text-xs"
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                            angle={-15}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis
                            className="text-xs"
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                            tickFormatter={(value) => `$${value}`}
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
                            cursor={{ fillOpacity: 0.4 }}
                        />
                        <Bar dataKey="Spend" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Budget" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}