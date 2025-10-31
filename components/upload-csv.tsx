"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText } from "lucide-react"
import { useData } from "@/lib/data-context"
import type { ExpenseEvent } from "@/lib/types"

export function UploadCsv() {
  const { setEvents } = useData()
  const [fileName, setFileName] = useState<string>("")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split("\n")
      const headers = lines[0].split(",")

      const newEvents: ExpenseEvent[] = []

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue

        const values = lines[i].split(",")
        const event: any = {}

        headers.forEach((header, index) => {
          const key = header.trim()
          const value = values[index]?.trim()

          if (key === "amountUsd") {
            event[key] = Number.parseFloat(value)
          } else {
            event[key] = value
          }
        })

        if (event.id && event.date && event.service) {
          newEvents.push(event as ExpenseEvent)
        }
      }

      if (newEvents.length > 0) {
        setEvents(newEvents)
      }
    }

    reader.readAsText(file)
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
          <div className="space-y-2">
            <p className="text-sm font-medium">Upload expense data</p>
            <p className="text-xs text-muted-foreground">
              CSV format: id, date, service, amountUsd, category, pricingModel
            </p>
          </div>
          <Button asChild>
            <label className="cursor-pointer">
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
              Choose File
            </label>
          </Button>
          {fileName && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              {fileName}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
