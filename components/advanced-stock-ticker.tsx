"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: string
  chartData: { time: string; price: number }[]
}

// Mock real-time data generator
const generateChartData = (basePrice: number) => {
  const data = []
  let currentPrice = basePrice
  for (let i = 0; i < 24; i++) {
    currentPrice += (Math.random() - 0.5) * 2
    data.push({
      time: `${i}:00`,
      price: Math.max(0, currentPrice),
    })
  }
  return data
}

const mockStocks: StockData[] = [
  {
    symbol: "AAPL",
    price: 175.43,
    change: 2.15,
    changePercent: 1.24,
    volume: 45678900,
    marketCap: "2.8T",
    chartData: generateChartData(173),
  },
  {
    symbol: "GOOGL",
    price: 2847.52,
    change: -15.23,
    changePercent: -0.53,
    volume: 1234567,
    marketCap: "1.8T",
    chartData: generateChartData(2860),
  },
  {
    symbol: "MSFT",
    price: 378.85,
    change: 4.67,
    changePercent: 1.25,
    volume: 23456789,
    marketCap: "2.9T",
    chartData: generateChartData(374),
  },
  {
    symbol: "TSLA",
    price: 248.42,
    change: -8.15,
    changePercent: -3.18,
    volume: 67890123,
    marketCap: "789B",
    chartData: generateChartData(256),
  },
  {
    symbol: "NVDA",
    price: 875.28,
    change: 23.67,
    changePercent: 2.78,
    volume: 34567890,
    marketCap: "2.1T",
    chartData: generateChartData(851),
  },
]

export function AdvancedStockTicker() {
  const [stocks, setStocks] = useState<StockData[]>(mockStocks)
  const [selectedStock, setSelectedStock] = useState<StockData>(mockStocks[0])

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStocks((prev) =>
        prev.map((stock) => {
          const priceChange = (Math.random() - 0.5) * 2
          const newPrice = Math.max(0, stock.price + priceChange)
          const newChange = stock.change + (Math.random() - 0.5) * 0.5
          const newChangePercent = (newChange / (newPrice - newChange)) * 100

          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            volume: stock.volume + Math.floor(Math.random() * 10000),
            chartData: [
              ...stock.chartData.slice(1),
              {
                time: new Date().toLocaleTimeString(),
                price: newPrice,
              },
            ],
          }
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Update selected stock when stocks change
    const updatedStock = stocks.find((s) => s.symbol === selectedStock.symbol)
    if (updatedStock) {
      setSelectedStock(updatedStock)
    }
  }, [stocks, selectedStock.symbol])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stock Ticker Bar */}
      <Card className="glass animate-slide-up">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse-glow" />
              <span className="text-sm sm:text-base">Live Market Data</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span>Real-time</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex space-x-3 sm:space-x-6 min-w-max pb-2">
              {stocks.map((stock, index) => (
                <button
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock)}
                  className={`flex items-center space-x-2 sm:space-x-3 min-w-[140px] sm:min-w-[160px] p-2 sm:p-3 rounded-lg transition-all animate-scale-in ${
                    selectedStock.symbol === stock.symbol
                      ? "glass-strong border-primary/50 animate-pulse-glow"
                      : "glass hover:glass-strong"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-left">
                    <div className="font-semibold font-mono text-sm sm:text-base">{stock.symbol}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">${stock.price.toFixed(2)}</div>
                  </div>

                  <div
                    className={`flex items-center space-x-1 text-xs ${
                      stock.change >= 0 ? "text-accent" : "text-destructive"
                    }`}
                  >
                    {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{stock.changePercent.toFixed(2)}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stock View */}
      <Card className="glass animate-fade-in">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-xl sm:text-2xl font-bold animate-slide-right">{selectedStock.symbol}</span>
                <div
                  className={`flex items-center space-x-1 animate-bounce-subtle ${
                    selectedStock.change >= 0 ? "text-accent" : "text-destructive"
                  }`}
                >
                  {selectedStock.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                  <span className="text-base sm:text-lg font-semibold">{selectedStock.changePercent.toFixed(2)}%</span>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono animate-glow">
                ${selectedStock.price.toFixed(2)}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:block lg:text-right gap-4 lg:gap-0 lg:space-y-1">
              <div>
                <div className="text-xs sm:text-sm text-muted-foreground">Market Cap</div>
                <div className="font-semibold text-sm sm:text-base">{selectedStock.marketCap}</div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-muted-foreground">Volume</div>
                <div className="font-semibold text-sm sm:text-base">{selectedStock.volume.toLocaleString()}</div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chart" className="text-xs sm:text-sm">
                Price Chart
              </TabsTrigger>
              <TabsTrigger value="details" className="text-xs sm:text-sm">
                Details
              </TabsTrigger>
              <TabsTrigger value="news" className="text-xs sm:text-sm">
                News
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="mt-4 sm:mt-6">
              <div className="h-64 sm:h-80 w-full animate-fade-in bg-background/50 rounded-lg p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedStock.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "rgb(var(--muted-foreground))" }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "rgb(var(--muted-foreground))" }}
                      domain={["dataMin - 5", "dataMax + 5"]}
                      width={60}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgb(var(--card))",
                        border: "1px solid rgb(var(--border))",
                        borderRadius: "8px",
                        backdropFilter: "blur(12px)",
                        fontSize: "12px",
                      }}
                      labelStyle={{ color: "rgb(var(--foreground))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={selectedStock.change >= 0 ? "rgb(var(--accent))" : "rgb(var(--destructive))"}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{
                        r: 4,
                        stroke: selectedStock.change >= 0 ? "rgb(var(--accent))" : "rgb(var(--destructive))",
                        strokeWidth: 2,
                        fill: "rgb(var(--background))",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-4 sm:mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Open</span>
                    <span className="font-mono text-sm">
                      ${(selectedStock.price - selectedStock.change).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">High</span>
                    <span className="font-mono text-sm">
                      ${(selectedStock.price + Math.abs(selectedStock.change)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Low</span>
                    <span className="font-mono text-sm">
                      ${(selectedStock.price - Math.abs(selectedStock.change)).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Volume</span>
                    <span className="font-mono text-sm">{selectedStock.volume.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Market Cap</span>
                    <span className="font-mono text-sm">{selectedStock.marketCap}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">P/E Ratio</span>
                    <span className="font-mono text-sm">{(Math.random() * 30 + 10).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="news" className="mt-4 sm:mt-6">
              <div className="space-y-3">
                <div className="p-3 rounded-lg glass-strong">
                  <div className="font-semibold text-sm">Earnings Beat Expected</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedStock.symbol} reports strong quarterly results with revenue growth of 12%
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">2 hours ago</div>
                </div>
                <div className="p-3 rounded-lg glass-strong">
                  <div className="font-semibold text-sm">Analyst Upgrade</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Goldman Sachs raises price target to ${(selectedStock.price * 1.15).toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">4 hours ago</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
