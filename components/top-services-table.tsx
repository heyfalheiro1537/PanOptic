"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/lib/data-context"

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
            {topServices.map((service, index) => {
              const totalSpend = serviceData.reduce((sum, s) => sum + s.amountUsd, 0)
              const percentage = (service.amountUsd / totalSpend) * 100

              return (
                <TableRow key={service.service}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
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
