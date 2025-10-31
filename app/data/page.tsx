"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UploadCsv } from "@/components/upload-csv"
import { useData } from "@/lib/data-context"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function DataPage() {
  const { events } = useData()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  // Reset to page 1 when events data changes (new CSV loaded)
  useEffect(() => {
    setCurrentPage(1)
  }, [events.length])

  // Calculate pagination
  const totalPages = Math.ceil(events.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedEvents = events.slice(startIndex, endIndex).reverse()

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
        <p className="text-muted-foreground">View and manage your expense data</p>
      </div>

      <UploadCsv />

      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>
            Showing {startIndex + 1}-{Math.min(endIndex, events.length)} of {events.length} expense events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              {paginatedEvents.map((event) => {
                const date = new Date(event.date)
                const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
                return (
                  <TableRow key={event.id}>
                    <TableCell className="font-mono text-xs">{formattedDate}</TableCell>
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
                )
              })}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
