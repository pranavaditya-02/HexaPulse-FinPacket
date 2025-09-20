import { Navigation } from "@/components/navigation"
import { InteractiveHeatmap } from "@/components/interactive-heatmap"
import { SectorAnalysis } from "@/components/sector-analysis"
import { MarketOverview } from "@/components/market-overview"

export default function HeatmapPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Market Sentiment Heatmap</h1>
          <p className="text-muted-foreground">
            Visual representation of market sentiment across different sectors and assets
          </p>
        </div>

        <MarketOverview />
        <InteractiveHeatmap />
        <SectorAnalysis />
      </main>
    </div>
  )
}
