import { Navigation } from "@/components/navigation"
import { WatchlistManager } from "@/components/watchlist-manager"
import { AIPortfolioInsights } from "@/components/ai-portfolio-insights"
import { SmartStockRecommendations } from "@/components/smart-stock-recommendations"

export default function WatchlistPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Smart Watchlist</h1>
          <p className="text-muted-foreground">
            Track your favorite stocks with AI-powered predictions and risk analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WatchlistManager />
            <SmartStockRecommendations />
          </div>
          <div>
            <AIPortfolioInsights />
          </div>
        </div>
      </main>
    </div>
  )
}
