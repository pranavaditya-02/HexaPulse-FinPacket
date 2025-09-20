"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Activity, DollarSign } from "lucide-react"

interface MarketMetrics {
  totalMarketCap: number
  totalVolume: number
  advancingStocks: number
  decliningStocks: number
  vixLevel: number
  fearGreedIndex: number
}

export function MarketOverview() {
  const [metrics, setMetrics] = useState<MarketMetrics>({
    totalMarketCap: 45200000000000, // $45.2T
    totalVolume: 12500000000, // $12.5B
    advancingStocks: 1847,
    decliningStocks: 1253,
    vixLevel: 18.45,
    fearGreedIndex: 72,
  })

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        totalVolume: prev.totalVolume + (Math.random() - 0.5) * 1000000000,
        advancingStocks: Math.max(0, prev.advancingStocks + Math.floor((Math.random() - 0.5) * 20)),
        decliningStocks: Math.max(0, prev.decliningStocks + Math.floor((Math.random() - 0.5) * 20)),
        vixLevel: Math.max(10, prev.vixLevel + (Math.random() - 0.5) * 2),
        fearGreedIndex: Math.max(0, Math.min(100, prev.fearGreedIndex + (Math.random() - 0.5) * 5)),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getFearGreedLabel = (index: number) => {
    if (index >= 75) return { label: "Extreme Greed", color: "text-destructive" }
    if (index >= 55) return { label: "Greed", color: "text-secondary" }
    if (index >= 45) return { label: "Neutral", color: "text-muted-foreground" }
    if (index >= 25) return { label: "Fear", color: "text-secondary" }
    return { label: "Extreme Fear", color: "text-destructive" }
  }

  const getVixLabel = (vix: number) => {
    if (vix >= 30) return { label: "High Volatility", color: "text-destructive" }
    if (vix >= 20) return { label: "Elevated Volatility", color: "text-secondary" }
    return { label: "Low Volatility", color: "text-accent" }
  }

  const advanceDeclineRatio = metrics.advancingStocks / (metrics.advancingStocks + metrics.decliningStocks)
  const fearGreedData = getFearGreedLabel(metrics.fearGreedIndex)
  const vixData = getVixLabel(metrics.vixLevel)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(metrics.totalMarketCap / 1000000000000).toFixed(1)}T</div>
          <p className="text-xs text-muted-foreground">Total market capitalization</p>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Volume</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(metrics.totalVolume / 1000000000).toFixed(1)}B</div>
          <p className="text-xs text-muted-foreground">Trading volume today</p>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Advance/Decline</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-accent">↑ {metrics.advancingStocks}</span>
              <span className="text-destructive">↓ {metrics.decliningStocks}</span>
            </div>
            <Progress value={advanceDeclineRatio * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">{(advanceDeclineRatio * 100).toFixed(1)}% advancing</p>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">VIX: {metrics.vixLevel.toFixed(2)}</span>
              <Badge variant="outline" className={vixData.color}>
                {vixData.label}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Fear & Greed: {metrics.fearGreedIndex}</span>
              <Badge variant="outline" className={fearGreedData.color}>
                {fearGreedData.label}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
