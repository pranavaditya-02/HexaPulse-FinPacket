import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown } from "lucide-react"

const gainers = [
  { symbol: "NVDA", name: "NVIDIA Corp", change: "+8.5%" },
  { symbol: "AMD", name: "Advanced Micro Devices", change: "+6.2%" },
  { symbol: "TSLA", name: "Tesla Inc", change: "+5.8%" },
]

const losers = [
  { symbol: "META", name: "Meta Platforms", change: "-4.2%" },
  { symbol: "NFLX", name: "Netflix Inc", change: "-3.8%" },
  { symbol: "PYPL", name: "PayPal Holdings", change: "-3.1%" },
]

export function TopMovers() {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Top Movers</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gainers" className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>Gainers</span>
            </TabsTrigger>
            <TabsTrigger value="losers" className="flex items-center space-x-1">
              <TrendingDown className="w-4 h-4" />
              <span>Losers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gainers" className="space-y-2 mt-4">
            {gainers.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between p-2 rounded glass-strong">
                <div>
                  <div className="font-semibold text-sm">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground">{stock.name}</div>
                </div>
                <div className="text-accent font-medium">{stock.change}</div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="losers" className="space-y-2 mt-4">
            {losers.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between p-2 rounded glass-strong">
                <div>
                  <div className="font-semibold text-sm">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground">{stock.name}</div>
                </div>
                <div className="text-destructive font-medium">{stock.change}</div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
