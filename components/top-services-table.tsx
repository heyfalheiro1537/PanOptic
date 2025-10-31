"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useData } from "@/lib/data-context"
import Image from "next/image"

// Map service names to their logo icons
const serviceIcons: Record<string, string> = {
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
