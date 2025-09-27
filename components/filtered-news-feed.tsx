"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Newspaper, Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

type NewsItem = {
  id: string
  title: string
  source: string
  category: "general" | "markets" | "stocks" | "crypto" | "economy"
  company?: string
  timestamp: string
  summary: string
}

// For backend integration
type BackendNewsItem = {
  id: string
  text: string
  timestamp: string
  category: "general" | "markets" | "stocks" | "crypto" | "economy"
  source: "channel1" | "channel2" | "both"
  processed: boolean
}

export function FilteredNewsFeed() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeSource, setActiveSource] = useState("all");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWeekend, setIsWeekend] = useState(false);
  
  // Check if it's a weekend
  useEffect(() => {
    const day = new Date().getDay();
    setIsWeekend(day === 0 || day === 6); // 0 is Sunday, 6 is Saturday
  }, []);
  
  // Function to fetch news from backend
  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In production, use actual API endpoint
      // const response = await fetch(`/api/news-snippets?category=${activeTab !== 'all' ? activeTab : ''}&source=${activeSource !== 'all' ? activeSource : ''}&limit=50`);
      
      // Since we're not connecting to the real backend yet, simulate with mock data
      // const data: BackendNewsItem[] = await response.json();
      
      // Mock the backend response
      const mockNews: NewsItem[] = [
        {
          id: "1",
          title: "Indian Markets End Volatile Week on Positive Note",
          source: "channel1",
          category: "markets",
          timestamp: "30 minutes ago",
          summary: "Sensex closed above 83,000 for the first time, with Nifty crossing 25,400, as investors reacted positively to RBI's dovish stance and global cues.",
        },
        {
          id: "2",
          title: "RBI Keeps Repo Rate Unchanged at 6.5%, Signals Dovish Stance",
          source: "channel1",
          category: "economy",
          timestamp: "2 days ago",
          summary: "The Reserve Bank of India maintained the repo rate at 6.5% but hinted at a more accommodative monetary policy stance for future meetings.",
        },
        {
          id: "3",
          title: "Reliance Industries Gains on Renewable Energy Partnership",
          source: "channel1",
          category: "stocks",
          company: "Reliance",
          timestamp: "3 days ago",
          summary: "Reliance Industries shares rose 2.3% after announcing a strategic partnership with Adani Green for large-scale renewable energy projects.",
        },
        {
          id: "4",
          title: "IT Stocks Under Pressure as Infosys Cuts FY26 Guidance",
          source: "channel2",
          category: "stocks",
          company: "Infosys",
          timestamp: "3 days ago",
          summary: "Infosys revised its FY26 revenue guidance downward citing client budget constraints, leading to a broad-based decline in IT sector stocks.",
        },
        {
          id: "5",
          title: "Gold Prices Surge to ₹73,500 Amid Global Uncertainty",
          source: "channel2",
          category: "markets",
          timestamp: "4 days ago",
          summary: "Gold prices reached ₹73,500 per 10 grams as investors sought safe haven assets due to escalating geopolitical tensions in the Middle East.",
        },
        {
          id: "6",
          title: "Auto Sector Shows Resilience with Strong Festive Bookings",
          source: "channel1",
          category: "stocks",
          company: "Maruti Suzuki",
          timestamp: "4 days ago",
          summary: "Maruti Suzuki shares gained 1.8% on robust festive season bookings, with the company reporting 15% higher advance orders compared to last year.",
        },
        {
          id: "7",
          title: "Cryptocurrency Regulations Framework Expected Next Month",
          source: "channel2",
          category: "crypto",
          timestamp: "2 days ago",
          summary: "The government is finalizing a comprehensive framework for digital assets, with new cryptocurrency regulations expected to be announced in October.",
        },
        {
          id: "8",
          title: "Tata Group Announces ₹50,000 Crore Semiconductor Investment",
          source: "channel1",
          category: "stocks",
          company: "Tata",
          timestamp: "1 day ago",
          summary: "Tata Sons revealed a massive ₹50,000 crore investment plan for semiconductor manufacturing, boosting India's chip manufacturing ambitions.",
        },
        {
          id: "9",
          title: "PSU Banks Rally After Government Credit Guarantee Scheme",
          source: "channel2",
          category: "economy",
          timestamp: "1 day ago",
          summary: "Public sector banks outperformed private banks as the government announced a new ₹2 lakh crore credit guarantee scheme to support MSME lending.",
        },
        {
          id: "10",
          title: "FIIs Continue Selling Spree, Offload ₹2,847 Crores",
          source: "channel1",
          category: "markets",
          timestamp: "4 days ago",
          summary: "Foreign institutional investors continued their selling pressure, offloading ₹2,847 crores worth of Indian equities amid global risk-off sentiment.",
        },
        {
          id: "11",
          title: "Bharti Airtel Surges on 5G Expansion Announcements",
          source: "channel2",
          category: "stocks",
          company: "Bharti Airtel",
          timestamp: "1 day ago",
          summary: "Bharti Airtel shares jumped 3.2% after the company announced aggressive 5G expansion plans and spectrum auction participation strategies.",
        },
        {
          id: "12",
          title: "Real Estate Stocks Jump 4-6% on Rate Cut Expectations",
          source: "channel1",
          category: "stocks",
          timestamp: "2 days ago",
          summary: "Real estate sector witnessed broad-based gains as RBI's dovish stance raised expectations of future interest rate cuts benefiting the sector.",
        },
        {
          id: "13",
          title: "Adani Ports Wins ₹8,500 Crore Mumbai Container Terminal Contract",
          source: "channel2",
          category: "stocks",
          company: "Adani Ports",
          timestamp: "1 day ago",
          summary: "Adani Ports shares rallied 5% after the company secured a major ₹8,500 crore contract for developing a new container terminal in Mumbai.",
        },
        {
          id: "14",
          title: "Indian Rupee Weakens to 83.25 Against Dollar",
          source: "channel1",
          category: "economy",
          timestamp: "3 days ago",
          summary: "The Indian rupee depreciated to 83.25 against the US dollar as crude oil prices rose above $95 per barrel amid Middle East tensions.",
        },
        {
          id: "15",
          title: "Metal Stocks Decline on China Property Sector Concerns",
          source: "channel2",
          category: "stocks",
          timestamp: "1 day ago",
          summary: "Metal stocks faced selling pressure as concerns over China's property sector weighed on commodity demand outlook and pricing expectations.",
        },
        {
          id: "16",
          title: "GST Collections Touch ₹1.95 Lakh Crore in September",
          source: "channel1",
          category: "economy",
          timestamp: "5 days ago",
          summary: "September GST collections reached ₹1.95 lakh crore, indicating robust economic activity and improved tax compliance across the country.",
        },
        {
          id: "17",
          title: "Pharmaceutical Stocks Mixed on US FDA Concerns",
          source: "channel2",
          category: "stocks",
          timestamp: "2 days ago",
          summary: "Pharma sector showed mixed performance as the US FDA raised concerns over manufacturing practices at some Indian pharmaceutical facilities.",
        },
        {
          id: "18",
          title: "Weekly F&O Expiry Sees High Volatility at 25,500 Strike",
          source: "channel1",
          category: "markets",
          timestamp: "1 day ago",
          summary: "Friday's F&O expiry witnessed high volatility with maximum open interest concentrated at 25,500 Call options, indicating key resistance levels.",
        },
        {
          id: "19",
          title: "India's Manufacturing PMI Rises to 58.3, Highest in 14 Months",
          source: "channel2",
          category: "economy",
          timestamp: "5 days ago",
          summary: "India's manufacturing PMI surged to 58.3 in September, marking the highest reading in 14 months and indicating strong economic resilience.",
        },
        {
          id: "20",
          title: "Markets Closed for Weekend - Investors Await Global Cues",
          source: "both",
          category: "general",
          timestamp: "Just now",
          summary: "Indian stock markets are closed for the weekend. Investors are closely watching global developments and upcoming economic data releases for next week's direction.",
        },
      ];
      
      // If we were using the real backend, we would transform the data
      /* 
      const transformedNews: NewsItem[] = data.map(item => ({
        id: item.id,
        title: item.text,
        source: item.source === 'channel1' ? 'Bloomberg' : item.source === 'channel2' ? 'CNBC' : 'Multiple Sources',
        category: item.category,
        timestamp: formatTimestamp(item.timestamp),
        summary: item.text,
      }));
      
      setNews(transformedNews);
      */
      
      // For now, just use the mock data
      setNews(mockNews);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to fetch news. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format timestamp into "X minutes/hours/days ago" format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };
  
  // Initial fetch on component mount
  useEffect(() => {
    fetchNews();
    
    // Set up periodic refresh every 30 seconds if it's not weekend
    if (!isWeekend) {
      const interval = setInterval(fetchNews, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab, activeSource, isWeekend]);
  
  // Filter news based on the active tab
  const filteredNews = news.filter(item => {
    // Filter by category
    if (activeTab !== "all" && item.category !== activeTab) {
      return false;
    }
    
    // Filter by source
    if (activeSource !== "all") {
      if (activeSource === "channel1" && item.source !== "channel1") return false;
      if (activeSource === "channel2" && item.source !== "channel2") return false;
    }
    
    return true;
  });

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "markets": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "stocks": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "crypto": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "economy": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  // Format source display name
  const getSourceDisplayName = (source: string) => {
    switch (source) {
      case "channel1": return "Bloomberg";
      case "channel2": return "CNBC";
      case "both": return "Multiple Sources";
      default: return source;
    }
  };
  
  // Get source color
  const getSourceColor = (source: string) => {
    switch (source) {
      case "channel1": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "channel2": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "both": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Breaking News</CardTitle>
            <CardDescription>
              {isWeekend ? 'Weekend recap' : 'Latest financial updates'}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={fetchNews}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Category tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="text-xs sm:text-sm">All News</TabsTrigger>
            <TabsTrigger value="markets" className="text-xs sm:text-sm">Markets</TabsTrigger>
            <TabsTrigger value="stocks" className="text-xs sm:text-sm">Stocks</TabsTrigger>
            <TabsTrigger value="economy" className="text-xs sm:text-sm">Economy</TabsTrigger>
            <TabsTrigger value="crypto" className="text-xs sm:text-sm">Crypto</TabsTrigger>
          </TabsList>
          
          {/* Source filter */}
          <div className="flex mb-4 gap-2">
            <Button 
              variant={activeSource === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveSource("all")}
              className="text-xs sm:text-sm h-8"
            >
              All Sources
            </Button>
            <Button 
              variant={activeSource === "channel1" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveSource("channel1")}
              className="text-xs sm:text-sm h-8"
            >
              Bloomberg
            </Button>
            <Button 
              variant={activeSource === "channel2" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveSource("channel2")}
              className="text-xs sm:text-sm h-8"
            >
              CNBC
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {isLoading && filteredNews.length === 0 ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredNews.length > 0 ? (
              filteredNews.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <Badge variant="outline" className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {item.timestamp}
                    </div>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.summary}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs flex items-center">
                      <Newspaper className="mr-1 h-3 w-3" />
                      {getSourceDisplayName(item.source)}
                    </span>
                    {item.company && (
                      <Badge variant="secondary" className="text-xs">
                        {item.company}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No news found in this category
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}