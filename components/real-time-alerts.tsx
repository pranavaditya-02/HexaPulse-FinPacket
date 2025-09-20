"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, X, Eye, EyeOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Alert {
  id: string
  type: "price" | "volume" | "news" | "technical"
  title: string
  message: string
  severity: "high" | "medium" | "low"
  symbol?: string
  timestamp: Date
  read: boolean
  dismissed: boolean
}

const generateAlert = (): Alert => {
  const types = ["price", "volume", "news", "technical"] as const
  const severities = ["high", "medium", "low"] as const
  const symbols = ["AAPL", "TSLA", "NVDA", "GOOGL", "MSFT"]

  const alertTemplates = {
    price: {
      titles: ["Price Alert Triggered", "Significant Price Movement", "Price Target Reached"],
      messages: [
        "Stock price has moved beyond your set threshold",
        "Unusual price volatility detected",
        "Price target has been reached",
      ],
    },
    volume: {
      titles: ["Volume Spike Detected", "Unusual Trading Activity", "Volume Alert"],
      messages: [
        "Trading volume is 3x above average",
        "Unusual trading activity detected",
        "Volume spike may indicate news",
      ],
    },
    news: {
      titles: ["Breaking News Alert", "Market Moving News", "Company Announcement"],
      messages: [
        "Breaking news may impact stock price",
        "Earnings announcement released",
        "Regulatory news affecting sector",
      ],
    },
    technical: {
      titles: ["Technical Indicator Alert", "Chart Pattern Detected", "Support/Resistance Break"],
      messages: ["RSI indicates oversold condition", "Bullish chart pattern forming", "Key support level broken"],
    },
  }

  const type = types[Math.floor(Math.random() * types.length)]
  const severity = severities[Math.floor(Math.random() * severities.length)]
  const symbol = symbols[Math.floor(Math.random() * symbols.length)]
  const template = alertTemplates[type]

  return {
    id: Date.now().toString() + Math.random(),
    type,
    title: template.titles[Math.floor(Math.random() * template.titles.length)],
    message: template.messages[Math.floor(Math.random() * template.messages.length)],
    severity,
    symbol: Math.random() > 0.3 ? symbol : undefined,
    timestamp: new Date(),
    read: false,
    dismissed: false,
  }
}

export function RealTimeAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [showDismissed, setShowDismissed] = useState(false)

  useEffect(() => {
    // Generate initial alerts
    const initialAlerts = Array.from({ length: 5 }, generateAlert)
    setAlerts(initialAlerts)

    // Simulate real-time alerts
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of new alert every 10 seconds
        const newAlert = generateAlert()
        setAlerts((prev) => [newAlert, ...prev].slice(0, 20)) // Keep only latest 20

        // Show toast notification for high severity alerts
        if (newAlert.severity === "high") {
          toast({
            title: newAlert.title,
            description: `${newAlert.symbol ? `${newAlert.symbol}: ` : ""}${newAlert.message}`,
            variant: "destructive",
          })
        }
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const markAsRead = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)))
  }

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, dismissed: true } : alert)))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-destructive text-destructive bg-destructive/10"
      case "medium":
        return "border-secondary text-secondary bg-secondary/10"
      case "low":
        return "border-muted-foreground text-muted-foreground bg-muted/10"
      default:
        return "border-muted-foreground text-muted-foreground bg-muted/10"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "price":
        return "💰"
      case "volume":
        return "📊"
      case "news":
        return "📰"
      case "technical":
        return "📈"
      default:
        return "🔔"
    }
  }

  const visibleAlerts = showDismissed ? alerts : alerts.filter((alert) => !alert.dismissed)
  const unreadCount = alerts.filter((alert) => !alert.read && !alert.dismissed).length

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary" />
            <span>Real-Time Alerts</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDismissed(!showDismissed)}
            className="flex items-center space-x-1"
          >
            {showDismissed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showDismissed ? "Hide" : "Show"} Dismissed</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {visibleAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No alerts to display</p>
          </div>
        ) : (
          visibleAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border transition-all ${
                alert.dismissed ? "opacity-50" : ""
              } ${alert.read ? "glass" : "glass-strong"} ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between space-x-3">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-lg">{getTypeIcon(alert.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm">{alert.title}</h4>
                      {alert.symbol && (
                        <Badge variant="outline" className="text-xs">
                          {alert.symbol}
                        </Badge>
                      )}
                      {!alert.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{alert.timestamp.toLocaleTimeString()}</span>
                      <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {!alert.read && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(alert.id)}>
                      <Eye className="w-3 h-3" />
                    </Button>
                  )}
                  {!alert.dismissed && (
                    <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)}>
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
