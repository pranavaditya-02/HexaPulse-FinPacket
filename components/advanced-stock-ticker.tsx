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
    currentPrice += (Math.random() - 0.5) * (basePrice * 0.02) // 2% volatility
    data.push({
      time: `${i}:00`,
      price: Math.max(0, currentPrice),
    })
  }
  return data
}

const mockStocks: StockData[] = [
  {
    symbol: "RELIANCE",
    price: 2847.50,
    change: 42.30,
    changePercent: 1.51,
    volume: 12456780,
    marketCap: "19.2L Cr",
    chartData: generateChartData(2805),
  },
  {
    symbol: "TCS",
    price: 3965.80,
    change: -25.40,
    changePercent: -0.64,
    volume: 8934567,
    marketCap: "14.8L Cr",
    chartData: generateChartData(3991),
  },
  {
    symbol: "HDFCBANK",
    price: 1684.25,
    change: 18.75,
    changePercent: 1.13,
    volume: 15678934,
    marketCap: "12.9L Cr",
    chartData: generateChartData(1665),
  },
  {
    symbol: "INFY",
    price: 1789.40,
    change: -12.60,
    changePercent: -0.70,
    volume: 11234567,
    marketCap: "7.5L Cr",
    chartData: generateChartData(1802),
  },
  {
    symbol: "ICICIBANK",
    price: 1156.75,
    change: 23.20,
    changePercent: 2.05,
    volume: 18765432,
    marketCap: "8.1L Cr",
    chartData: generateChartData(1133),
  },
  {
    symbol: "HINDUNILVR",
    price: 2634.90,
    change: 8.50,
    changePercent: 0.32,
    volume: 3456789,
    marketCap: "6.2L Cr",
    chartData: generateChartData(2626),
  },
  {
    symbol: "BHARTIARTL",
    price: 1548.30,
    change: -15.80,
    changePercent: -1.01,
    volume: 9876543,
    marketCap: "8.7L Cr",
    chartData: generateChartData(1564),
  },
  {
    symbol: "ITC",
    price: 456.85,
    change: 6.45,
    changePercent: 1.43,
    volume: 25678901,
    marketCap: "5.7L Cr",
    chartData: generateChartData(450),
  },
  {
    symbol: "LICI",
    price: 894.20,
    change: -11.30,
    changePercent: -1.25,
    volume: 4567890,
    marketCap: "5.6L Cr",
    chartData: generateChartData(905),
  },
  {
    symbol: "SBIN",
    price: 798.45,
    change: 12.85,
    changePercent: 1.64,
    volume: 14567891,
    marketCap: "7.1L Cr",
    chartData: generateChartData(785),
  },
  {
    symbol: "BAJFINANCE",
    price: 6789.25,
    change: -89.45,
    changePercent: -1.30,
    volume: 2345678,
    marketCap: "4.2L Cr",
    chartData: generateChartData(6878),
  },
  {
    symbol: "LTIM",
    price: 5234.60,
    change: 78.90,
    changePercent: 1.53,
    volume: 1789456,
    marketCap: "1.5L Cr",
    chartData: generateChartData(5155),
  },
  {
    symbol: "MARUTI",
    price: 11245.80,
    change: 125.40,
    changePercent: 1.13,
    volume: 987654,
    marketCap: "3.4L Cr",
    chartData: generateChartData(11120),
  },
  {
    symbol: "ASIANPAINT",
    price: 2945.30,
    change: -34.70,
    changePercent: -1.16,
    volume: 1456789,
    marketCap: "2.8L Cr",
    chartData: generateChartData(2980),
  },
  {
    symbol: "NESTLEIND",
    price: 2187.65,
    change: 23.45,
    changePercent: 1.08,
    volume: 567890,
    marketCap: "2.1L Cr",
    chartData: generateChartData(2164),
  },
  {
    symbol: "KOTAKBANK",
    price: 1756.20,
    change: -18.95,
    changePercent: -1.07,
    volume: 6789012,
    marketCap: "3.5L Cr",
    chartData: generateChartData(1775),
  },
  {
    symbol: "HCLTECH",
    price: 1534.75,
    change: 21.85,
    changePercent: 1.44,
    volume: 3456789,
    marketCap: "4.2L Cr",
    chartData: generateChartData(1512),
  },
  {
    symbol: "WIPRO",
    price: 545.90,
    change: -7.60,
    changePercent: -1.37,
    volume: 8901234,
    marketCap: "3.0L Cr",
    chartData: generateChartData(553),
  },
  {
    symbol: "ADANIPORTS",
    price: 1189.45,
    change: 28.75,
    changePercent: 2.48,
    volume: 5678901,
    marketCap: "2.4L Cr",
    chartData: generateChartData(1160),
  },
  {
    symbol: "POWERGRID",
    price: 234.80,
    change: 3.25,
    changePercent: 1.40,
    volume: 12345678,
    marketCap: "2.2L Cr",
    chartData: generateChartData(231),
  },
  {
    symbol: "NTPC",
    price: 356.90,
    change: -4.15,
    changePercent: -1.15,
    volume: 9876543,
    marketCap: "3.5L Cr",
    chartData: generateChartData(361),
  },
  {
    symbol: "JSWSTEEL",
    price: 923.40,
    change: 15.60,
    changePercent: 1.72,
    volume: 4567890,
    marketCap: "2.3L Cr",
    chartData: generateChartData(907),
  },
]

export function AdvancedStockTicker() {
  const [stocks, setStocks] = useState<StockData[]>(mockStocks)
  const [selectedStock, setSelectedStock] = useState<StockData>(mockStocks[0])

  useEffect(() => {
    // Simulate real-time updates with Indian market characteristics
    const interval = setInterval(() => {
      setStocks((prev) =>
        prev.map((stock) => {
          // More realistic price movements for Indian stocks
          const volatility = stock.price > 2000 ? 0.008 : 0.012 // Higher volatility for lower-priced stocks
          const priceChange = (Math.random() - 0.5) * (stock.price * volatility)
          const newPrice = Math.max(0, stock.price + priceChange)
          const newChange = stock.change + (Math.random() - 0.5) * 2
          const newChangePercent = (newChange / (newPrice - newChange)) * 100

          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            volume: stock.volume + Math.floor(Math.random() * 50000),
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
              <span className="text-sm sm:text-base">Indian Stock Market Live</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span>NSE Real-time</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto scrollbar-hide">
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
                    <div className="text-xs sm:text-sm text-muted-foreground">₹{stock.price.toFixed(2)}</div>
                  </div>

                  <div
                    className={`flex items-center space-x-1 text-xs ${
                      stock.change >= 0 ? "text-green-400" : "text-red-400"
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
                    selectedStock.change >= 0 ? "text-green-400" : "text-red-400"
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
                ₹{selectedStock.price.toFixed(2)}
              </div>
              <div className={`text-sm font-medium ${
                selectedStock.change >= 0 ? "text-green-400" : "text-red-400"
              }`}>
                {selectedStock.change >= 0 ? "Up" : "Down"} by {Math.abs(selectedStock.changePercent).toFixed(1)}% in last 31 days
              </div>
            </div>

            <div className="grid grid-cols-2 lg:block lg:text-right gap-4 lg:gap-0 lg:space-y-1">
              <div>
                <div className="text-xs sm:text-sm text-muted-foreground">Market Cap</div>
                <div className="font-semibold text-sm sm:text-base">{selectedStock.marketCap}</div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-muted-foreground">Volume</div>
                <div className="font-semibold text-sm sm:text-base">{selectedStock.volume.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chart" className="text-xs sm:text-sm">
                Price Chart
              </TabsTrigger>
              <TabsTrigger value="details" className="text-xs sm:text-sm">
                Details
              </TabsTrigger>
              <TabsTrigger value="news" className="text-xs sm:text-sm">
                News
              </TabsTrigger>
              <TabsTrigger value="ai-recommendation" className="text-xs sm:text-sm">
                AI Recommendation
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
                      formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, "Price"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={selectedStock.change >= 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{
                        r: 4,
                        stroke: selectedStock.change >= 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)",
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
                      ₹{(selectedStock.price - selectedStock.change).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">High</span>
                    <span className="font-mono text-sm">
                      ₹{(selectedStock.price + Math.abs(selectedStock.change)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Low</span>
                    <span className="font-mono text-sm">
                      ₹{(selectedStock.price - Math.abs(selectedStock.change)).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Volume</span>
                    <span className="font-mono text-sm">{selectedStock.volume.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Market Cap</span>
                    <span className="font-mono text-sm">{selectedStock.marketCap}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">P/E Ratio</span>
                    <span className="font-mono text-sm">{(Math.random() * 30 + 15).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="news" className="mt-4 sm:mt-6">
              <div className="space-y-3">
                <div className="p-3 rounded-lg glass-strong">
                  <div className="font-semibold text-sm">Q3 Results Announced</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedStock.symbol} reports strong quarterly results with 15% revenue growth YoY
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">1 hour ago</div>
                </div>
                <div className="p-3 rounded-lg glass-strong">
                  <div className="font-semibold text-sm">Broker Recommendation</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ICICI Securities upgrades {selectedStock.symbol} target price to ₹{(selectedStock.price * 1.12).toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">3 hours ago</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai-recommendation" className="mt-4 sm:mt-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg glass-strong">
                  <h3 className="font-semibold text-base mb-4">Recommendation Details</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Buy at</div>
                        <div className="text-lg font-bold font-mono">
                          ₹{(selectedStock.price * 0.95).toFixed(2)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Recommended Date</div>
                        <div className="text-sm font-medium">
                          {new Date().toLocaleDateString('en-GB', { 
                            day: '2-digit', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Target Price</div>
                        <div className="text-lg font-bold font-mono">
                          ₹{(selectedStock.price * 1.15).toFixed(2)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Target Price Valid Until</div>
                        <div className="text-sm font-medium">
                          {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { 
                            day: '2-digit', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/30">
                    <div className="text-sm text-muted-foreground mb-2">LTP</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold font-mono">
                        ₹{selectedStock.price.toFixed(2)}
                      </span>
                      <span className={`text-sm font-medium ${
                        selectedStock.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        {selectedStock.change >= 0 ? "+" : ""}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
