"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UploadCsv } from "@/components/upload-csv"
import { useData } from "@/lib/data-context"

export default function DataPage() {
  const { events } = useData()

  // Show last 50 events
  const recentEvents = events.slice(-50).reverse()

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
        <p className="text-muted-foreground">View and manage your expense data</p>
      </div>

      <UploadCsv />

      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Last 50 expense events (total: {events.length})</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-mono text-xs">{new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{event.service}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {event.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {event.pricingModel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">${event.amountUsd.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
