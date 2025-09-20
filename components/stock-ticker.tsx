"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
}

// Mock data - replace with real API
const mockStocks: StockData[] = [
  { symbol: "AAPL", price: 175.43, change: 2.15, changePercent: 1.24 },
  { symbol: "GOOGL", price: 2847.52, change: -15.23, changePercent: -0.53 },
  { symbol: "MSFT", price: 378.85, change: 4.67, changePercent: 1.25 },
  { symbol: "TSLA", price: 248.42, change: -8.15, changePercent: -3.18 },
  { symbol: "AMZN", price: 3247.15, change: 12.45, changePercent: 0.38 },
  { symbol: "NVDA", price: 875.28, change: 23.67, changePercent: 2.78 },
]

export function StockTicker() {
  const [stocks, setStocks] = useState<StockData[]>(mockStocks)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStocks((prev) =>
        prev.map((stock) => ({
          ...stock,
          price: stock.price + (Math.random() - 0.5) * 2,
          change: stock.change + (Math.random() - 0.5) * 0.5,
          changePercent: stock.changePercent + (Math.random() - 0.5) * 0.1,
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="glass p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Live Market Data</h2>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex space-x-6 min-w-max">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="flex items-center space-x-3 min-w-[140px]">
              <div className="text-sm font-mono">
                <div className="font-semibold">{stock.symbol}</div>
                <div className="text-muted-foreground">${stock.price.toFixed(2)}</div>
              </div>

              <div
                className={`flex items-center space-x-1 text-xs ${
                  stock.change >= 0 ? "text-accent" : "text-destructive"
                }`}
              >
                {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{stock.changePercent.toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
