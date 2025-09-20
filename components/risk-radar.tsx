import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown, Clock, ExternalLink } from "lucide-react"

interface RiskAlert {
  id: string
  title: string
  description: string
  severity: "high" | "medium" | "low"
  category: "market" | "geopolitical" | "economic" | "company"
  impact: string[]
  timestamp: string
  source: string
}

const riskAlerts: RiskAlert[] = [
  {
    id: "1",
    title: "Supply Chain Disruption Alert",
    description: "Major semiconductor shortage affecting tech companies, particularly Apple and Tesla production lines",
    severity: "high",
    category: "market",
    impact: ["AAPL", "TSLA", "NVDA", "AMD"],
    timestamp: "2 hours ago",
    source: "Reuters",
  },
  {
    id: "2",
    title: "Federal Reserve Policy Shift",
    description: "Unexpected hawkish comments from Fed officials suggest potential for more aggressive rate hikes",
    severity: "medium",
    category: "economic",
    impact: ["Banking Sector", "REITs", "Growth Stocks"],
    timestamp: "4 hours ago",
    source: "Bloomberg",
  },
  {
    id: "3",
    title: "Geopolitical Tensions Rising",
    description: "Trade negotiations stalling, potential impact on international markets and commodity prices",
    severity: "medium",
    category: "geopolitical",
    impact: ["Energy Sector", "Materials", "International ETFs"],
    timestamp: "6 hours ago",
    source: "Financial Times",
  },
  {
    id: "4",
    title: "Earnings Revision Downward",
    description: "Multiple analysts revising Q4 earnings expectations lower for consumer discretionary sector",
    severity: "low",
    category: "market",
    impact: ["Consumer Discretionary", "Retail Stocks"],
    timestamp: "8 hours ago",
    source: "MarketWatch",
  },
]

export function RiskRadar() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive/20 text-destructive border-destructive"
      case "medium":
        return "bg-secondary/20 text-secondary border-secondary"
      case "low":
        return "bg-muted/20 text-muted-foreground border-muted-foreground"
      default:
        return "bg-muted/20 text-muted-foreground border-muted-foreground"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "market":
        return <TrendingDown className="w-4 h-4" />
      case "geopolitical":
        return <AlertTriangle className="w-4 h-4" />
      case "economic":
        return <TrendingDown className="w-4 h-4" />
      case "company":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <span>Risk Radar Alerts</span>
          <Badge variant="outline" className="ml-auto">
            {riskAlerts.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {riskAlerts.map((alert) => (
          <div key={alert.id} className="p-4 rounded-lg glass-strong border-l-4 border-l-destructive/50">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(alert.category)}
                  <h3 className="font-semibold text-sm">{alert.title}</h3>
                </div>
                <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                  {alert.severity.toUpperCase()}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">{alert.description}</p>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span className="font-medium">Potential Impact:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {alert.impact.map((item) => (
                    <Badge key={item} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{alert.timestamp}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ExternalLink className="w-3 h-3" />
                  <span>{alert.source}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
