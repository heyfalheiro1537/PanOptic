"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, AlertCircle, Info } from "lucide-react"
import { useData } from "@/lib/data-context"

export function AlertsPanel() {
  const { alerts } = useData()

  const getIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "med":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getVariant = (severity: string) => {
    return severity === "high" ? "destructive" : "default"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Alerts</CardTitle>
        <CardDescription>Automated insights and warnings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active alerts</p>
        ) : (
          alerts.map((alert) => (
            <Alert key={alert.id} variant={getVariant(alert.severity)}>
              {getIcon(alert.severity)}
              <AlertDescription className="ml-2">{alert.message}</AlertDescription>
            </Alert>
          ))
        )}
      </CardContent>
    </Card>
  )
}
