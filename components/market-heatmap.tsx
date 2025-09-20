"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface SectorData {
  name: string
  performance: number
  sentiment: "bullish" | "bearish" | "neutral"
  stocks: { symbol: string; change: number }[]
}

const sectorData: SectorData[] = [
  {
    name: "Technology",
    performance: 2.4,
    sentiment: "bullish",
    stocks: [
      { symbol: "AAPL", change: 1.2 },
      { symbol: "MSFT", change: 2.1 },
      { symbol: "GOOGL", change: -0.5 },
      { symbol: "NVDA", change: 4.8 },
    ],
  },
  {
    name: "Healthcare",
    performance: 0.8,
    sentiment: "neutral",
    stocks: [
      { symbol: "JNJ", change: 0.3 },
      { symbol: "PFE", change: 1.2 },
      { symbol: "UNH", change: 0.9 },
      { symbol: "ABBV", change: -0.1 },
    ],
  },
  {
    name: "Energy",
    performance: -1.2,
    sentiment: "bearish",
    stocks: [
      { symbol: "XOM", change: -2.1 },
      { symbol: "CVX", change: -0.8 },
      { symbol: "COP", change: -1.5 },
      { symbol: "SLB", change: -0.9 },
    ],
  },
  {
    name: "Finance",
    performance: 1.6,
    sentiment: "bullish",
    stocks: [
      { symbol: "JPM", change: 1.8 },
      { symbol: "BAC", change: 1.2 },
      { symbol: "WFC", change: 2.1 },
      { symbol: "GS", change: 1.4 },
    ],
  },
  {
    name: "Consumer",
    performance: -0.3,
    sentiment: "neutral",
    stocks: [
      { symbol: "AMZN", change: 0.5 },
      { symbol: "TSLA", change: -2.1 },
      { symbol: "HD", change: 0.8 },
      { symbol: "MCD", change: -0.2 },
    ],
  },
  {
    name: "Industrial",
    performance: 0.9,
    sentiment: "neutral",
    stocks: [
      { symbol: "BA", change: 1.2 },
      { symbol: "CAT", change: 0.8 },
      { symbol: "GE", change: 0.6 },
      { symbol: "MMM", change: 1.1 },
    ],
  },
]

export function MarketHeatmap() {
  const getSentimentColor = (sentiment: string, performance: number) => {
    if (sentiment === "bullish" || performance > 1) return "bg-accent/20 border-accent text-accent"
    if (sentiment === "bearish" || performance < -1) return "bg-destructive/20 border-destructive text-destructive"
    return "bg-secondary/20 border-secondary text-secondary"
  }

  const getPerformanceSize = (performance: number) => {
    const absPerf = Math.abs(performance)
    if (absPerf > 2) return "col-span-2 row-span-2"
    if (absPerf > 1) return "col-span-2"
    return ""
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Market Sentiment Heatmap</span>
          <Badge variant="outline" className="text-xs">
            Live Data
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 auto-rows-fr">
          {sectorData.map((sector) => (
            <div
              key={sector.name}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer ${getSentimentColor(
                sector.sentiment,
                sector.performance,
              )} ${getPerformanceSize(sector.performance)}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{sector.name}</h3>
                  <div className="flex items-center space-x-1">
                    {sector.performance >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="text-xs font-bold">{sector.performance.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  {sector.stocks.slice(0, 3).map((stock) => (
                    <div key={stock.symbol} className="flex items-center justify-between text-xs">
                      <span className="font-mono">{stock.symbol}</span>
                      <span className={stock.change >= 0 ? "text-current" : "text-current opacity-70"}>
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>

                <Badge
                  variant="outline"
                  className="text-xs border-current/30 bg-current/10"
                  style={{ fontSize: "10px" }}
                >
                  {sector.sentiment.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
