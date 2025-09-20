"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Activity, Target, Zap, Brain, Award } from "lucide-react"

const stats = [
  {
    title: "Portfolio Value",
    value: "$124,563",
    change: "+2.4%",
    trend: "up",
    icon: DollarSign,
    animatedValue: 124563,
  },
  {
    title: "Day P&L",
    value: "+$2,847",
    change: "+1.2%",
    trend: "up",
    icon: TrendingUp,
    animatedValue: 2847,
  },
  {
    title: "Market Cap",
    value: "$45.2T",
    change: "-0.3%",
    trend: "down",
    icon: Activity,
    animatedValue: 45.2,
  },
  {
    title: "Active Positions",
    value: "12",
    change: "+2",
    trend: "up",
    icon: TrendingUp,
    animatedValue: 12,
  },
]

const marketScore = {
  score: 87,
  sentiment: "Bullish",
  factors: [
    { name: "Technical Analysis", score: 92, weight: 30 },
    { name: "Market Sentiment", score: 85, weight: 25 },
    { name: "Economic Indicators", score: 78, weight: 20 },
    { name: "Volatility Index", score: 91, weight: 15 },
    { name: "Volume Analysis", score: 89, weight: 10 },
  ],
}

export function QuickStats() {
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0))
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    // Animate stat values
    const timers = stats.map((stat, index) =>
      setTimeout(() => {
        setAnimatedValues((prev) => {
          const newValues = [...prev]
          newValues[index] = stat.animatedValue
          return newValues
        })
      }, index * 150),
    )

    // Animate market score
    const scoreTimer = setTimeout(() => {
      let current = 0
      const increment = marketScore.score / 50
      const scoreInterval = setInterval(() => {
        current += increment
        if (current >= marketScore.score) {
          current = marketScore.score
          clearInterval(scoreInterval)
        }
        setAnimatedScore(Math.floor(current))
      }, 20)
    }, 800)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(scoreTimer)
    }
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent" // Emerald Green
    if (score >= 60) return "text-secondary" // Gold
    return "text-destructive" // Red
  }

  const getScoreBackgroundColor = (score: number) => {
    if (score >= 80) return "bg-accent/20 border-accent/30"
    if (score >= 60) return "bg-secondary/20 border-secondary/30"
    return "bg-destructive/20 border-destructive/30"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { text: "Excellent", variant: "default" as const }
    if (score >= 70) return { text: "Good", variant: "secondary" as const }
    if (score >= 50) return { text: "Fair", variant: "outline" as const }
    return { text: "Poor", variant: "destructive" as const }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overall Market Score */}
      <Card className="glass animate-slide-up">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-pulse-glow" />
              <span className="text-sm sm:text-base">AI Market Sentiment</span>
              <Badge className="animate-float bg-secondary/20 text-secondary border-secondary/30">Real-time</Badge>
              <Badge {...getScoreBadge(marketScore.score)} className="animate-float">
                <Award className="w-3 h-3 mr-1" />
                {getScoreBadge(marketScore.score).text}
              </Badge>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-sm text-muted-foreground">Overall Market Score</div>
              <div className={`text-3xl sm:text-4xl font-bold font-mono ${getScoreColor(animatedScore)} animate-glow`}>
                {animatedScore}%
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgb(var(--muted))"
                  strokeWidth="8"
                  fill="none"
                  className="opacity-20"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgb(var(--accent))"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - animatedScore / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(animatedScore)}`}>{animatedScore}%</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Market Sentiment</span>
            <span className={`text-sm font-bold ${getScoreColor(marketScore.score)}`}>{marketScore.sentiment}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm font-medium">Tech</span>
              </div>
              <span className="text-sm font-bold text-primary">+80%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 border border-secondary/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-sm font-medium">Finance</span>
              </div>
              <span className="text-sm font-bold text-secondary">+60%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-sm font-medium">Healthcare</span>
              </div>
              <span className="text-sm font-bold text-accent">+70%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <span className="text-sm font-medium">Energy</span>
              </div>
              <span className="text-sm font-bold text-destructive">-30%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-chart-5/10 border border-chart-5/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "rgb(var(--chart-5))" }}></div>
                <span className="text-sm font-medium">Retail</span>
              </div>
              <span className="text-sm font-bold" style={{ color: "rgb(var(--chart-5))" }}>
                +20%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {marketScore.factors.map((factor, index) => (
              <div
                key={factor.name}
                className="flex items-center justify-between p-3 rounded-lg glass-strong animate-fade-in"
                style={{ animationDelay: `${index * 100 + 1000}ms` }}
              >
                <div className="flex items-center gap-2">
                  <Target className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium">{factor.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${getScoreColor(factor.score)}`}>{factor.score}</span>
                  <span className="text-xs text-muted-foreground">({factor.weight}%)</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="glass animate-scale-in hover:glass-strong transition-all duration-300 hover:animate-pulse-glow"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon
                className={`h-4 w-4 animate-bounce-subtle ${stat.trend === "up" ? "text-accent" : "text-destructive"}`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold font-mono animate-glow">
                {stat.title === "Portfolio Value" && `$${animatedValues[index].toLocaleString()}`}
                {stat.title === "Day P&L" && `+$${animatedValues[index].toLocaleString()}`}
                {stat.title === "Market Cap" && `$${animatedValues[index]}T`}
                {stat.title === "Active Positions" && animatedValues[index]}
              </div>
              <div
                className={`flex items-center space-x-1 text-xs animate-slide-right ${
                  stat.trend === "up" ? "text-accent" : "text-destructive"
                }`}
                style={{ animationDelay: `${index * 100 + 500}ms` }}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 animate-float" />
                ) : (
                  <TrendingDown className="w-3 h-3 animate-float" />
                )}
                <span>{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Insights */}
      <Card className="glass animate-fade-in" style={{ animationDelay: "1200ms" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-secondary animate-rotate-slow" />
            <span className="text-sm sm:text-base">AI Market Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg glass-strong animate-pulse-glow">
              <div className="text-xl sm:text-2xl font-bold text-accent">94%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Prediction Accuracy</div>
            </div>
            <div
              className="text-center p-4 rounded-lg glass-strong animate-pulse-glow"
              style={{ animationDelay: "200ms" }}
            >
              <div className="text-xl sm:text-2xl font-bold text-primary">15.2%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Expected Return</div>
            </div>
            <div
              className="text-center p-4 rounded-lg glass-strong animate-pulse-glow"
              style={{ animationDelay: "400ms" }}
            >
              <div className="text-xl sm:text-2xl font-bold text-secondary">Low</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Risk Level</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
