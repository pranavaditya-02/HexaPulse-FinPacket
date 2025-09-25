"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Pause, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// News types
type NewsSnippet = {
  id: string;
  text: string;
  timestamp: Date;
  category: "general" | "markets" | "stocks" | "crypto" | "economy";
  source: "channel1" | "channel2" | "both";
  processed: boolean;
}

// YouTube channel configurations
const CHANNELS = {
  channel1: {
    name: "Bloomberg Markets and Finance",
    videoId: "dp8PhLsUcFE", // Example: Bloomberg live
    color: "blue"
  },
  channel2: {
    name: "CNBC",
    videoId: "9NyxcX3rhQs", // Example: CNBC live
    color: "red"
  }
};

export function LiveNewsStream() {
  const [activeChannel, setActiveChannel] = useState<"channel1" | "channel2" | "both">("channel1");
  const [transcription, setTranscription] = useState<string>("");
  const [newsSnippets, setNewsSnippets] = useState<NewsSnippet[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  // Keywords for automatic categorization
  const categoryKeywords = {
    markets: ["index", "market", "dow jones", "nasdaq", "s&p", "trading", "rally", "sell-off", "correction", "bull", "bear"],
    stocks: ["stock", "share", "company", "earnings", "dividend", "CEO", "board", "investor", "shareholders"],
    economy: ["fed", "interest rate", "inflation", "gdp", "unemployment", "economic", "recession", "growth", "treasury", "federal reserve"],
    crypto: ["bitcoin", "ethereum", "crypto", "blockchain", "token", "coin", "defi", "wallet", "mining", "nft"]
  };
  
  // Auto-categorize text based on keywords
  const categorizeText = (text: string): "general" | "markets" | "stocks" | "crypto" | "economy" => {
    text = text.toLowerCase();
    
    if (categoryKeywords.markets.some(keyword => text.includes(keyword))) return "markets";
    if (categoryKeywords.stocks.some(keyword => text.includes(keyword))) return "stocks";
    if (categoryKeywords.economy.some(keyword => text.includes(keyword))) return "economy";
    if (categoryKeywords.crypto.some(keyword => text.includes(keyword))) return "crypto";
    
    return "general";
  };
  
  // Check if the text is unique enough to be added
  const isUniqueSnippet = (text: string, existingSnippets: NewsSnippet[]): boolean => {
    // Very similar texts should be considered duplicates
    return !existingSnippets.some(snippet => {
      // Calculate similarity (very basic implementation)
      const words1 = text.toLowerCase().split(' ');
      const words2 = snippet.text.toLowerCase().split(' ');
      const commonWords = words1.filter(word => words2.includes(word));
      
      // If more than 70% of words are common, consider it a duplicate
      return commonWords.length > Math.min(words1.length, words2.length) * 0.7;
    });
  };
  
  // Get video source based on active channel
  const getVideoSrc = () => {
    if (activeChannel === "channel1") {
      return `https://www.youtube.com/embed/${CHANNELS.channel1.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}`;
    }
    return `https://www.youtube.com/embed/${CHANNELS.channel2.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}`;
  };
  
  // Simulate transcription based on active channel
  useEffect(() => {
    // Simulate different news items for each channel
    const channel1News = [
      "Markets open higher following Federal Reserve announcement on interest rates",
      "Tech stocks rally as inflation data comes in lower than expected",
      "Oil prices stabilize after OPEC meeting concludes with production cuts",
      "S&P 500 futures point to positive open amid strong earnings reports",
      "Treasury yields edge higher as investors assess economic data",
    ];
    
    const channel2News = [
      "Healthcare sector showing strong growth amid earnings season",
      "Retail sales data suggests consumer spending remains resilient",
      "Major merger announced in the telecommunications industry",
      "Bitcoin drops 5% as regulatory concerns mount in key markets",
      "Manufacturing PMI exceeds expectations, indicating economic expansion",
    ];
    
    let index1 = 0;
    let index2 = 0;
    
    // Define which news sources to use based on active channel
    const useChannel1 = activeChannel === "channel1" || activeChannel === "both";
    const useChannel2 = activeChannel === "channel2" || activeChannel === "both";
    
    const interval = setInterval(() => {
      if (!isPlaying) return;
      
      // Process news from appropriate channels
      if (useChannel1 && index1 < channel1News.length) {
        const text = channel1News[index1];
        index1++;
        
        // Add to transcription
        setTranscription(prev => `${text}\n\n${prev}`.substring(0, 1000));
        
        // Create news snippet and add it if unique
        const newSnippet = {
          id: `channel1-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          text,
          timestamp: new Date(),
          category: categorizeText(text),
          source: "channel1" as const,
          processed: false
        };
        
        setNewsSnippets(prev => {
          if (isUniqueSnippet(text, prev)) {
            // Send new snippet to backend
            sendNewsSnippetToBackend(newSnippet);
            return [...prev, newSnippet].slice(-50); // Keep only the most recent 50
          }
          return prev;
        });
      }
      
      // Add a small delay between channels to make it look more natural
      if (useChannel2 && index2 < channel2News.length) {
        setTimeout(() => {
          if (!isPlaying) return;
          
          const text = channel2News[index2];
          index2++;
          
          // Add to transcription
          setTranscription(prev => `${text}\n\n${prev}`.substring(0, 1000));
          
          // Create news snippet and add it if unique
          const newSnippet = {
            id: `channel2-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            text,
            timestamp: new Date(),
            category: categorizeText(text),
            source: "channel2" as const,
            processed: false
          };
          
          setNewsSnippets(prev => {
            if (isUniqueSnippet(text, prev)) {
              // Send new snippet to backend
              sendNewsSnippetToBackend(newSnippet);
              return [...prev, newSnippet].slice(-50); // Keep only the most recent 50
            }
            return prev;
          });
        }, 2500); // 2.5 second delay between channel 1 and channel 2 news
      }
    }, 7000);
    
    return () => clearInterval(interval);
  }, [activeChannel, isPlaying]);
  
  // Mock function to send news to backend
  const sendNewsSnippetToBackend = async (snippet: NewsSnippet) => {
    try {
      // In a real implementation, you would send this to your backend API
      console.log("Sending to backend:", snippet);
      
      // Mock API call
      /*
      await fetch('/api/news-snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snippet),
      });
      */
    } catch (error) {
      console.error("Failed to send news snippet to backend:", error);
    }
  };
  
  // Check if it's a weekend to show different content
  const isWeekend = () => {
    const day = new Date().getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, you would control the video playback
  };
  
  const handleMuteUnmute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, you would control the video audio
    
    if (videoRef.current) {
      // Reload iframe with new mute parameter
      videoRef.current.src = getVideoSrc();
    }
  };
  
  // Handle channel change
  const handleChannelChange = (channel: "channel1" | "channel2" | "both") => {
    setActiveChannel(channel);
    setTranscription(""); // Clear transcription when changing channels
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <span className="flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Live Financial News
            </CardTitle>
            <CardDescription>
              {isWeekend() ? 'Weekend recap' : 'Real-time market updates'}
            </CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button size="icon" variant="ghost" onClick={handleMuteUnmute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={handlePlayPause}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Channel selector */}
        <div className="px-4 py-2 border-y">
          <Tabs value={activeChannel} onValueChange={(v) => handleChannelChange(v as any)}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="channel1" className="text-xs sm:text-sm">
                <span className={`h-2 w-2 rounded-full bg-${CHANNELS.channel1.color}-500 mr-2 hidden sm:inline-block`}></span>
                {CHANNELS.channel1.name}
              </TabsTrigger>
              <TabsTrigger value="channel2" className="text-xs sm:text-sm">
                <span className={`h-2 w-2 rounded-full bg-${CHANNELS.channel2.color}-500 mr-2 hidden sm:inline-block`}></span>
                {CHANNELS.channel2.name}
              </TabsTrigger>
              <TabsTrigger value="both" className="text-xs sm:text-sm">Both Channels</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Video embed */}
        <div className="aspect-video bg-black">
          {activeChannel !== "both" ? (
            <iframe 
              ref={videoRef}
              width="100%" 
              height="100%" 
              src={getVideoSrc()}
              title={`${activeChannel === "channel1" ? CHANNELS.channel1.name : CHANNELS.channel2.name} Live Stream`} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className={isMuted ? "opacity-70" : "opacity-100"}
            ></iframe>
          ) : (
            <div className="grid grid-cols-2 h-full">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${CHANNELS.channel1.videoId}?autoplay=1&mute=1`}
                title={`${CHANNELS.channel1.name} Live Stream`} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="opacity-70"
              ></iframe>
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${CHANNELS.channel2.videoId}?autoplay=1&mute=1`}
                title={`${CHANNELS.channel2.name} Live Stream`} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="opacity-70"
              ></iframe>
            </div>
          )}
        </div>
        
        {/* Live transcription */}
        <div className="h-40 overflow-y-auto p-4 bg-muted/30">
          {isWeekend() ? (
            <div className="flex flex-col h-full justify-center items-center">
              <p className="text-muted-foreground">Markets are closed for the weekend.</p>
              <p className="text-sm text-muted-foreground mt-1">Showing last week's highlights.</p>
            </div>
          ) : transcription ? (
            <p className="whitespace-pre-line text-sm">{transcription}</p>
          ) : (
            <p className="text-center text-muted-foreground">Waiting for news transcription...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}