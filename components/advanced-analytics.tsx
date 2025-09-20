"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/components/language-provider"
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, Brain, Zap, Target, Shield, AlertCircle } from "lucide-react"

const sentimentData = [
  { name: "Tech", value: 35, sentiment: 0.8 },
  { name: "Finance", value: 25, sentiment: 0.6 },
  { name: "Healthcare", value: 20, sentiment: 0.7 },
  { name: "Energy", value: 12, sentiment: -0.3 },
  { name: "Retail", value: 8, sentiment: 0.2 },
]

const aiPredictions = [
  { symbol: "AAPL", prediction: "Bullish", confidence: 87, timeframe: "1W", target: "+5.2%" },
  { symbol: "TSLA", prediction: "Bearish", confidence: 73, timeframe: "3D", target: "-3.1%" },
  { symbol: "NVDA", prediction: "Bullish", confidence: 92, timeframe: "2W", target: "+8.7%" },
  { symbol: "MSFT", prediction: "Neutral", confidence: 65, timeframe: "1W", target: "+1.2%" },
]

const COLORS = ["#4169E1", "#DBBC58", "#2ECC71", "#E74C3C", "#9B59B6"]

export function AdvancedAnalytics() {
  const [marketScore, setMarketScore] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    // Animate market score
    const timer = setTimeout(() => setMarketScore(87), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* AI Market Sentiment */}
      <Card className="glass animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-glow" />
            AI Market Sentiment
            <Badge variant="secondary" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Real-time
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Market Score</span>
              <div className="flex items-center gap-2">
                <Progress value={marketScore} className="w-20" />
                <span className="text-sm font-bold text-accent">{marketScore}%</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-2">
              {sentimentData.map((sector, index) => (
                <div key={sector.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span>{sector.name}</span>
                  <Badge variant={sector.sentiment > 0 ? "default" : "destructive"} className="text-xs">
                    {sector.sentiment > 0 ? "+" : ""}
                    {(sector.sentiment * 100).toFixed(0)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Predictions */}
      <Card className="glass animate-slide-up" style={{ animationDelay: "200ms" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent animate-float" />
            AI Predictions
            <Badge variant="outline" className="text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              High Accuracy
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiPredictions.map((pred, index) => (
              <div
                key={pred.symbol}
                className="flex items-center justify-between p-3 rounded-lg bg-card/30 hover:bg-card/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold">{pred.symbol}</span>
                    {pred.prediction === "Bullish" ? (
                      <TrendingUp className="h-4 w-4 text-accent" />
                    ) : pred.prediction === "Bearish" ? (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    ) : (
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <Badge
                    variant={
                      pred.prediction === "Bullish"
                        ? "default"
                        : pred.prediction === "Bearish"
                          ? "destructive"
                          : "secondary"
                    }
                    className="text-xs"
                  >
                    {pred.prediction}
                  </Badge>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold">{pred.target}</div>
                  <div className="text-xs text-muted-foreground">
                    {pred.confidence}% • {pred.timeframe}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
