"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Newspaper, ExternalLink, Clock, TrendingUp, AlertTriangle, Zap } from "lucide-react"

const mockNews = [
  {
    id: 1,
    title: "Federal Reserve Signals Potential Rate Cut in Q2",
    summary: "Fed officials hint at monetary policy shift amid economic indicators",
    impact: "high",
    sentiment: "positive",
    time: "2 min ago",
    source: "Reuters",
    category: "Monetary Policy",
  },
  {
    id: 2,
    title: "Tech Giants Report Strong Q4 Earnings",
    summary: "Apple, Microsoft, and Google exceed analyst expectations",
    impact: "medium",
    sentiment: "positive",
    time: "15 min ago",
    source: "Bloomberg",
    category: "Earnings",
  },
  {
    id: 3,
    title: "Oil Prices Surge on Middle East Tensions",
    summary: "Crude oil jumps 3% as geopolitical concerns mount",
    impact: "high",
    sentiment: "negative",
    time: "32 min ago",
    source: "CNBC",
    category: "Commodities",
  },
  {
    id: 4,
    title: "AI Chip Demand Drives Semiconductor Rally",
    summary: "NVIDIA and AMD lead sector gains on AI infrastructure growth",
    impact: "medium",
    sentiment: "positive",
    time: "1 hour ago",
    source: "MarketWatch",
    category: "Technology",
  },
]

export function RealTimeNewsFeed() {
  const [news, setNews] = useState(mockNews)
  const [filter, setFilter] = useState<"all" | "high" | "positive" | "negative">("all")
  const { t } = useLanguage()

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setNews((prev) =>
        prev.map((item) => ({
          ...item,
          time: updateTimeAgo(item.time),
        })),
      )
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const updateTimeAgo = (time: string) => {
    const minutes = Number.parseInt(time.split(" ")[0])
    return `${minutes + 1} min ago`
  }

  const filteredNews = news.filter((item) => {
    if (filter === "high") return item.impact === "high"
    if (filter === "positive") return item.sentiment === "positive"
    if (filter === "negative") return item.sentiment === "negative"
    return true
  })

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "medium":
        return <TrendingUp className="h-4 w-4 text-secondary" />
      default:
        return <Zap className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card className="glass animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary animate-float" />
            {t.breakingNews}
            <Badge variant="destructive" className="text-xs animate-pulse">
              LIVE
            </Badge>
          </CardTitle>

          <div className="flex gap-1">
            {["high", "positive", "negative"].map((filterType) => (
              <Button
                key={filterType}
                size="sm"
                variant={filter === filterType ? "default" : "ghost"}
                onClick={() => setFilter(filterType as any)}
                className="text-xs capitalize"
              >
                {filterType}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredNews.map((item, index) => (
            <div
              key={item.id}
              className="p-4 rounded-lg bg-card/30 hover:bg-card/50 transition-all duration-300 animate-slide-up border-l-4 border-primary/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getImpactIcon(item.impact)}
                  <Badge variant={item.sentiment === "positive" ? "default" : "destructive"} className="text-xs">
                    {item.category}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {item.time}
                </div>
              </div>

              <h4 className="font-semibold text-sm mb-1 line-clamp-2">{item.title}</h4>

              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.summary}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary">{item.source}</span>

                <Button size="sm" variant="ghost" className="h-6 px-2">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
