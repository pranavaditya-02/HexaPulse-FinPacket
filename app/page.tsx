import { Navigation } from "@/components/navigation"
import { DailyDigest } from "@/components/daily-digest"
import { AdvancedStockTicker } from "@/components/advanced-stock-ticker"
import { QuickStats } from "@/components/quick-stats"
import { AdvancedAnalytics } from "@/components/advanced-analytics"
import { RealTimeNewsFeed } from "@/components/real-time-news-feed"
import { MarketHeatmapPreview } from "@/components/market-heatmap-preview"
import { LiveNewsStream } from "@/components/live-news-stream"
import { FilteredNewsFeed } from "@/components/filtered-news-feed"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: "350ms" }}>
          <LiveNewsStream />
          <FilteredNewsFeed />
        </div>
        {/* Advanced Real-time Stock Ticker */}
        <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
          <AdvancedStockTicker />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
          <AdvancedAnalytics />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "500ms" }}>
          <div className="xl:col-span-2">
            <QuickStats />
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "600ms" }}>
          <MarketHeatmapPreview />
        </div>

        {/* Daily Digest */}
        <div className="animate-slide-up" style={{ animationDelay: "700ms" }}>
          <DailyDigest />
        </div>
      </main>
    </div>
  )
}
