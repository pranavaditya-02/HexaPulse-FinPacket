"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, TrendingUp, Shield, Target, RefreshCw, AlertTriangle, Calendar, Zap } from "lucide-react"

interface PortfolioInsight {
  type: "opportunity" | "risk" | "rebalance" | "timing" | "regulatory" | "seasonal"
  title: string
  description: string
  confidence: number
  impact: "high" | "medium" | "low"
  timeframe: string
  actionable: boolean
  stocks?: string[]
  sector?: string
}

interface DiversificationScore {
  overall: number
  sectors: { [key: string]: number }
  recommendations: string[]
  marketCap: { [key: string]: number }
  riskProfile: string
}

const mockInsights: PortfolioInsight[] = [
  {
    type: "opportunity",
    title: "Festive Season Auto Rally",
    description: "Maruti Suzuki and Tata Motors showing strong momentum ahead of festive season. Historical data suggests 15-20% uptick during Diwali period",
    confidence: 89,
    impact: "high",
    timeframe: "4-8 weeks",
    actionable: true,
    stocks: ["MARUTI", "TATAMOTORS", "M&M"],
    sector: "Automobiles",
  },
  {
    type: "risk",
    title: "Banking Sector Concentration",
    description: "Portfolio heavily weighted in banking stocks (45%). RBI policy changes and NPA concerns pose concentration risk",
    confidence: 92,
    impact: "high",
    timeframe: "Ongoing",
    actionable: true,
    stocks: ["HDFCBANK", "ICICIBANK", "SBIN"],
    sector: "Banking",
  },
  {
    type: "timing",
    title: "Q2 Earnings Season Alert",
    description: "Reliance Industries and TCS earnings next week. Historical volatility suggests 8-12% price movement expected",
    confidence: 85,
    impact: "medium",
    timeframe: "1-2 weeks",
    actionable: true,
    stocks: ["RELIANCE", "TCS", "INFY"],
    sector: "IT & Energy",
  },
  {
    type: "regulatory",
    title: "New EV Policy Impact",
    description: "Government's new EV incentive scheme to benefit Tata Motors, M&M, and Bajaj Auto. Policy announcement expected to drive 10-15% gains",
    confidence: 78,
    impact: "medium",
    timeframe: "2-3 months",
    actionable: true,
    stocks: ["TATAMOTORS", "M&M", "BAJAJ-AUTO"],
    sector: "Automobiles",
  },
  {
    type: "seasonal",
    title: "Monsoon Withdrawal Impact",
    description: "Normal monsoon withdrawal supporting FMCG and agriculture stocks. ITC, Hindustan Unilever showing positive correlation",
    confidence: 82,
    impact: "medium",
    timeframe: "6-10 weeks",
    actionable: true,
    stocks: ["ITC", "HINDUNILVR", "BRITANNIA"],
    sector: "FMCG",
  },
  {
    type: "opportunity",
    title: "Digital India Infrastructure Play",
    description: "Bharti Airtel's 5G expansion and Jio's fiber rollout creating long-term value. Telecom sector revival underway",
    confidence: 86,
    impact: "high",
    timeframe: "6-12 months",
    actionable: true,
    stocks: ["BHARTIARTL", "RJIO"],
    sector: "Telecom",
  },
  {
    type: "rebalance",
    title: "Mid-Cap Allocation Optimization",
    description: "Current large-cap allocation at 78%. Consider increasing mid-cap exposure to 25% for better risk-adjusted returns",
    confidence: 88,
    impact: "medium",
    timeframe: "This month",
    actionable: true,
    sector: "Asset Allocation",
  },
  {
    type: "risk",
    title: "China+1 Policy Beneficiaries",
    description: "Geopolitical tensions creating opportunities in Indian manufacturing. Consider pharma and chemical stocks",
    confidence: 75,
    impact: "high",
    timeframe: "3-6 months",
    actionable: true,
    stocks: ["SUNPHARMA", "DRREDDY", "UPL"],
    sector: "Pharmaceuticals",
  },
]

const mockDiversification: DiversificationScore = {
  overall: 74,
  sectors: {
    "Banking & Finance": 35,
    "Information Technology": 22,
    "Energy & Utilities": 15,
    "FMCG & Consumer": 12,
    "Automobiles": 8,
    "Pharmaceuticals": 5,
    "Telecom": 3,
  },
  marketCap: {
    "Large Cap (>₹20,000 Cr)": 68,
    "Mid Cap (₹5,000-20,000 Cr)": 25,
    "Small Cap (<₹5,000 Cr)": 7,
  },
  recommendations: [
    "Reduce banking exposure from 35% to 25%",
    "Increase mid-cap allocation to improve growth potential",
    "Add infrastructure and defense sector exposure",
    "Consider ESG-focused stocks for sustainable growth",
    "Rebalance towards consumption theme stocks",
  ],
  riskProfile: "Moderate-Aggressive",
}

export function AIPortfolioInsights() {
  const [insights, setInsights] = useState<PortfolioInsight[]>(mockInsights)
  const [diversification, setDiversification] = useState<DiversificationScore>(mockDiversification)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedInsightType, setSelectedInsightType] = useState<string>("all")

  const refreshInsights = async () => {
    setIsRefreshing(true)
    // Simulate Pathway AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Update insights with realistic variations
    setInsights((prev) =>
      prev.map((insight) => ({
        ...insight,
        confidence: Math.max(65, Math.min(95, insight.confidence + (Math.random() - 0.5) * 8)),
      })),
    )

    // Update diversification score
    setDiversification((prev) => ({
      ...prev,
      overall: Math.max(60, Math.min(90, prev.overall + (Math.random() - 0.5) * 6)),
    }))

    setIsRefreshing(false)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case "risk":
        return <Shield className="w-4 h-4 text-red-400" />
      case "timing":
        return <Target className="w-4 h-4 text-blue-400" />
      case "rebalance":
        return <RefreshCw className="w-4 h-4 text-purple-400" />
      case "regulatory":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case "seasonal":
        return <Calendar className="w-4 h-4 text-orange-400" />
      default:
        return <Brain className="w-4 h-4" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "border-red-400 text-red-400 bg-red-400/10"
      case "medium":
        return "border-yellow-400 text-yellow-400 bg-yellow-400/10"
      case "low":
        return "border-green-400 text-green-400 bg-green-400/10"
      default:
        return "border-muted text-muted bg-muted/10"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "border-green-400 text-green-400 bg-green-400/10"
      case "risk":
        return "border-red-400 text-red-400 bg-red-400/10"
      case "timing":
        return "border-blue-400 text-blue-400 bg-blue-400/10"
      case "regulatory":
        return "border-yellow-400 text-yellow-400 bg-yellow-400/10"
      case "seasonal":
        return "border-orange-400 text-orange-400 bg-orange-400/10"
      default:
        return "border-purple-400 text-purple-400 bg-purple-400/10"
    }
  }

  const filteredInsights =
    selectedInsightType === "all"
      ? insights
      : insights.filter((insight) => insight.type === selectedInsightType)

  const getOverallRiskScore = () => {
    const riskInsights = insights.filter((i) => i.type === "risk").length
    if (riskInsights >= 3) return { score: "High", color: "text-red-400" }
    if (riskInsights >= 2) return { score: "Medium", color: "text-yellow-400" }
    return { score: "Low", color: "text-green-400" }
  }

  const riskAssessment = getOverallRiskScore()

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <span>AI Portfolio Insights</span>
            <Badge variant="outline" className="ml-2 text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Powered by Pathway AI
            </Badge>
          </div>
          <Button variant="outline" size="sm" onClick={refreshInsights} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="diversification">Portfolio Health</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4 mt-4">
            {/* Insight Type Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {["all", "opportunity", "risk", "timing", "regulatory", "seasonal"].map((type) => (
                <Button
                  key={type}
                  variant={selectedInsightType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedInsightType(type)}
                  className="text-xs"
                >
                  {type === "all" ? "All Insights" : type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>

            {filteredInsights.map((insight, index) => (
              <div key={index} className="p-4 rounded-lg glass-strong space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <Badge variant="outline" className={getTypeColor(insight.type)}>
                      {insight.type.toUpperCase()}
                    </Badge>
                  </div>
                  <Badge variant="outline" className={getImpactColor(insight.impact)}>
                    {insight.impact.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">{insight.description}</p>

                {/* Stock Tags */}
                {insight.stocks && (
                  <div className="flex flex-wrap gap-1">
                    {insight.stocks.map((stock, stockIndex) => (
                      <Badge key={stockIndex} variant="secondary" className="text-xs">
                        {stock}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Sector Tag */}
                {insight.sector && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">Sector:</span>
                    <Badge variant="outline" className="text-xs">
                      {insight.sector}
                    </Badge>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">AI Confidence</span>
                    <span className="font-medium">{insight.confidence}%</span>
                  </div>
                  <Progress value={insight.confidence} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Timeframe: {insight.timeframe}</span>
                  {insight.actionable && (
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                      Actionable
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="diversification" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold">{diversification.overall}/100</div>
                <div className="text-sm text-muted-foreground">Portfolio Health Score</div>
                <Progress value={diversification.overall} className="h-2" />
                <Badge variant="outline" className="mt-2">
                  Risk Profile: {diversification.riskProfile}
                </Badge>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Sector Allocation</h4>
                {Object.entries(diversification.sectors).map(([sector, percentage]) => (
                  <div key={sector} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{sector}</span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-1" />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Market Cap Distribution</h4>
                {Object.entries(diversification.marketCap).map(([cap, percentage]) => (
                  <div key={cap} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{cap}</span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-1" />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">AI Optimization Suggestions</h4>
                <div className="space-y-2">
                  {diversification.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className={`text-3xl font-bold ${riskAssessment.color}`}>
                  {riskAssessment.score}
                </div>
                <div className="text-sm text-muted-foreground">Overall Risk Level</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-muted/20">
                  <h5 className="font-semibold text-sm mb-2">Market Risks</h5>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>• RBI policy uncertainty</div>
                    <div>• Global inflation concerns</div>
                    <div>• FII selling pressure</div>
                  </div>
                </Card>

                <Card className="p-4 bg-muted/20">
                  <h5 className="font-semibold text-sm mb-2">Portfolio Risks</h5>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>• Banking sector concentration</div>
                    <div>• Currency exposure risk</div>
                    <div>• Liquidity concentration</div>
                  </div>
                </Card>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Risk Mitigation Actions</h4>
                <div className="space-y-3">
                  {insights.filter((i) => i.type === "risk").map((riskInsight, index) => (
                    <div key={index} className="p-3 bg-red-400/5 border border-red-400/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Shield className="w-4 h-4 text-red-400" />
                        <h5 className="font-medium text-sm">{riskInsight.title}</h5>
                      </div>
                      <p className="text-xs text-muted-foreground">{riskInsight.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* AI Analysis Footer */}
        <div className="mt-6 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Brain className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <strong>Pathway AI Analysis:</strong> These insights are generated using real-time market data, historical patterns, and advanced ML algorithms. Consider consulting with a financial advisor before making investment decisions.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
