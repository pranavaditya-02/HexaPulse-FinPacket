"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/components/language-provider"
import { XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts"
import { Trophy, Target, Zap, TrendingUp, Brain, Award } from "lucide-react"

const performanceData = [
  { metric: "AI Accuracy", value: 94, target: 95, color: "text-accent" },
  { metric: "Prediction Success", value: 87, target: 90, color: "text-primary" },
  { metric: "Risk Assessment", value: 91, target: 85, color: "text-secondary" },
  { metric: "Market Coverage", value: 98, target: 95, color: "text-accent" },
]

const weeklyPerformance = [
  { day: "Mon", accuracy: 92, predictions: 45 },
  { day: "Tue", accuracy: 89, predictions: 52 },
  { day: "Wed", accuracy: 95, predictions: 48 },
  { day: "Thu", accuracy: 91, predictions: 56 },
  { day: "Fri", accuracy: 94, predictions: 43 },
  { day: "Sat", accuracy: 88, predictions: 31 },
  { day: "Sun", accuracy: 93, predictions: 28 },
]

export function PerformanceMetrics() {
  const [animatedValues, setAnimatedValues] = useState(performanceData.map(() => 0))
  const { t } = useLanguage()

  useEffect(() => {
    const timers = performanceData.map((_, index) =>
      setTimeout(() => {
        setAnimatedValues((prev) => {
          const newValues = [...prev]
          newValues[index] = performanceData[index].value
          return newValues
        })
      }, index * 200),
    )

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <Card className="glass animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-secondary animate-glow" />
          AI Performance Metrics
          <Badge variant="secondary" className="text-xs animate-float">
            <Award className="w-3 h-3 mr-1" />
            Premium Analytics
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance Metrics */}
          <div className="space-y-4">
            {performanceData.map((metric, index) => (
              <div
                key={metric.metric}
                className="space-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    {metric.metric}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${metric.color}`}>{animatedValues[index]}%</span>
                    {animatedValues[index] >= metric.target && <Target className="h-3 w-3 text-accent" />}
                  </div>
                </div>

                <div className="space-y-1">
                  <Progress value={animatedValues[index]} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Target: {metric.target}%</span>
                    <span className={animatedValues[index] >= metric.target ? "text-accent" : "text-muted-foreground"}>
                      {animatedValues[index] >= metric.target ? "✓ Achieved" : "In Progress"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Performance Chart */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              Weekly AI Performance
            </h4>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyPerformance}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis hide />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="hsl(var(--accent))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--accent))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-lg font-bold text-accent">94%</div>
                <div className="text-xs text-muted-foreground">Avg Accuracy</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-primary">303</div>
                <div className="text-xs text-muted-foreground">Total Predictions</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-secondary">+2.1%</div>
                <div className="text-xs text-muted-foreground">Week Growth</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium">Recent Achievements</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="animate-float">
              <Trophy className="w-3 h-3 mr-1" />
              95%+ Accuracy Streak
            </Badge>
            <Badge variant="outline" className="animate-float" style={{ animationDelay: "200ms" }}>
              <Target className="w-3 h-3 mr-1" />
              500+ Successful Predictions
            </Badge>
            <Badge variant="outline" className="animate-float" style={{ animationDelay: "400ms" }}>
              <Brain className="w-3 h-3 mr-1" />
              AI Model v2.1 Deployed
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
