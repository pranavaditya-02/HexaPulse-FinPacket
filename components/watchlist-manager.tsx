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
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd.",
    price: 2847.65,
    change: 32.40,
    changePercent: 1.15,
    prediction: "bullish",
    riskLevel: "low",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: 4156.80,
    change: -45.20,
    changePercent: -1.08,
    prediction: "neutral",
    riskLevel: "low",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd.",
    price: 1687.25,
    change: 18.75,
    changePercent: 1.12,
    prediction: "bullish",
    riskLevel: "medium",
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd.",
    price: 1834.90,
    change: -28.60,
    changePercent: -1.53,
    prediction: "bearish",
    riskLevel: "medium",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd.",
    price: 1284.35,
    change: 15.80,
    changePercent: 1.25,
    prediction: "bullish",
    riskLevel: "medium",
  },
]

// Available Indian stocks for search/add functionality
const availableStocks = [
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd.", price: 1542.30, change: 22.45, changePercent: 1.48 },
  { symbol: "ITC", name: "ITC Ltd.", price: 456.80, change: -3.20, changePercent: -0.70 },
  { symbol: "SBIN", name: "State Bank of India", price: 817.65, change: 12.35, changePercent: 1.53 },
  { symbol: "LT", name: "Larsen & Toubro Ltd.", price: 3567.25, change: -18.75, changePercent: -0.52 },
  { symbol: "ASIANPAINT", name: "Asian Paints Ltd.", price: 2934.80, change: 8.90, changePercent: 0.30 },
  { symbol: "MARUTI", name: "Maruti Suzuki India Ltd.", price: 11456.75, change: 185.30, changePercent: 1.64 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd.", price: 6854.20, change: -92.15, changePercent: -1.33 },
  { symbol: "WIPRO", name: "Wipro Ltd.", price: 567.45, change: -8.25, changePercent: -1.43 },
  { symbol: "COALINDIA", name: "Coal India Ltd.", price: 412.80, change: 5.60, changePercent: 1.37 },
  { symbol: "ADANIPORTS", name: "Adani Ports & SEZ Ltd.", price: 1398.90, change: 67.85, changePercent: 5.10 },
]

export function WatchlistManager() {
  const [watchlist, setWatchlist] = useState<WatchlistStock[]>(mockWatchlist)
  const [newSymbol, setNewSymbol] = useState("")

  // Generate AI prediction based on price movement and market conditions
  const generatePrediction = (changePercent: number): "bullish" | "bearish" | "neutral" => {
    if (changePercent > 1.0) return "bullish"
    if (changePercent < -1.0) return "bearish"
    return "neutral"
  }

  // Generate risk level based on volatility and sector
  const generateRiskLevel = (symbol: string, changePercent: number): "low" | "medium" | "high" => {
    const highVolatilityStocks = ["ADANIPORTS", "BAJFINANCE", "COALINDIA"]
    const lowRiskStocks = ["RELIANCE", "TCS", "HDFCBANK", "ITC"]
    
    if (highVolatilityStocks.includes(symbol) || Math.abs(changePercent) > 3) return "high"
    if (lowRiskStocks.includes(symbol)) return "low"
    return "medium"
  }

  const addToWatchlist = () => {
    if (newSymbol.trim()) {
      // Check if already in watchlist
      if (watchlist.some(stock => stock.symbol === newSymbol.trim())) {
        alert("Stock already in watchlist")
        setNewSymbol("")
        return
      }

      // Find stock in available stocks
      const foundStock = availableStocks.find(stock => 
        stock.symbol === newSymbol.trim().toUpperCase()
      )

      if (foundStock) {
        const newStock: WatchlistStock = {
          symbol: foundStock.symbol,
          name: foundStock.name,
          price: foundStock.price,
          change: foundStock.change,
          changePercent: foundStock.changePercent,
          prediction: generatePrediction(foundStock.changePercent),
          riskLevel: generateRiskLevel(foundStock.symbol, foundStock.changePercent),
        }

        setWatchlist([...watchlist, newStock])
        setNewSymbol("")
      } else {
        alert("Stock not found. Available symbols: " + availableStocks.map(s => s.symbol).join(", "))
      }
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
              placeholder="Add symbol (e.g., BHARTIARTL)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === "Enter" && addToWatchlist()}
              className="w-48 h-8"
            />
            <Button size="sm" onClick={addToWatchlist}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {watchlist.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Your watchlist is empty</p>
            <p className="text-sm">Add Indian stocks to track your favorites</p>
          </div>
        ) : (
          watchlist.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between p-4 rounded-lg glass-strong">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{stock.symbol}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="text-sm text-muted-foreground">{stock.name}</div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-semibold">₹{stock.price.toFixed(2)}</div>
                  <div
                    className={`flex items-center space-x-1 text-sm ${
                      stock.change >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>
                      {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge
                  variant={stock.prediction === "bullish" ? "default" : "secondary"}
                  className={
                    stock.prediction === "bullish"
                      ? "bg-green-400/20 text-green-400 border-green-400/30"
                      : stock.prediction === "bearish"
                        ? "bg-red-400/20 text-red-400 border-red-400/30"
                        : "bg-yellow-400/20 text-yellow-400 border-yellow-400/30"
                  }
                >
                  {stock.prediction}
                </Badge>

                <Badge
                  variant="outline"
                  className={
                    stock.riskLevel === "high"
                      ? "border-red-400 text-red-400"
                      : stock.riskLevel === "medium"
                        ? "border-yellow-400 text-yellow-400"
                        : "border-green-400 text-green-400"
                  }
                >
                  {stock.riskLevel} risk
                </Badge>

                <Button variant="ghost" size="sm" onClick={() => removeFromWatchlist(stock.symbol)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}

        {/* Available stocks hint */}
        <div className="mt-6 p-3 bg-muted/30 rounded-lg">
          <p className="text-sm font-medium mb-2">Available stocks to add:</p>
          <div className="flex flex-wrap gap-1">
            {availableStocks.slice(0, 8).map((stock) => (
              <Badge 
                key={stock.symbol} 
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-primary/10"
                onClick={() => setNewSymbol(stock.symbol)}
              >
                {stock.symbol}
              </Badge>
            ))}
            <Badge variant="outline" className="text-xs">
              +{availableStocks.length - 8} more...
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
