"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface IndexData {
  name: string
  value: number
  change: number
  changePercent: number
  high: number
  low: number
  baseValue: number // Original value for realistic fluctuations
}

export function IndianMarketIndices() {
  const [indices, setIndices] = useState<IndexData[]>([
    {
      name: "SENSEX",
      value: 81159.68,
      change: 245.32,
      changePercent: 0.30,
      high: 81245.89,
      low: 80892.15,
      baseValue: 81159.68
    },
    {
      name: "NIFTY",
      value: 24890.85,
      change: 76.20,
      changePercent: 0.31,
      high: 24965.40,
      low: 24815.30,
      baseValue: 24890.85
    },
  ])

  const [animatedValues, setAnimatedValues] = useState<number[]>([])
  const [isMarketOpen, setIsMarketOpen] = useState(true)

  useEffect(() => {
    // Initialize animated values
    setAnimatedValues(indices.map(index => index.value))
  }, [])

  // Check if market is open (9:15 AM - 3:30 PM IST on weekdays)
  useEffect(() => {
    const checkMarketHours = () => {
      const now = new Date()
      const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
      const hours = istTime.getHours()
      const minutes = istTime.getMinutes()
      const day = istTime.getDay()
      
      // Market is open Monday-Friday, 9:15 AM - 3:30 PM IST
      const isWeekday = day >= 1 && day <= 5
      const isMarketTime = (hours > 9 || (hours === 9 && minutes >= 15)) && 
                          (hours < 15 || (hours === 15 && minutes <= 30))
      
      setIsMarketOpen(isWeekday && isMarketTime)
    }

    checkMarketHours()
    const marketTimer = setInterval(checkMarketHours, 60000) // Check every minute

    return () => clearInterval(marketTimer)
  }, [])

  // Realistic market data updates
  useEffect(() => {
    if (!isMarketOpen) return

    const interval = setInterval(() => {
      setIndices(prevIndices => 
        prevIndices.map((index, idx) => {
          // Generate realistic price movement (0.01% to 0.1% change)
          const volatility = index.name === "SENSEX" ? 0.0008 : 0.001
          const randomChange = (Math.random() - 0.5) * volatility
          const newValue = index.value * (1 + randomChange)
          
          // Calculate change from base value
          const totalChange = newValue - index.baseValue
          const totalChangePercent = (totalChange / index.baseValue) * 100
          
          // Update high/low realistically
          const newHigh = Math.max(index.high, newValue)
          const newLow = Math.min(index.low, newValue)
          
          // Animate the value change
          setTimeout(() => {
            setAnimatedValues(prev => {
              const newAnimated = [...prev]
              newAnimated[idx] = newValue
              return newAnimated
            })
          }, 100)

          return {
            ...index,
            value: newValue,
            change: totalChange,
            changePercent: totalChangePercent,
            high: newHigh,
            low: newLow
          }
        })
      )
    }, 2000 + Math.random() * 3000) // Random interval between 2-5 seconds

    return () => clearInterval(interval)
  }, [isMarketOpen])

  // Smooth value animation
  useEffect(() => {
    indices.forEach((index, idx) => {
      const startValue = animatedValues[idx] || index.value
      const endValue = index.value
      const duration = 1000 // 1 second animation
      const steps = 30
      const stepValue = (endValue - startValue) / steps
      
      let currentStep = 0
      const animationInterval = setInterval(() => {
        currentStep++
        const newValue = startValue + (stepValue * currentStep)
        
        setAnimatedValues(prev => {
          const newAnimated = [...prev]
          newAnimated[idx] = newValue
          return newAnimated
        })
        
        if (currentStep >= steps) {
          clearInterval(animationInterval)
          setAnimatedValues(prev => {
            const newAnimated = [...prev]
            newAnimated[idx] = endValue
            return newAnimated
          })
        }
      }, duration / steps)
    })
  }, [indices])

  const formatValue = (value: number) => {
    return Math.round(value * 100) / 100 // Round to 2 decimal places
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${formatValue(change)}`
  }

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? "+" : ""
    return `(${sign}${formatValue(percent)}%)`
  }

  return (
    <Card className="glass animate-scale-in">
      <CardHeader className="pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Indian Market Indices
          </CardTitle>
          <div className={`flex items-center space-x-1 text-xs ${isMarketOpen ? 'text-green-400' : 'text-red-400'}`}>
            <div className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span>{isMarketOpen ? 'LIVE' : 'CLOSED'}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {indices.map((index, idx) => (
            <div 
              key={index.name}
              className="space-y-2 animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Main Index Display */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-foreground">{index.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span 
                      className={`text-lg font-mono font-bold transition-all duration-500 ${
                        index.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {formatValue(animatedValues[idx] || index.value).toLocaleString('en-IN')}
                    </span>
                    {index.change !== 0 && (
                      <div className={`flex items-center space-x-1 text-xs transition-colors duration-500 ${
                        index.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        {index.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 animate-bounce" />
                        ) : (
                          <TrendingDown className="w-3 h-3 animate-bounce" />
                        )}
                        <span>{formatChange(index.change)} {formatPercent(index.changePercent)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* High/Low Display */}
              <div className="flex justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <span className="text-green-400 font-medium">H:</span>
                  <span className="font-mono">{formatValue(index.high).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-red-400 font-medium">L:</span>
                  <span className="font-mono">{formatValue(index.low).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Separator line */}
              {idx < indices.length - 1 && (
                <hr className="border-border/30 md:hidden" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}