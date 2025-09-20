import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain } from "lucide-react"

const insights = [
  {
    symbol: "AAPL",
    prediction: "Strong Buy",
    confidence: 87,
    timeframe: "1-2 weeks",
    reason: "Earnings beat expected, strong iPhone demand",
    type: "bullish",
  },
  {
    symbol: "TSLA",
    prediction: "Hold",
    confidence: 62,
    timeframe: "2-4 weeks",
    reason: "Mixed signals from production data",
    type: "neutral",
  },
  {
    symbol: "NVDA",
    prediction: "Volatile",
    confidence: 78,
    timeframe: "1 week",
    reason: "AI sector rotation expected",
    type: "warning",
  },
]

export function PredictiveInsights() {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-primary" />
          <span>AI Predictions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.symbol} className="p-3 rounded-lg glass-strong space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{insight.symbol}</span>
              <Badge
                variant={insight.type === "bullish" ? "default" : "secondary"}
                className={
                  insight.type === "bullish"
                    ? "bg-accent/20 text-accent"
                    : insight.type === "warning"
                      ? "bg-secondary/20 text-secondary"
                      : ""
                }
              >
                {insight.prediction}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-medium">{insight.confidence}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Timeframe</span>
                <span className="font-medium">{insight.timeframe}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">{insight.reason}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
