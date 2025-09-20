export const maxDuration = 30

// Mock financial data fetcher
const getStockData = (symbol: string) => {
  const mockData = {
    AAPL: { price: 175.43, change: 2.15, changePercent: 1.24, volume: 45678900, marketCap: "2.8T" },
    TSLA: { price: 248.42, change: -8.15, changePercent: -3.18, volume: 67890123, marketCap: "789B" },
    GOOGL: { price: 2847.52, change: -15.23, changePercent: -0.53, volume: 1234567, marketCap: "1.8T" },
    MSFT: { price: 378.85, change: 4.67, changePercent: 1.25, volume: 23456789, marketCap: "2.9T" },
    NVDA: { price: 875.28, change: 23.67, changePercent: 2.78, volume: 34567890, marketCap: "2.1T" },
    SPY: { price: 485.23, change: 1.87, changePercent: 0.39, volume: 78901234, marketCap: "ETF" },
    QQQ: { price: 398.76, change: 3.45, changePercent: 0.87, volume: 45678901, marketCap: "ETF" },
  }

  const data = mockData[symbol.toUpperCase() as keyof typeof mockData]
  if (!data) {
    return null
  }

  return {
    symbol: symbol.toUpperCase(),
    ...data,
    timestamp: new Date().toISOString(),
  }
}

const getMarketNews = () => {
  const mockNews = [
    {
      title: "Tech Stocks Rally on AI Optimism",
      summary: "Major technology companies surge as artificial intelligence adoption accelerates across industries",
      impact: "Bullish for tech sector",
      timestamp: "2 hours ago",
    },
    {
      title: "Federal Reserve Signals Rate Cuts",
      summary: "Central bank minutes suggest potential monetary policy easing in upcoming quarters",
      impact: "Generally positive for equities",
      timestamp: "4 hours ago",
    },
    {
      title: "Earnings Season Beats Expectations",
      summary: "Q4 earnings reports show stronger than expected results across multiple sectors",
      impact: "Bullish market sentiment",
      timestamp: "6 hours ago",
    },
  ]

  return {
    news: mockNews,
    timestamp: new Date().toISOString(),
  }
}

const getMarketSentiment = () => {
  return {
    overall: "Bullish",
    confidence: 78,
    sectors: {
      technology: "Very Bullish",
      healthcare: "Neutral",
      energy: "Bearish",
      finance: "Bullish",
    },
    keyFactors: ["Strong earnings reports", "AI sector momentum", "Fed policy expectations", "Economic data trends"],
    timestamp: new Date().toISOString(),
  }
}

// Mock AI response generator
const generateMarketResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase()

  // Stock-specific queries
  if (lowerQuery.includes("aapl") || lowerQuery.includes("apple")) {
    const data = getStockData("AAPL")
    return `Apple (AAPL) is currently trading at $${data?.price} with a ${data?.changePercent}% change today. The stock has shown strong performance driven by iPhone sales and services growth. Key factors to watch include upcoming earnings, product launches, and market sentiment around consumer spending.`
  }

  if (lowerQuery.includes("tsla") || lowerQuery.includes("tesla")) {
    const data = getStockData("TSLA")
    return `Tesla (TSLA) is trading at $${data?.price}, down ${Math.abs(data?.changePercent || 0)}% today. The stock remains volatile but has strong long-term prospects in the EV market. Watch for delivery numbers, autonomous driving updates, and energy business developments.`
  }

  if (lowerQuery.includes("nvda") || lowerQuery.includes("nvidia")) {
    const data = getStockData("NVDA")
    return `NVIDIA (NVDA) is at $${data?.price}, up ${data?.changePercent}% today. The company continues to benefit from AI demand for its GPUs. Key catalysts include data center growth, gaming market recovery, and AI chip developments.`
  }

  // Market sentiment queries
  if (lowerQuery.includes("sentiment") || lowerQuery.includes("market mood")) {
    const sentiment = getMarketSentiment()
    return `Current market sentiment is ${sentiment.overall} with ${sentiment.confidence}% confidence. Technology sector is ${sentiment.sectors.technology}, while energy remains ${sentiment.sectors.energy}. Key drivers include ${sentiment.keyFactors.join(", ")}.`
  }

  // News and trends
  if (lowerQuery.includes("news") || lowerQuery.includes("latest")) {
    const news = getMarketNews()
    return `Latest market news: ${news.news[0].title} - ${news.news[0].summary}. This is ${news.news[0].impact}. Other key stories include Fed policy signals and strong earnings reports across sectors.`
  }

  // Trading strategies
  if (lowerQuery.includes("strategy") || lowerQuery.includes("trade") || lowerQuery.includes("invest")) {
    return `Based on current market conditions, consider a diversified approach focusing on quality growth stocks in technology and healthcare sectors. The bullish sentiment suggests opportunities in AI-related companies, but maintain risk management with proper position sizing and stop-losses.`
  }

  // Economic indicators
  if (lowerQuery.includes("economy") || lowerQuery.includes("inflation") || lowerQuery.includes("fed")) {
    return `The Federal Reserve's recent signals suggest potential rate cuts ahead, which is generally positive for equities. Inflation trends are moderating, and economic data shows resilience. This environment typically favors growth stocks over value, but monitor employment data and consumer spending closely.`
  }

  // Sector analysis
  if (lowerQuery.includes("sector") || lowerQuery.includes("industry")) {
    return `Sector analysis shows technology leading with AI momentum, healthcare remaining defensive, and energy facing headwinds. Financial sector benefits from potential rate changes. Consider sector rotation strategies based on economic cycles and Fed policy shifts.`
  }

  // Default comprehensive response
  return `Based on current market analysis, we're seeing a generally bullish environment with 78% confidence. Key highlights include strong tech sector performance driven by AI adoption, potential Fed rate cuts supporting equity valuations, and better-than-expected earnings across multiple sectors. 

For investment considerations: Focus on quality growth stocks, maintain diversification across sectors, and watch for key economic indicators like employment data and consumer spending. The current environment favors technology and healthcare sectors while energy faces challenges.

Risk factors to monitor include geopolitical tensions, inflation trends, and any shifts in Federal Reserve policy. Always maintain proper risk management with position sizing and stop-losses appropriate for your risk tolerance.`
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== "string") {
      return Response.json({ error: "Query is required" }, { status: 400 })
    }

    const response = generateMarketResponse(query)

    return Response.json({
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI Search Error:", error)
    return Response.json({ error: "Failed to process search query" }, { status: 500 })
  }
}
