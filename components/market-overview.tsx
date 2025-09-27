"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Activity, DollarSign, IndianRupee, Clock } from "lucide-react"

interface MarketMetrics {
  totalMarketCap: number
  totalVolume: number
  advancingStocks: number
  decliningStocks: number
  vixLevel: number
  fearGreedIndex: number
  nifty50: number
  sensex: number
  isMarketOpen: boolean
}

export function MarketOverview() {
  const [metrics, setMetrics] = useState<MarketMetrics>({
    totalMarketCap: 3800000000000000, // ₹380 Lakh Crore (Indian market cap)
    totalVolume: 85000000000, // ₹85,000 Crore daily volume
    advancingStocks: 1456,
    decliningStocks: 1128,
    vixLevel: 14.25, // India VIX typically lower than US VIX
    fearGreedIndex: 68,
    nifty50: 25347.85,
    sensex: 83124.75,
    isMarketOpen: false, // Market closed on weekends
  })

  useEffect(() => {
    // Check if market is open (9:15 AM to 3:30 PM IST, Mon-Fri)
    const checkMarketHours = () => {
      const now = new Date()
      const day = now.getDay() // 0 = Sunday, 6 = Saturday
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const currentTime = hours * 60 + minutes
      
      const marketOpen = 9 * 60 + 15 // 9:15 AM
      const marketClose = 15 * 60 + 30 // 3:30 PM
      
      const isWeekday = day >= 1 && day <= 5
      const isMarketHours = currentTime >= marketOpen && currentTime <= marketClose
      
      return isWeekday && isMarketHours
    }

    setMetrics(prev => ({
      ...prev,
      isMarketOpen: checkMarketHours()
    }))

    // Simulate real-time updates only if market is open
    const interval = setInterval(() => {
      const isOpen = checkMarketHours()
      
      if (isOpen) {
        setMetrics((prev) => ({
          ...prev,
          totalVolume: Math.max(50000000000, prev.totalVolume + (Math.random() - 0.5) * 5000000000),
          advancingStocks: Math.max(0, prev.advancingStocks + Math.floor((Math.random() - 0.5) * 15)),
          decliningStocks: Math.max(0, prev.decliningStocks + Math.floor((Math.random() - 0.5) * 15)),
          vixLevel: Math.max(8, Math.min(35, prev.vixLevel + (Math.random() - 0.5) * 1.5)),
          fearGreedIndex: Math.max(0, Math.min(100, prev.fearGreedIndex + (Math.random() - 0.5) * 3)),
          nifty50: Math.max(20000, prev.nifty50 + (Math.random() - 0.5) * 50),
          sensex: Math.max(65000, prev.sensex + (Math.random() - 0.5) * 150),
          isMarketOpen: isOpen,
        }))
      } else {
        setMetrics(prev => ({ ...prev, isMarketOpen: false }))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getFearGreedLabel = (index: number) => {
    if (index >= 75) return { label: "Extreme Greed", color: "text-red-400" }
    if (index >= 55) return { label: "Greed", color: "text-orange-400" }
    if (index >= 45) return { label: "Neutral", color: "text-yellow-400" }
    if (index >= 25) return { label: "Fear", color: "text-blue-400" }
    return { label: "Extreme Fear", color: "text-purple-400" }
  }

  const getVixLabel = (vix: number) => {
    if (vix >= 25) return { label: "High Volatility", color: "text-red-400" }
    if (vix >= 15) return { label: "Elevated Volatility", color: "text-yellow-400" }
    return { label: "Low Volatility", color: "text-green-400" }
  }

  const advanceDeclineRatio = metrics.advancingStocks / (metrics.advancingStocks + metrics.decliningStocks)
  const fearGreedData = getFearGreedLabel(metrics.fearGreedIndex)
  const vixData = getVixLabel(metrics.vixLevel)

  return (
    <div className="space-y-4">
      {/* Market Status Banner */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${metrics.isMarketOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className="font-medium">
                  {metrics.isMarketOpen ? "Market Open" : "Market Closed"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {metrics.isMarketOpen ? "Live Updates" : "Weekend - Updates Resume Monday 9:15 AM"}
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <span className="text-muted-foreground">NIFTY 50:</span>
                <span className="font-mono font-semibold">{metrics.nifty50.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-muted-foreground">SENSEX:</span>
                <span className="font-mono font-semibold">{metrics.sensex.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(metrics.totalMarketCap / 100000000000000).toFixed(1)}L Cr</div>
            <p className="text-xs text-muted-foreground">Total market capitalization</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Volume</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(metrics.totalVolume / 10000000000).toFixed(1)}K Cr</div>
            <p className="text-xs text-muted-foreground">
              {metrics.isMarketOpen ? "Trading volume today" : "Last trading day volume"}
            </p>
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
                <span className="text-green-400">↑ {metrics.advancingStocks}</span>
                <span className="text-red-400">↓ {metrics.decliningStocks}</span>
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
                <span className="text-sm">India VIX: {metrics.vixLevel.toFixed(2)}</span>
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

      {/* Additional Indian Market Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">FII Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cash:</span>
                <span className="text-red-400">-₹2,847 Cr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">F&O:</span>
                <span className="text-green-400">+₹1,235 Cr</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Net:</span>
                <span className="text-red-400">-₹1,612 Cr</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">DII Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mutual Funds:</span>
                <span className="text-green-400">+₹3,456 Cr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Insurance:</span>
                <span className="text-green-400">+₹892 Cr</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Net:</span>
                <span className="text-green-400">+₹4,348 Cr</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sectoral Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Banking:</span>
                <span className="text-green-400">+1.24%</span>
              </div>
              <div className="flex justify-between">
                <span>IT:</span>
                <span className="text-red-400">-0.87%</span>
              </div>
              <div className="flex justify-between">
                <span>Auto:</span>
                <span className="text-green-400">+2.15%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
