"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingUp, TrendingDown, X, Star } from "lucide-react"

interface WatchlistStock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  prediction: "bullish" | "bearish" | "neutral"
  riskLevel: "low" | "medium" | "high"
}

const mockWatchlist: WatchlistStock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 175.43,
    change: 2.15,
    changePercent: 1.24,
    prediction: "bullish",
    riskLevel: "low",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 248.42,
    change: -8.15,
    changePercent: -3.18,
    prediction: "neutral",
    riskLevel: "high",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 875.28,
    change: 23.67,
    changePercent: 2.78,
    prediction: "bullish",
    riskLevel: "medium",
  },
]

export function WatchlistManager() {
  const [watchlist, setWatchlist] = useState<WatchlistStock[]>(mockWatchlist)
  const [newSymbol, setNewSymbol] = useState("")

  const addToWatchlist = () => {
    if (newSymbol.trim()) {
      // TODO: Implement real stock lookup
      setNewSymbol("")
    }
  }

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter((stock) => stock.symbol !== symbol))
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Watchlist</span>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Add symbol (e.g., AAPL)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === "Enter" && addToWatchlist()}
              className="w-40 h-8"
            />
            <Button size="sm" onClick={addToWatchlist}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {watchlist.map((stock) => (
          <div key={stock.symbol} className="flex items-center justify-between p-4 rounded-lg glass-strong">
            <div className="flex items-center space-x-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{stock.symbol}</span>
                  <Star className="w-4 h-4 text-secondary fill-current" />
                </div>
                <div className="text-sm text-muted-foreground">{stock.name}</div>
              </div>

              <div className="text-right">
                <div className="font-mono font-semibold">${stock.price.toFixed(2)}</div>
                <div
                  className={`flex items-center space-x-1 text-sm ${
                    stock.change >= 0 ? "text-accent" : "text-destructive"
                  }`}
                >
                  {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{stock.changePercent.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant={stock.prediction === "bullish" ? "default" : "secondary"}
                className={
                  stock.prediction === "bullish"
                    ? "bg-accent/20 text-accent"
                    : stock.prediction === "bearish"
                      ? "bg-destructive/20 text-destructive"
                      : ""
                }
              >
                {stock.prediction}
              </Badge>

              <Badge
                variant="outline"
                className={
                  stock.riskLevel === "high"
                    ? "border-destructive text-destructive"
                    : stock.riskLevel === "medium"
                      ? "border-secondary text-secondary"
                      : "border-accent text-accent"
                }
              >
                {stock.riskLevel} risk
              </Badge>

              <Button variant="ghost" size="sm" onClick={() => removeFromWatchlist(stock.symbol)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
