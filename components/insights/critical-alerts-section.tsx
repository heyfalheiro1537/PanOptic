"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp, AlertCircle, Info, ChevronDown, ChevronUp } from "lucide-react"
import { useData } from "@/lib/data-context"

export function CriticalAlertsSection() {
    const { alerts } = useData()
    const [showAllAlerts, setShowAllAlerts] = useState(false)

    // Filter to only critical/high severity alerts and limit to top 3
    const criticalAlerts = alerts
        .filter((alert) => alert.severity === "high")
        .slice(0, 3)

    // Get alerts to display based on showAllAlerts state
    const displayedAlerts = showAllAlerts ? alerts : criticalAlerts

    // Count total alerts
    const totalAlerts = alerts.length
    const hiddenCount = totalAlerts - criticalAlerts.length

    // Helper functions for alert styling
    const getAlertIcon = (severity: string) => {
        switch (severity) {
            case "high":
                return <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            case "med":
                return <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            default:
                return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        }
    }

    const getAlertClassName = (severity: string) => {
        switch (severity) {
            case "high":
                return "border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20"
            case "med":
                return "border-yellow-200 dark:border-yellow-900 bg-yellow-50/50 dark:bg-yellow-950/20"
            default:
                return "border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20"
        }
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            Critical Alerts
                            {criticalAlerts.length > 0 && (
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-xs font-semibold">
                                    {criticalAlerts.length}
                                </span>
                            )}
                        </CardTitle>
                        <CardDescription className="mt-1.5">
                            High priority issues requiring immediate attention
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {criticalAlerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mb-3">
                            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-sm font-medium">All systems healthy</p>
                        <p className="text-xs text-muted-foreground mt-1">No critical alerts at this time</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {displayedAlerts.map((alert) => (
                                <Alert
                                    key={alert.id}
                                    className={getAlertClassName(alert.severity)}
                                >
                                    {getAlertIcon(alert.severity)}
                                    <AlertDescription className="ml-2 text-sm leading-relaxed">
                                        {alert.message}
                                    </AlertDescription>
                                </Alert>
                            ))}
                        </div>

                        {hiddenCount > 0 && (
                            <div className="pt-2 border-t">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-xs text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowAllAlerts(!showAllAlerts)}
                                >
                                    {showAllAlerts ? (
                                        <>
                                            <ChevronUp className="h-4 w-4 mr-1" />
                                            Show less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="h-4 w-4 mr-1" />
                                            Show {hiddenCount} more {hiddenCount === 1 ? 'alert' : 'alerts'}
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}

