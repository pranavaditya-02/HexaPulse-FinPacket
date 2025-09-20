"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Plus, Star } from "lucide-react"

interface StockRecommendation {
  symbol: string
  name: string
  currentPrice: number
  targetPrice: number
  upside: number
  confidence: number
  reasoning: string[]
  riskLevel: "low" | "medium" | "high"
  timeHorizon: string
  analystRating: "strong_buy" | "buy" | "hold" | "sell"
}

const mockRecommendations: StockRecommendation[] = [
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    currentPrice: 378.85,
    targetPrice: 425.0,
    upside: 12.2,
    confidence: 89,
    reasoning: ["Strong cloud growth", "AI integration momentum", "Solid fundamentals", "Market leadership"],
    riskLevel: "low",
    timeHorizon: "6-12 months",
    analystRating: "strong_buy",
  },
  {
    symbol: "AMD",
    name: "Advanced Micro Devices",
    currentPrice: 142.35,
    targetPrice: 175.0,
    upside: 22.9,
    confidence: 76,
    reasoning: ["Data center growth", "AI chip demand", "Market share gains", "Product cycle"],
    riskLevel: "medium",
    timeHorizon: "3-6 months",
    analystRating: "buy",
  },
  {
    symbol: "PLTR",
    name: "Palantir Technologies",
    currentPrice: 18.45,
    targetPrice: 28.0,
    upside: 51.8,
    confidence: 68,
    reasoning: ["Government contracts", "AI platform growth", "Commercial expansion", "Data analytics trend"],
    riskLevel: "high",
    timeHorizon: "12-18 months",
    analystRating: "buy",
  },
  {
    symbol: "CRM",
    name: "Salesforce Inc.",
    currentPrice: 245.67,
    targetPrice: 285.0,
    upside: 16.0,
    confidence: 82,
    reasoning: ["SaaS market leader", "AI integration", "Subscription model", "Enterprise demand"],
    riskLevel: "low",
    timeHorizon: "6-9 months",
    analystRating: "buy",
  },
]

export function SmartStockRecommendations() {
  const [recommendations] = useState<StockRecommendation[]>(mockRecommendations)
  const [selectedRisk, setSelectedRisk] = useState<string>("all")

  const filteredRecommendations =
    selectedRisk === "all" ? recommendations : recommendations.filter((rec) => rec.riskLevel === selectedRisk)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "border-accent text-accent bg-accent/10"
      case "medium":
        return "border-secondary text-secondary bg-secondary/10"
      case "high":
        return "border-destructive text-destructive bg-destructive/10"
      default:
        return "border-muted text-muted bg-muted/10"
    }
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "strong_buy":
        return "text-accent"
      case "buy":
        return "text-primary"
      case "hold":
        return "text-secondary"
      case "sell":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getRatingText = (rating: string) => {
    switch (rating) {
      case "strong_buy":
        return "Strong Buy"
      case "buy":
        return "Buy"
      case "hold":
        return "Hold"
      case "sell":
        return "Sell"
      default:
        return "N/A"
    }
  }

  const addToWatchlist = (symbol: string) => {
    // TODO: Implement add to watchlist functionality
    console.log(`Adding ${symbol} to watchlist`)
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>AI Stock Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Filter */}
        <div className="flex space-x-2">
          {["all", "low", "medium", "high"].map((risk) => (
            <Button
              key={risk}
              variant={selectedRisk === risk ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRisk(risk)}
              className="text-xs"
            >
              {risk === "all" ? "All Risk Levels" : `${risk.charAt(0).toUpperCase() + risk.slice(1)} Risk`}
            </Button>
          ))}
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          {filteredRecommendations.map((rec) => (
            <div key={rec.symbol} className="p-4 rounded-lg glass-strong space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold">{rec.symbol}</h4>
                    <Badge variant="outline" className={getRatingColor(rec.analystRating)}>
                      {getRatingText(rec.analystRating)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{rec.name}</div>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-mono font-semibold">${rec.currentPrice.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Current</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground">Target Price</div>
                  <div className="font-semibold font-mono">${rec.targetPrice.toFixed(2)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Upside</div>
                  <div className="font-semibold text-accent">+{rec.upside.toFixed(1)}%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Time Horizon</div>
                  <div className="font-semibold">{rec.timeHorizon}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI Confidence</span>
                  <span className="font-medium">{rec.confidence}%</span>
                </div>
                <Progress value={rec.confidence} className="h-1" />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Key Reasons</div>
                <div className="grid grid-cols-2 gap-1">
                  {rec.reasoning.map((reason, index) => (
                    <div key={index} className="flex items-center space-x-1 text-xs">
                      <Star className="w-3 h-3 text-secondary fill-current" />
                      <span className="text-muted-foreground">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className={getRiskColor(rec.riskLevel)}>
                  {rec.riskLevel.toUpperCase()} RISK
                </Badge>

                <Button size="sm" onClick={() => addToWatchlist(rec.symbol)} className="flex items-center space-x-1">
                  <Plus className="w-3 h-3" />
                  <span>Add to Watchlist</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
