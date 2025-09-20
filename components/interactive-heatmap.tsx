"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Activity, RefreshCw } from "lucide-react"

interface HeatmapData {
  symbol: string
  name: string
  sector: string
  marketCap: number
  performance: number
  volume: number
  sentiment: "bullish" | "bearish" | "neutral"
  volatility: number
}

const generateHeatmapData = (): HeatmapData[] => [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    marketCap: 2800000,
    performance: 2.4 + (Math.random() - 0.5) * 2,
    volume: 45000000,
    sentiment: "bullish",
    volatility: 0.25,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    sector: "Technology",
    marketCap: 2900000,
    performance: 1.8 + (Math.random() - 0.5) * 2,
    volume: 23000000,
    sentiment: "bullish",
    volatility: 0.22,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Technology",
    marketCap: 1800000,
    performance: -0.5 + (Math.random() - 0.5) * 2,
    volume: 1200000,
    sentiment: "neutral",
    volatility: 0.28,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    sector: "Consumer",
    marketCap: 789000,
    performance: -3.2 + (Math.random() - 0.5) * 2,
    volume: 67000000,
    sentiment: "bearish",
    volatility: 0.45,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    sector: "Technology",
    marketCap: 2100000,
    performance: 4.8 + (Math.random() - 0.5) * 2,
    volume: 34000000,
    sentiment: "bullish",
    volatility: 0.35,
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase",
    sector: "Finance",
    marketCap: 450000,
    performance: 1.6 + (Math.random() - 0.5) * 2,
    volume: 12000000,
    sentiment: "bullish",
    volatility: 0.18,
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    sector: "Healthcare",
    marketCap: 420000,
    performance: 0.8 + (Math.random() - 0.5) * 2,
    volume: 8000000,
    sentiment: "neutral",
    volatility: 0.15,
  },
  {
    symbol: "XOM",
    name: "Exxon Mobil",
    sector: "Energy",
    marketCap: 380000,
    performance: -1.2 + (Math.random() - 0.5) * 2,
    volume: 15000000,
    sentiment: "bearish",
    volatility: 0.32,
  },
  {
    symbol: "WMT",
    name: "Walmart Inc.",
    sector: "Consumer",
    marketCap: 520000,
    performance: 0.3 + (Math.random() - 0.5) * 2,
    volume: 9000000,
    sentiment: "neutral",
    volatility: 0.12,
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    sector: "Finance",
    marketCap: 480000,
    performance: 2.1 + (Math.random() - 0.5) * 2,
    volume: 6000000,
    sentiment: "bullish",
    volatility: 0.2,
  },
]

export function InteractiveHeatmap() {
  const [data, setData] = useState<HeatmapData[]>(generateHeatmapData())
  const [selectedMetric, setSelectedMetric] = useState<"performance" | "volume" | "volatility">("performance")
  const [selectedSector, setSelectedSector] = useState<string>("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const sectors = ["all", ...Array.from(new Set(data.map((item) => item.sector)))]

  const filteredData = selectedSector === "all" ? data : data.filter((item) => item.sector === selectedSector)

  const refreshData = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setData(generateHeatmapData())
    setIsRefreshing(false)
  }

  const getColor = (value: number, metric: string) => {
    let intensity: number
    let isPositive: boolean

    switch (metric) {
      case "performance":
        intensity = Math.min(Math.abs(value) / 5, 1)
        isPositive = value > 0
        break
      case "volume":
        intensity = Math.min(value / 100000000, 1)
        isPositive = true
        break
      case "volatility":
        intensity = Math.min(value / 0.5, 1)
        isPositive = false
        break
      default:
        intensity = 0.5
        isPositive = true
    }

    if (metric === "volume") {
      return `rgba(75, 192, 192, ${0.2 + intensity * 0.6})`
    }

    if (metric === "volatility") {
      return `rgba(255, 193, 7, ${0.2 + intensity * 0.6})`
    }

    // Performance colors
    if (isPositive) {
      return `rgba(46, 204, 113, ${0.2 + intensity * 0.6})` // Green
    } else {
      return `rgba(231, 76, 60, ${0.2 + intensity * 0.6})` // Red
    }
  }

  const getSize = (marketCap: number) => {
    const minSize = 80
    const maxSize = 200
    const normalizedCap = Math.log(marketCap) / Math.log(3000000) // Normalize against max cap
    return Math.max(minSize, Math.min(maxSize, minSize + normalizedCap * (maxSize - minSize)))
  }

  const formatValue = (value: number, metric: string) => {
    switch (metric) {
      case "performance":
        return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
      case "volume":
        return `${(value / 1000000).toFixed(1)}M`
      case "volatility":
        return `${(value * 100).toFixed(1)}%`
      default:
        return value.toString()
    }
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <span>Interactive Market Heatmap</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Badge variant="outline" className="text-xs">
              Live Data
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="volatility">Volatility</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap gap-2 mt-4">
            {sectors.map((sector) => (
              <Button
                key={sector}
                variant={selectedSector === sector ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSector(sector)}
                className="text-xs"
              >
                {sector === "all" ? "All Sectors" : sector}
              </Button>
            ))}
          </div>

          <TabsContent value={selectedMetric} className="mt-6">
            <div className="relative min-h-[400px] p-4 rounded-lg glass-strong overflow-hidden">
              <div className="flex flex-wrap gap-2 justify-center items-center">
                {filteredData.map((item) => {
                  const size = getSize(item.marketCap)
                  const color = getColor(item[selectedMetric], selectedMetric)
                  const value = item[selectedMetric]

                  return (
                    <div
                      key={item.symbol}
                      className="relative group cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10"
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundColor: color,
                        borderRadius: "8px",
                        border: "2px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                        <div className="font-bold text-sm">{item.symbol}</div>
                        <div className="text-xs opacity-80">{formatValue(value, selectedMetric)}</div>
                        {selectedMetric === "performance" && (
                          <div className="flex items-center mt-1">
                            {value >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          </div>
                        )}
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 min-w-max">
                        <div className="text-sm font-semibold">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.sector}</div>
                        <div className="text-xs mt-1">
                          <div>Performance: {formatValue(item.performance, "performance")}</div>
                          <div>Volume: {formatValue(item.volume, "volume")}</div>
                          <div>Volatility: {formatValue(item.volatility, "volatility")}</div>
                          <div>Market Cap: ${(item.marketCap / 1000).toFixed(0)}B</div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`mt-1 text-xs ${
                            item.sentiment === "bullish"
                              ? "border-accent text-accent"
                              : item.sentiment === "bearish"
                                ? "border-destructive text-destructive"
                                : "border-secondary text-secondary"
                          }`}
                        >
                          {item.sentiment.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-accent/40"></div>
                <span>
                  {selectedMetric === "performance"
                    ? "Positive"
                    : selectedMetric === "volume"
                      ? "High Volume"
                      : "High Volatility"}
                </span>
              </div>
              {selectedMetric === "performance" && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-destructive/40"></div>
                  <span>Negative</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span>Size = Market Cap</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
