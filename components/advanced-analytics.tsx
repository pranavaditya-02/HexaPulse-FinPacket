"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/components/language-provider"
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, Brain, Zap, Target, Shield, AlertCircle, IndianRupee } from "lucide-react"

const sentimentData = [
  { name: "Banking & Finance", value: 32, sentiment: 0.7 },
  { name: "Information Technology", value: 24, sentiment: 0.6 },
  { name: "Energy & Petrochemicals", value: 18, sentiment: -0.2 },
  { name: "FMCG & Consumer", value: 12, sentiment: 0.4 },
  { name: "Automobiles", value: 8, sentiment: 0.8 },
  { name: "Pharmaceuticals", value: 6, sentiment: 0.5 },
]

const aiPredictions = [
  { 
    symbol: "RELIANCE", 
    name: "Reliance Industries",
    prediction: "Bullish", 
    confidence: 89, 
    timeframe: "2W", 
    target: "+6.8%",
    sector: "Energy"
  },
  { 
    symbol: "TCS", 
    name: "Tata Consultancy Services",
    prediction: "Neutral", 
    confidence: 72, 
    timeframe: "1W", 
    target: "+1.5%",
    sector: "IT"
  },
  { 
    symbol: "HDFCBANK", 
    name: "HDFC Bank",
    prediction: "Bullish", 
    confidence: 91, 
    timeframe: "3W", 
    target: "+7.2%",
    sector: "Banking"
  },
  { 
    symbol: "BHARTIARTL", 
    name: "Bharti Airtel",
    prediction: "Bullish", 
    confidence: 85, 
    timeframe: "2W", 
    target: "+5.4%",
    sector: "Telecom"
  },
  { 
    symbol: "MARUTI", 
    name: "Maruti Suzuki",
    prediction: "Bullish", 
    confidence: 87, 
    timeframe: "4W", 
    target: "+8.3%",
    sector: "Auto"
  },
  { 
    symbol: "INFY", 
    name: "Infosys",
    prediction: "Bearish", 
    confidence: 76, 
    timeframe: "1W", 
    target: "-2.8%",
    sector: "IT"
  },
]

const COLORS = ["#4169E1", "#DBBC58", "#2ECC71", "#E74C3C", "#9B59B6", "#FF6B35"]

export function AdvancedAnalytics() {
  const [marketScore, setMarketScore] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    // Animate market score
    const timer = setTimeout(() => setMarketScore(74), 500)
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
              NSE/BSE Live
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

            <div className="grid grid-cols-1 gap-2">
              {sentimentData.map((sector, index) => (
                <div key={sector.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="font-medium">{sector.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{sector.value}%</span>
                    <Badge variant={sector.sentiment > 0 ? "default" : "destructive"} className="text-xs">
                      {sector.sentiment > 0 ? "+" : ""}
                      {(sector.sentiment * 100).toFixed(0)}%
                    </Badge>
                  </div>
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
            AI Stock Predictions
            <Badge variant="outline" className="text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              High Accuracy
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {aiPredictions.map((pred, index) => (
              <div
                key={pred.symbol}
                className="flex items-center justify-between p-3 rounded-lg bg-card/30 hover:bg-card/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm">{pred.symbol}</span>
                      {pred.prediction === "Bullish" ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : pred.prediction === "Bearish" ? (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      ) : (
                        <Shield className="h-4 w-4 text-yellow-400" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{pred.name}</span>
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
                  <div className="text-xs text-muted-foreground">
                    {pred.sector}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Market Insights */}
          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-2">
              <IndianRupee className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <div className="font-medium text-primary mb-1">Market Insight</div>
                <div className="text-muted-foreground">
                  Banking sector showing strong momentum with HDFC Bank leading. 
                  IT sector facing headwinds due to global uncertainties. 
                  Auto sector benefiting from festive season demand.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
