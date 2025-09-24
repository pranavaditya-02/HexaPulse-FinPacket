"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Newspaper, Clock } from "lucide-react"

type NewsItem = {
  id: string
  title: string
  source: string
  category: "general" | "markets" | "stocks" | "crypto" | "economy"
  company?: string
  timestamp: string
  summary: string
}

export function FilteredNewsFeed() {
  const [activeTab, setActiveTab] = useState("all");
  const [news, setNews] = useState<NewsItem[]>([]);
  
  // Mock news data - in a real app, you would fetch this from an API
  useEffect(() => {
    const mockNews: NewsItem[] = [
      {
        id: "1",
        title: "Federal Reserve Announces Interest Rate Decision",
        source: "Financial Times",
        category: "economy",
        timestamp: "10 minutes ago",
        summary: "The Federal Reserve has decided to maintain current interest rates, citing stable inflation data and continued economic growth.",
      },
      {
        id: "2",
        title: "Apple Reports Record Quarterly Revenue",
        source: "CNBC",
        category: "stocks",
        company: "Apple",
        timestamp: "1 hour ago",
        summary: "Apple Inc. announced record-breaking quarterly revenue of $89.6 billion, exceeding analyst expectations by 3.2%.",
      },
      {
        id: "3",
        title: "Bitcoin Surges Past $70,000 for First Time",
        source: "Bloomberg",
        category: "crypto",
        timestamp: "2 hours ago",
        summary: "Bitcoin has reached a new all-time high, crossing $70,000 amid increasing institutional adoption and market optimism.",
      },
      {
        id: "4",
        title: "S&P 500 Closes at Record High",
        source: "Reuters",
        category: "markets",
        timestamp: "3 hours ago",
        summary: "The S&P 500 index closed at a record high today, buoyed by strong performance in technology and healthcare sectors.",
      },
      {
        id: "5",
        title: "Tesla Announces New Factory in Asia",
        source: "Wall Street Journal",
        category: "stocks",
        company: "Tesla",
        timestamp: "5 hours ago",
        summary: "Tesla has revealed plans to build a new gigafactory in Asia, expanding its manufacturing capabilities to meet growing regional demand.",
      },
      {
        id: "6",
        title: "U.S. Unemployment Rate Falls to 3.8%",
        source: "The Economist",
        category: "economy",
        timestamp: "1 day ago",
        summary: "The latest jobs report shows U.S. unemployment has decreased to 3.8%, with the economy adding 280,000 jobs in the past month.",
      },
    ];
    
    setNews(mockNews);
  }, []);
  
  // Filter news based on the active tab
  const filteredNews = news.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "markets") return item.category === "markets";
    if (activeTab === "stocks") return item.category === "stocks";
    if (activeTab === "economy") return item.category === "economy";
    if (activeTab === "crypto") return item.category === "crypto";
    return false;
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
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Breaking News</CardTitle>
        <CardDescription>Latest financial updates</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="economy">Economy</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {filteredNews.map((item) => (
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
                    {item.source}
                  </span>
                  {item.company && (
                    <Badge variant="secondary" className="text-xs">
                      {item.company}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            
            {filteredNews.length === 0 && (
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