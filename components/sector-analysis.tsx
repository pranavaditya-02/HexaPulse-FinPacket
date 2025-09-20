import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3 } from "lucide-react"

const sectorAnalysis = [
  { name: "Technology", bullish: 78, bearish: 22, volume: "High" },
  { name: "Healthcare", bullish: 65, bearish: 35, volume: "Medium" },
  { name: "Finance", bullish: 72, bearish: 28, volume: "High" },
  { name: "Energy", bullish: 35, bearish: 65, volume: "Low" },
  { name: "Consumer", bullish: 58, bearish: 42, volume: "Medium" },
  { name: "Industrial", bullish: 62, bearish: 38, volume: "Medium" },
]

export function SectorAnalysis() {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <span>Sector Sentiment Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sectorAnalysis.map((sector) => (
          <div key={sector.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{sector.name}</span>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-muted-foreground">Volume:</span>
                <span
                  className={
                    sector.volume === "High"
                      ? "text-accent"
                      : sector.volume === "Medium"
                        ? "text-secondary"
                        : "text-muted-foreground"
                  }
                >
                  {sector.volume}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-accent">Bullish {sector.bullish}%</span>
                <span className="text-destructive">Bearish {sector.bearish}%</span>
              </div>
              <Progress value={sector.bullish} className="h-2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
