import { Navigation } from "@/components/navigation"
import { DailyDigest } from "@/components/daily-digest"
import { MarketSummary } from "@/components/market-summary"
import { TopMovers } from "@/components/top-movers"

export default function DigestPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Personalized Daily Digest</h1>
          <p className="text-muted-foreground">
            Your comprehensive daily briefing on market movements, news, and portfolio insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <MarketSummary />
            <TopMovers />
          </div>
          <div>
            <DailyDigest />
          </div>
        </div>
      </main>
    </div>
  )
}
