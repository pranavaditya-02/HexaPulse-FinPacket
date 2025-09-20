import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

const marketData = [
  { name: "S&P 500", value: "4,567.89", change: "+0.8%", trend: "up" },
  { name: "NASDAQ", value: "14,234.56", change: "+1.2%", trend: "up" },
  { name: "DOW", value: "34,567.12", change: "-0.3%", trend: "down" },
  { name: "VIX", value: "18.45", change: "-2.1%", trend: "down" },
]

export function MarketSummary() {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-primary" />
          <span>Market Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {marketData.map((market) => (
          <div key={market.name} className="flex items-center justify-between p-3 rounded-lg glass-strong">
            <div>
              <div className="font-semibold">{market.name}</div>
              <div className="text-sm text-muted-foreground font-mono">{market.value}</div>
            </div>
            <div
              className={`flex items-center space-x-1 ${market.trend === "up" ? "text-accent" : "text-destructive"}`}
            >
              {market.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-medium">{market.change}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
