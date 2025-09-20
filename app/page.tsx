import { Navigation } from "@/components/navigation"
import { DailyDigest } from "@/components/daily-digest"
import { AdvancedStockTicker } from "@/components/advanced-stock-ticker"
import { AISearch } from "@/components/ai-search"
import { QuickStats } from "@/components/quick-stats"
import { AIVoiceAssistant } from "@/components/ai-voice-assistant"
import { AdvancedAnalytics } from "@/components/advanced-analytics"
import { RealTimeNewsFeed } from "@/components/real-time-news-feed"
import { MarketHeatmapPreview } from "@/components/market-heatmap-preview"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Hero Section with AI Search */}
        <div className="text-center space-y-4 sm:space-y-6 py-8 sm:py-12 animate-slide-up">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-glow">
                HexaPulse FinPocket
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty px-4">
              Your AI-powered finance companion for real-time market insights, intelligent analysis, and smarter trading
              decisions
            </p>
          </div>

          <div className="max-w-2xl mx-auto px-4">
            <AISearch />
          </div>
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
          <div className="xl:col-span-1">
            <RealTimeNewsFeed />
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
