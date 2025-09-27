"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Star, Brain } from "lucide-react"

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
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd.",
    currentPrice: 2847.65,
    targetPrice: 3200.0,
    upside: 12.4,
    confidence: 89,
    reasoning: ["Strong refining margins", "Retail expansion", "Digital growth", "Renewable energy push"],
    riskLevel: "low",
    timeHorizon: "6-12 months",
    analystRating: "strong_buy",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd.",
    currentPrice: 1687.25,
    targetPrice: 1850.0,
    upside: 9.6,
    confidence: 85,
    reasoning: ["Strong deposit growth", "Asset quality improvement", "Digital banking lead", "Rural expansion"],
    riskLevel: "low",
    timeHorizon: "6-9 months",
    analystRating: "strong_buy",
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd.",
    currentPrice: 1542.30,
    targetPrice: 1750.0,
    upside: 13.5,
    confidence: 82,
    reasoning: ["5G rollout momentum", "ARPU improvement", "Market leadership", "Africa operations growth"],
    riskLevel: "medium",
    timeHorizon: "3-6 months",
    analystRating: "buy",
  },
  {
    symbol: "MARUTI",
    name: "Maruti Suzuki India Ltd.",
    currentPrice: 11456.75,
    targetPrice: 12500.0,
    upside: 9.1,
    confidence: 78,
    reasoning: ["Festive season demand", "New model launches", "Rural market recovery", "EV transition plans"],
    riskLevel: "medium",
    timeHorizon: "6-9 months",
    analystRating: "buy",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    currentPrice: 4156.80,
    targetPrice: 4000.0,
    upside: -3.8,
    confidence: 65,
    reasoning: ["Client budget cuts", "Margin pressure", "Growth slowdown", "Currency headwinds"],
    riskLevel: "medium",
    timeHorizon: "3-6 months",
    analystRating: "hold",
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd.",
    currentPrice: 1834.90,
    targetPrice: 1650.0,
    upside: -10.1,
    confidence: 72,
    reasoning: ["Guidance cut concerns", "Deal pipeline weak", "Attrition issues", "Macro uncertainty"],
    riskLevel: "high",
    timeHorizon: "3-6 months",
    analystRating: "sell",
  },
  {
    symbol: "ADANIPORTS",
    name: "Adani Ports & SEZ Ltd.",
    currentPrice: 1398.90,
    targetPrice: 1600.0,
    upside: 14.4,
    confidence: 70,
    reasoning: ["Infrastructure growth", "Port expansion", "Logistics integration", "Government support"],
    riskLevel: "high",
    timeHorizon: "12-18 months",
    analystRating: "buy",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd.",
    currentPrice: 1284.35,
    targetPrice: 1400.0,
    upside: 9.0,
    confidence: 80,
    reasoning: ["Credit growth pickup", "NIM expansion", "Digital initiatives", "Corporate recovery"],
    riskLevel: "medium",
    timeHorizon: "6-12 months",
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
        return "border-green-400 text-green-400 bg-green-400/10"
      case "medium":
        return "border-yellow-400 text-yellow-400 bg-yellow-400/10"
      case "high":
        return "border-red-400 text-red-400 bg-red-400/10"
      default:
        return "border-muted text-muted bg-muted/10"
    }
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "strong_buy":
        return "text-green-400 bg-green-400/20 border-green-400/30"
      case "buy":
        return "text-blue-400 bg-blue-400/20 border-blue-400/30"
      case "hold":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30"
      case "sell":
        return "text-red-400 bg-red-400/20 border-red-400/30"
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

  const getUpsideColor = (upside: number) => {
    return upside >= 0 ? "text-green-400" : "text-red-400"
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>AI Stock Recommendations</span>
          <Badge variant="outline" className="ml-2 text-xs">
            <Brain className="w-3 h-3 mr-1" />
            Powered by Pathway AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Filter */}
        <div className="flex flex-wrap gap-2">
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
                  <div className="font-mono font-semibold">₹{rec.currentPrice.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Current</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground">Target Price</div>
                  <div className="font-semibold font-mono">₹{rec.targetPrice.toFixed(2)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Upside/Downside</div>
                  <div className={`font-semibold ${getUpsideColor(rec.upside)}`}>
                    {rec.upside >= 0 ? "+" : ""}{rec.upside.toFixed(1)}%
                  </div>
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
                <Progress 
                  value={rec.confidence} 
                  className="h-2" 
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Key Analysis Points</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {rec.reasoning.map((reason, index) => (
                    <div key={index} className="flex items-center space-x-1 text-xs">
                      <Star className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" />
                      <span className="text-muted-foreground">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className={getRiskColor(rec.riskLevel)}>
                  {rec.riskLevel.toUpperCase()} RISK
                </Badge>

                {/* Rating Action Badge */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">Recommendation:</span>
                  <Badge className={getRatingColor(rec.analystRating)}>
                    {getRatingText(rec.analystRating)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Disclaimer */}
        <div className="mt-6 p-3 bg-muted/20 border border-muted/30 rounded-lg">
          <div className="flex items-start space-x-2">
            <Brain className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <strong>AI-Powered Analysis:</strong> These recommendations are generated using advanced algorithms and market data analysis. Past performance does not guarantee future results. Please conduct your own research before making investment decisions.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
