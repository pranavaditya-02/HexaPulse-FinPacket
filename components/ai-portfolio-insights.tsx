"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, TrendingUp, Shield, Target, RefreshCw } from "lucide-react"

interface PortfolioInsight {
  type: "opportunity" | "risk" | "rebalance" | "timing"
  title: string
  description: string
  confidence: number
  impact: "high" | "medium" | "low"
  timeframe: string
  actionable: boolean
}

interface DiversificationScore {
  overall: number
  sectors: { [key: string]: number }
  recommendations: string[]
}

const mockInsights: PortfolioInsight[] = [
  {
    type: "opportunity",
    title: "AI Sector Momentum",
    description: "NVIDIA showing strong technical indicators with 87% probability of continued uptrend",
    confidence: 87,
    impact: "high",
    timeframe: "2-4 weeks",
    actionable: true,
  },
  {
    type: "risk",
    title: "Tech Concentration Risk",
    description: "Portfolio heavily weighted in technology sector (65%). Consider diversification",
    confidence: 92,
    impact: "medium",
    timeframe: "Ongoing",
    actionable: true,
  },
  {
    type: "timing",
    title: "Earnings Season Approach",
    description: "Apple earnings in 2 weeks. Historical volatility suggests position adjustment",
    confidence: 78,
    impact: "medium",
    timeframe: "1-2 weeks",
    actionable: true,
  },
  {
    type: "rebalance",
    title: "Portfolio Rebalancing",
    description: "Current allocation deviates 15% from target. Rebalancing recommended",
    confidence: 95,
    impact: "low",
    timeframe: "This week",
    actionable: true,
  },
]

const mockDiversification: DiversificationScore = {
  overall: 72,
  sectors: {
    Technology: 65,
    Healthcare: 15,
    Finance: 12,
    Energy: 5,
    Consumer: 3,
  },
  recommendations: [
    "Reduce technology exposure by 15%",
    "Increase healthcare allocation to 20%",
    "Consider adding energy sector exposure",
    "Add international diversification",
  ],
}

export function AIPortfolioInsights() {
  const [insights, setInsights] = useState<PortfolioInsight[]>(mockInsights)
  const [diversification, setDiversification] = useState<DiversificationScore>(mockDiversification)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshInsights = async () => {
    setIsRefreshing(true)
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // Update insights with slight variations
    setInsights((prev) =>
      prev.map((insight) => ({
        ...insight,
        confidence: Math.max(60, Math.min(95, insight.confidence + (Math.random() - 0.5) * 10)),
      })),
    )
    setIsRefreshing(false)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="w-4 h-4 text-accent" />
      case "risk":
        return <Shield className="w-4 h-4 text-destructive" />
      case "timing":
        return <Target className="w-4 h-4 text-secondary" />
      case "rebalance":
        return <RefreshCw className="w-4 h-4 text-primary" />
      default:
        return <Brain className="w-4 h-4" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "border-destructive text-destructive bg-destructive/10"
      case "medium":
        return "border-secondary text-secondary bg-secondary/10"
      case "low":
        return "border-accent text-accent bg-accent/10"
      default:
        return "border-muted text-muted bg-muted/10"
    }
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <span>AI Portfolio Insights</span>
          </div>
          <Button variant="outline" size="sm" onClick={refreshInsights} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="diversification">Diversification</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4 mt-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 rounded-lg glass-strong space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                  </div>
                  <Badge variant="outline" className={getImpactColor(insight.impact)}>
                    {insight.impact.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">{insight.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-medium">{insight.confidence}%</span>
                  </div>
                  <Progress value={insight.confidence} className="h-1" />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Timeframe: {insight.timeframe}</span>
                  {insight.actionable && (
                    <Badge variant="outline" className="text-xs">
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
                <div className="text-sm text-muted-foreground">Diversification Score</div>
                <Progress value={diversification.overall} className="h-2" />
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
                <h4 className="font-semibold text-sm">AI Recommendations</h4>
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
        </Tabs>
      </CardContent>
    </Card>
  )
}
