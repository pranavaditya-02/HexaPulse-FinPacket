"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Activity, RefreshCw, IndianRupee } from "lucide-react"

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
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd.",
    sector: "Energy & Petrochemicals",
    marketCap: 1920000, // ₹19.2 Lakh Crore
    performance: 1.8 + (Math.random() - 0.5) * 2,
    volume: 45000000,
    sentiment: "bullish",
    volatility: 0.18,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    sector: "Information Technology",
    marketCap: 1500000, // ₹15 Lakh Crore
    performance: -0.8 + (Math.random() - 0.5) * 2,
    volume: 23000000,
    sentiment: "neutral",
    volatility: 0.15,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd.",
    sector: "Banking & Finance",
    marketCap: 1350000, // ₹13.5 Lakh Crore
    performance: 2.1 + (Math.random() - 0.5) * 2,
    volume: 32000000,
    sentiment: "bullish",
    volatility: 0.22,
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd.",
    sector: "Telecom",
    marketCap: 920000, // ₹9.2 Lakh Crore
    performance: 3.2 + (Math.random() - 0.5) * 2,
    volume: 28000000,
    sentiment: "bullish",
    volatility: 0.28,
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd.",
    sector: "Banking & Finance",
    marketCap: 890000, // ₹8.9 Lakh Crore
    performance: 1.5 + (Math.random() - 0.5) * 2,
    volume: 35000000,
    sentiment: "bullish",
    volatility: 0.25,
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd.",
    sector: "Information Technology",
    marketCap: 760000, // ₹7.6 Lakh Crore
    performance: -1.2 + (Math.random() - 0.5) * 2,
    volume: 18000000,
    sentiment: "bearish",
    volatility: 0.20,
  },
  {
    symbol: "ITC",
    name: "ITC Ltd.",
    sector: "FMCG & Consumer",
    marketCap: 570000, // ₹5.7 Lakh Crore
    performance: 0.8 + (Math.random() - 0.5) * 2,
    volume: 12000000,
    sentiment: "neutral",
    volatility: 0.12,
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    sector: "Banking & Finance",
    marketCap: 520000, // ₹5.2 Lakh Crore
    performance: 2.8 + (Math.random() - 0.5) * 2,
    volume: 45000000,
    sentiment: "bullish",
    volatility: 0.35,
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro Ltd.",
    sector: "Infrastructure & Engineering",
    marketCap: 500000, // ₹5 Lakh Crore
    performance: 1.2 + (Math.random() - 0.5) * 2,
    volume: 8000000,
    sentiment: "bullish",
    volatility: 0.24,
  },
  {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever Ltd.",
    sector: "FMCG & Consumer",
    marketCap: 480000, // ₹4.8 Lakh Crore
    performance: 0.5 + (Math.random() - 0.5) * 2,
    volume: 6000000,
    sentiment: "neutral",
    volatility: 0.14,
  },
  {
    symbol: "MARUTI",
    name: "Maruti Suzuki India Ltd.",
    sector: "Automobiles",
    marketCap: 350000, // ₹3.5 Lakh Crore
    performance: 4.2 + (Math.random() - 0.5) * 2,
    volume: 15000000,
    sentiment: "bullish",
    volatility: 0.32,
  },
  {
    symbol: "ASIANPAINT",
    name: "Asian Paints Ltd.",
    sector: "Paints & Chemicals",
    marketCap: 280000, // ₹2.8 Lakh Crore
    performance: -0.3 + (Math.random() - 0.5) * 2,
    volume: 4000000,
    sentiment: "neutral",
    volatility: 0.18,
  },
  {
    symbol: "BAJFINANCE",
    name: "Bajaj Finance Ltd.",
    sector: "NBFC",
    marketCap: 420000, // ₹4.2 Lakh Crore
    performance: -2.1 + (Math.random() - 0.5) * 2,
    volume: 22000000,
    sentiment: "bearish",
    volatility: 0.42,
  },
  {
    symbol: "WIPRO",
    name: "Wipro Ltd.",
    sector: "Information Technology",
    marketCap: 320000, // ₹3.2 Lakh Crore
    performance: -0.9 + (Math.random() - 0.5) * 2,
    volume: 12000000,
    sentiment: "neutral",
    volatility: 0.22,
  },
  {
    symbol: "SUNPHARMA",
    name: "Sun Pharmaceutical Industries",
    sector: "Pharmaceuticals",
    marketCap: 290000, // ₹2.9 Lakh Crore
    performance: 1.8 + (Math.random() - 0.5) * 2,
    volume: 9000000,
    sentiment: "bullish",
    volatility: 0.26,
  },
  {
    symbol: "ADANIPORTS",
    name: "Adani Ports & SEZ Ltd.",
    sector: "Infrastructure & Logistics",
    marketCap: 310000, // ₹3.1 Lakh Crore
    performance: 5.6 + (Math.random() - 0.5) * 3,
    volume: 38000000,
    sentiment: "bullish",
    volatility: 0.45,
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
    // Simulate API call with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setData(generateHeatmapData())
    setIsRefreshing(false)
  }

  const getColor = (value: number, metric: string) => {
    let intensity: number
    let isPositive: boolean

    switch (metric) {
      case "performance":
        intensity = Math.min(Math.abs(value) / 6, 1) // Adjusted for Indian market volatility
        isPositive = value > 0
        break
      case "volume":
        intensity = Math.min(value / 50000000, 1) // Adjusted for Indian market volumes
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
      return `rgba(59, 130, 246, ${0.2 + intensity * 0.6})` // Blue for volume
    }

    if (metric === "volatility") {
      return `rgba(245, 158, 11, ${0.2 + intensity * 0.6})` // Amber for volatility
    }

    // Performance colors
    if (isPositive) {
      return `rgba(34, 197, 94, ${0.2 + intensity * 0.6})` // Green for positive
    } else {
      return `rgba(239, 68, 68, ${0.2 + intensity * 0.6})` // Red for negative
    }
  }

  const getSize = (marketCap: number) => {
    const minSize = 70
    const maxSize = 180
    const normalizedCap = Math.log(marketCap) / Math.log(2000000) // Normalize against max Indian market cap
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

  const formatMarketCap = (marketCap: number) => {
    return `₹${(marketCap / 100000).toFixed(1)}L Cr` // Convert to Lakh Crores
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <span>Indian Market Heatmap</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Badge variant="outline" className="text-xs">
              <IndianRupee className="w-3 h-3 mr-1" />
              NSE/BSE Data
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
            <div className="relative min-h-[500px] p-4 rounded-lg glass-strong overflow-hidden">
              <div className="flex flex-wrap gap-3 justify-center items-center">
                {filteredData.map((item) => {
                  const size = getSize(item.marketCap)
                  const color = getColor(item[selectedMetric], selectedMetric)
                  const value = item[selectedMetric]

                  return (
                    <div
                      key={item.symbol}
                      className="relative group cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10 hover:shadow-lg"
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundColor: color,
                        borderRadius: "12px",
                        border: "2px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                        <div className="font-bold text-sm text-white drop-shadow-md">{item.symbol}</div>
                        <div className="text-xs opacity-90 text-white drop-shadow-sm">
                          {formatValue(value, selectedMetric)}
                        </div>
                        {selectedMetric === "performance" && (
                          <div className="flex items-center mt-1">
                            {value >= 0 ? (
                              <TrendingUp className="w-3 h-3 text-white drop-shadow-sm" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-white drop-shadow-sm" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Enhanced Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-card border border-border rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 min-w-max backdrop-blur-sm">
                        <div className="text-sm font-semibold text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground mb-2">{item.sector}</div>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span>Performance:</span>
                            <span className={value >= 0 ? "text-green-400" : "text-red-400"}>
                              {formatValue(item.performance, "performance")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Volume:</span>
                            <span>{formatValue(item.volume, "volume")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Volatility:</span>
                            <span>{formatValue(item.volatility, "volatility")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Market Cap:</span>
                            <span>{formatMarketCap(item.marketCap)}</span>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`mt-2 text-xs ${
                            item.sentiment === "bullish"
                              ? "border-green-400 text-green-400 bg-green-400/10"
                              : item.sentiment === "bearish"
                                ? "border-red-400 text-red-400 bg-red-400/10"
                                : "border-yellow-400 text-yellow-400 bg-yellow-400/10"
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

            {/* Enhanced Legend */}
            <div className="flex items-center justify-center space-x-8 mt-6 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-green-400/60"></div>
                <span>
                  {selectedMetric === "performance"
                    ? "Positive Performance"
                    : selectedMetric === "volume"
                      ? "High Volume"
                      : "High Volatility"}
                </span>
              </div>
              {selectedMetric === "performance" && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-red-400/60"></div>
                  <span>Negative Performance</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                <span>Size ∝ Market Cap</span>
              </div>
              <div className="flex items-center space-x-2">
                <IndianRupee className="w-3 h-3" />
                <span>Values in ₹</span>
              </div>
            </div>

            {/* Market Summary */}
            <div className="mt-6 p-4 bg-muted/20 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-green-400 font-semibold">
                    {filteredData.filter(item => item.performance > 0).length}
                  </div>
                  <div className="text-muted-foreground">Gainers</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 font-semibold">
                    {filteredData.filter(item => item.performance < 0).length}
                  </div>
                  <div className="text-muted-foreground">Losers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">
                    {formatMarketCap(filteredData.reduce((sum, item) => sum + item.marketCap, 0))}
                  </div>
                  <div className="text-muted-foreground">Total Market Cap</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">
                    {(filteredData.reduce((sum, item) => sum + item.volume, 0) / 1000000000).toFixed(1)}B
                  </div>
                  <div className="text-muted-foreground">Total Volume</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
