import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertCircle, Newspaper } from "lucide-react"

const digestItems = [
  {
    type: "market",
    title: "Tech Stocks Rally on AI Optimism",
    description: "Major tech companies surge as AI adoption accelerates across industries",
    impact: "Bullish",
    time: "2 hours ago",
  },
  {
    type: "alert",
    title: "Fed Meeting Minutes Released",
    description: "Central bank signals potential rate cuts in upcoming quarters",
    impact: "Neutral",
    time: "4 hours ago",
  },
  {
    type: "news",
    title: "Apple Announces New Product Line",
    description: "Revolutionary AR glasses expected to drive next growth cycle",
    impact: "Bullish",
    time: "6 hours ago",
  },
]

export function DailyDigest() {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Newspaper className="w-4 h-4 text-white" />
          </div>
          <span>Daily Market Digest</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {digestItems.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg glass-strong">
            <div className="flex-shrink-0 mt-1">
              {item.type === "market" && <TrendingUp className="w-4 h-4 text-accent" />}
              {item.type === "alert" && <AlertCircle className="w-4 h-4 text-secondary" />}
              {item.type === "news" && <Newspaper className="w-4 h-4 text-primary" />}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <Badge
                  variant={item.impact === "Bullish" ? "default" : "secondary"}
                  className={item.impact === "Bullish" ? "bg-accent/20 text-accent" : ""}
                >
                  {item.impact}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">{item.description}</p>

              <div className="text-xs text-muted-foreground">{item.time}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
