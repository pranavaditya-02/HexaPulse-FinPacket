"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { TrendingUp, TrendingDown, ArrowRight, Zap, Target } from "lucide-react"

const sectorData = [
  { name: "Technology", change: 2.4, size: "large", color: "bg-accent" },
  { name: "Healthcare", change: 1.8, size: "medium", color: "bg-primary" },
  { name: "Finance", change: -0.9, size: "large", color: "bg-destructive" },
  { name: "Energy", change: -2.1, size: "medium", color: "bg-destructive" },
  { name: "Consumer", change: 0.7, size: "small", color: "bg-secondary" },
  { name: "Industrial", change: 1.2, size: "small", color: "bg-accent" },
  { name: "Materials", change: -0.3, size: "small", color: "bg-muted" },
  { name: "Utilities", change: 0.4, size: "small", color: "bg-primary" },
]

export function MarketHeatmapPreview() {
  const [hoveredSector, setHoveredSector] = useState<string | null>(null)
  const { t } = useLanguage()

  const getSizeClass = (size: string) => {
    switch (size) {
      case "large":
        return "col-span-2 row-span-2 h-24"
      case "medium":
        return "col-span-2 h-16"
      case "small":
        return "col-span-1 h-12"
      default:
        return "col-span-1 h-12"
    }
  }

  return (
    <Card className="glass animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary animate-glow" />
            Market Sector Heatmap
            <Badge variant="secondary" className="text-xs animate-float">
              <Zap className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </CardTitle>

          <Link href="/heatmap">
            <Button variant="outline" size="sm" className="animate-float bg-transparent">
              View Full Heatmap
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {sectorData.map((sector, index) => (
            <div
              key={sector.name}
              className={`
                ${getSizeClass(sector.size)} 
                ${sector.color}/20 
                border-2 border-transparent
                rounded-lg p-3 cursor-pointer transition-all duration-300 
                hover:scale-105 hover:border-primary/50 hover:shadow-lg
                animate-slide-up
              `}
              style={{ animationDelay: `${index * 50}ms` }}
              onMouseEnter={() => setHoveredSector(sector.name)}
              onMouseLeave={() => setHoveredSector(null)}
            >
              <div className="flex flex-col justify-between h-full">
                <div className="flex items-center gap-1">
                  {sector.change > 0 ? (
                    <TrendingUp className="h-3 w-3 text-accent" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <span className="text-xs font-medium truncate">{sector.name}</span>
                </div>

                <div className="text-right">
                  <span className={`text-sm font-bold ${sector.change > 0 ? "text-accent" : "text-destructive"}`}>
                    {sector.change > 0 ? "+" : ""}
                    {sector.change}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hoveredSector && (
          <div className="p-3 bg-card/50 rounded-lg animate-slide-up">
            <p className="text-sm">
              <span className="font-medium">{hoveredSector}</span> sector showing{" "}
              {sectorData.find((s) => s.name === hoveredSector)?.change! > 0 ? "positive" : "negative"} momentum with
              AI-predicted volatility patterns.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
          <span>Updated 2 seconds ago</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>Bullish</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-destructive rounded-full" />
              <span>Bearish</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-muted rounded-full" />
              <span>Neutral</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
