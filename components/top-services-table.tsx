"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useData } from "@/lib/data-context"
import Image from "next/image"

// Map service names to their logo icons
const serviceIcons: Record<string, string> = {
    "OpenAI GPT-4": "https://cdn.simpleicons.org/openai/412991",
    "Anthropic Claude": "https://cdn.simpleicons.org/anthropic/CC9B7A",
    "AWS EC2": "https://cdn.simpleicons.org/amazonaws/FF9900",
    "AWS S3": "https://cdn.simpleicons.org/amazonaws/FF9900",
    "Datadog": "https://cdn.simpleicons.org/datadog/632CA6",
    "GitHub": "https://cdn.simpleicons.org/github/181717",
    "Stripe": "https://cdn.simpleicons.org/stripe/008CDD",
    "Vercel": "https://cdn.simpleicons.org/vercel/000000",
    "MongoDB Atlas": "https://cdn.simpleicons.org/mongodb/47A248",
    "Cloudflare": "https://cdn.simpleicons.org/cloudflare/F38020",
}

export function TopServicesTable() {
    const { serviceData } = useData()

    const topServices = serviceData.slice(0, 10)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Services</CardTitle>
                <CardDescription>Highest spending services across all categories</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead className="text-right">Total Spend</TableHead>
                            <TableHead className="text-right">% of Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topServices.map((service) => {
                            const totalSpend = serviceData.reduce((sum, s) => sum + s.amountUsd, 0)
                            const percentage = (service.amountUsd / totalSpend) * 100
                            const iconUrl = serviceIcons[service.service]

                            return (
                                <TableRow key={service.service}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            {iconUrl ? (
                                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted p-1">
                                                    <Image
                                                        src={iconUrl}
                                                        alt={`${service.service} icon`}
                                                        width={16}
                                                        height={16}
                                                        className="h-4 w-4"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-6 w-6 rounded-md bg-muted" />
                                            )}
                                            {service.service}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        ${Math.round(service.amountUsd).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground">{percentage.toFixed(1)}%</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
