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
          title: "Federal Reserve Announces Interest Rate Decision",
          source: "channel1", // Bloomberg
          category: "economy",
          timestamp: "10 minutes ago",
          summary: "The Federal Reserve has decided to maintain current interest rates, citing stable inflation data and continued economic growth.",
        },
        {
          id: "2",
          title: "Apple Reports Record Quarterly Revenue",
          source: "channel1", // Bloomberg
          category: "stocks",
          company: "Apple",
          timestamp: "1 hour ago",
          summary: "Apple Inc. announced record-breaking quarterly revenue of $89.6 billion, exceeding analyst expectations by 3.2%.",
        },
        {
          id: "3",
          title: "Bitcoin Surges Past $70,000 for First Time",
          source: "channel2", // CNBC
          category: "crypto",
          timestamp: "2 hours ago",
          summary: "Bitcoin has reached a new all-time high, crossing $70,000 amid increasing institutional adoption and market optimism.",
        },
        {
          id: "4",
          title: "S&P 500 Closes at Record High",
          source: "channel2", // CNBC
          category: "markets",
          timestamp: "3 hours ago",
          summary: "The S&P 500 index closed at a record high today, buoyed by strong performance in technology and healthcare sectors.",
        },
        {
          id: "5",
          title: "Tesla Announces New Factory in Asia",
          source: "channel1", // Bloomberg
          category: "stocks",
          company: "Tesla",
          timestamp: "5 hours ago",
          summary: "Tesla has revealed plans to build a new gigafactory in Asia, expanding its manufacturing capabilities to meet growing regional demand.",
        },
        {
          id: "6",
          title: "U.S. Unemployment Rate Falls to 3.8%",
          source: "channel2", // CNBC
          category: "economy",
          timestamp: "1 day ago",
          summary: "The latest jobs report shows U.S. unemployment has decreased to 3.8%, with the economy adding 280,000 jobs in the past month.",
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