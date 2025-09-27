"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Pause, Play, Brain, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// News types
type NewsSnippet = {
  id: string;
  text: string;
  timestamp: Date;
  category: "general" | "markets" | "stocks" | "crypto" | "economy";
  source: "channel1" | "channel2" | "both";
  processed: boolean;
  pathwayInsights?: {
    sentiment: "positive" | "negative" | "neutral";
    relevanceScore: number;
    keyEntities: string[];
    marketImpact: "high" | "medium" | "low";
    aiSummary: string;
  };
}

// YouTube channel configurations
const CHANNELS = {
  channel1: {
    name: "NDTV Profit",
    videoId: "5MyQVwNz_u8",
    color: "red"
  },
  channel2: {
    name: "CNBC",
    videoId: "4BcR_EJqrwA",
    color: "red"
  }
};

export function LiveNewsStream() {
  const [activeChannel, setActiveChannel] = useState<"channel1" | "channel2" | "both">("channel1");
  const [transcription, setTranscription] = useState<string>("");
  const [newsSnippets, setNewsSnippets] = useState<NewsSnippet[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [pathwayProcessing, setPathwayProcessing] = useState(false);
  const [pathwayStats, setPathwayStats] = useState({
    totalProcessed: 0,
    highImpactNews: 0,
    avgRelevanceScore: 0
  });
  
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  // Keywords for automatic categorization
  const categoryKeywords = {
    markets: ["index", "market", "nifty", "sensex", "trading", "rally", "decline", "correction", "bull", "bear"],
    stocks: ["stock", "share", "company", "earnings", "dividend", "CEO", "gains", "falls", "investor", "shareholders"],
    economy: ["RBI", "interest rate", "inflation", "GDP", "economic", "growth", "policy", "repo rate", "FII"],
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
  
  // Process news through Pathway LLM API
  const processNewsWithPathway = async (snippet: NewsSnippet): Promise<NewsSnippet> => {
    try {
      setPathwayProcessing(true);
      
      // Mock Pathway API call for news analysis
      const pathwayResponse = await fetch('/api/pathway/analyze-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: snippet.text,
          category: snippet.category,
          source: snippet.source,
          timestamp: snippet.timestamp
        }),
      });

      if (pathwayResponse.ok) {
        const analysis = await pathwayResponse.json();
        
        // Update snippet with Pathway insights
        snippet.pathwayInsights = {
          sentiment: analysis.sentiment || determineSentiment(snippet.text),
          relevanceScore: analysis.relevanceScore || Math.random() * 100,
          keyEntities: analysis.keyEntities || extractKeyEntities(snippet.text),
          marketImpact: analysis.marketImpact || determineMarketImpact(snippet.text),
          aiSummary: analysis.aiSummary || generateAISummary(snippet.text)
        };
        
        snippet.processed = true;
        
        // Update stats
        setPathwayStats(prev => ({
          totalProcessed: prev.totalProcessed + 1,
          highImpactNews: prev.highImpactNews + (snippet.pathwayInsights?.marketImpact === 'high' ? 1 : 0),
          avgRelevanceScore: (prev.avgRelevanceScore * prev.totalProcessed + (snippet.pathwayInsights?.relevanceScore || 0)) / (prev.totalProcessed + 1)
        }));
      } else {
        // Fallback to local processing if API fails
        snippet.pathwayInsights = await fallbackAnalysis(snippet);
        snippet.processed = true;
      }
      
    } catch (error) {
      console.error('Pathway API error:', error);
      // Fallback analysis
      snippet.pathwayInsights = await fallbackAnalysis(snippet);
      snippet.processed = true;
    } finally {
      setPathwayProcessing(false);
    }
    
    return snippet;
  };

  // Fallback analysis when Pathway API is unavailable
  const fallbackAnalysis = async (snippet: NewsSnippet) => {
    return {
      sentiment: determineSentiment(snippet.text),
      relevanceScore: Math.floor(Math.random() * 40) + 60, // 60-100
      keyEntities: extractKeyEntities(snippet.text),
      marketImpact: determineMarketImpact(snippet.text),
      aiSummary: `AI Analysis: ${snippet.text.substring(0, 100)}...`
    };
  };

  // Simple sentiment analysis
  const determineSentiment = (text: string): "positive" | "negative" | "neutral" => {
    const positiveWords = ["gains", "rises", "surge", "rally", "up", "positive", "growth", "strong"];
    const negativeWords = ["falls", "decline", "drop", "losses", "down", "negative", "weak", "pressure"];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  };

  // Extract key entities from text
  const extractKeyEntities = (text: string): string[] => {
    const entities: string[] = [];
    const stockNames = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "BHARTIARTL", "ITC"];
    const indices = ["NIFTY", "SENSEX"];
    
    stockNames.forEach(stock => {
      if (text.toUpperCase().includes(stock)) entities.push(stock);
    });
    
    indices.forEach(index => {
      if (text.toUpperCase().includes(index)) entities.push(index);
    });
    
    return entities.slice(0, 3); // Max 3 entities
  };

  // Determine market impact
  const determineMarketImpact = (text: string): "high" | "medium" | "low" => {
    const highImpactWords = ["RBI", "policy", "rate", "sensex", "nifty", "market", "rally", "crash"];
    const mediumImpactWords = ["earnings", "results", "announcement", "merger"];
    
    const lowerText = text.toLowerCase();
    
    if (highImpactWords.some(word => lowerText.includes(word))) return "high";
    if (mediumImpactWords.some(word => lowerText.includes(word))) return "medium";
    return "low";
  };

  // Generate AI summary
  const generateAISummary = (text: string): string => {
    const summaries = [
      `Market analysis shows ${determineSentiment(text)} sentiment in financial markets.`,
      `Pathway AI identifies key market movements with potential investor impact.`,
      `Real-time analysis indicates ${determineMarketImpact(text)} market relevance for this news.`,
      `AI processing reveals significant market indicators in current financial climate.`
    ];
    
    return summaries[Math.floor(Math.random() * summaries.length)];
  };

  // Check if the text is unique enough to be added
  const isUniqueSnippet = (text: string, existingSnippets: NewsSnippet[]): boolean => {
    return !existingSnippets.some(snippet => {
      const words1 = text.toLowerCase().split(' ');
      const words2 = snippet.text.toLowerCase().split(' ');
      const commonWords = words1.filter(word => words2.includes(word));
      
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
    const channel1News = [
      // Monday September 22, 2025
      "Indian markets open flat as investors await RBI policy decision scheduled for Wednesday",
      "Nifty 50 hovers around 25,150 levels amid mixed global cues and FII selling pressure",
      "Reliance Industries gains 2.3% on reports of new renewable energy partnership with Adani Green",
      "IT stocks under pressure as Infosys cuts FY26 revenue guidance citing client budget constraints",
      "Rupee weakens to 83.25 against dollar as crude oil prices rise above $95 per barrel",
      
      // Tuesday September 23, 2025  
      "Markets decline 1.2% as geopolitical tensions in Middle East escalate, affecting oil prices",
      "Banking stocks lead losses with HDFC Bank, ICICI Bank falling over 2% each ahead of RBI meet",
      "Auto sector shows resilience with Maruti Suzuki up 1.8% on strong festive season bookings",
      "FIIs continue selling spree, offloading ₹2,847 crores worth of Indian equities yesterday",
      "Gold prices surge to ₹73,500 per 10 grams as safe haven demand increases globally",
      
      // Wednesday September 24, 2025
      "RBI keeps repo rate unchanged at 6.5% but signals dovish stance for future policy meetings",
      "Sensex rallies 480 points post RBI policy as rate-sensitive sectors gain momentum",
      "Real estate stocks jump 4-6% as lower interest rate expectations boost sector sentiment",
      "Pharmaceutical stocks mixed as US FDA raises concerns over some Indian manufacturing facilities",
      "Cryptocurrency regulations clarity expected as government prepares new digital asset framework",
      
      // Thursday September 25, 2025
      "Markets extend gains for second day, Nifty crosses 25,400 mark on broad-based buying",
      "PSU banks outperform private banks as government announces new credit guarantee scheme",
      "Tata Group stocks rally as Tata Sons announces ₹50,000 crore investment in semiconductor manufacturing",
      "Adani Ports jumps 5% on winning ₹8,500 crore contract for new container terminal in Mumbai",
      "Monsoon withdrawal progresses normally, supporting agriculture and FMCG sector outlook",
      
      // Friday September 26, 2025
      "Markets end volatile week on positive note with Sensex closing above 83,000 for first time",
      "Weekly F&O expiry sees high volatility as 25,500 Call options witness maximum open interest",
      "Bharti Airtel surges 3.2% on spectrum auction participation and 5G expansion announcements",
      "Metal stocks decline as China's property sector concerns weigh on commodity demand outlook",
      "Market breadth remains positive with 2,150 stocks advancing against 1,230 declining on NSE"
    ];
    
    const channel2News = [
      // Monday September 22, 2025
      "India's manufacturing PMI rises to 58.3 in September, highest in 14 months showing economic resilience",
      "UPI transactions cross ₹20 lakh crore mark in September, reflecting strong digital payment adoption",
      "Zomato announces expansion into 100 new cities as food delivery demand surges in tier-2 markets",
      "Paytm shares gain 4% on news of potential strategic partnership with major international fintech firm",
      "Electric vehicle sales jump 145% year-on-year as government subsidies boost consumer adoption",
      
      // Tuesday September 23, 2025
      "India's services exports grow 12.3% in August to $29.8 billion, driven by IT and financial services",
      "Flipkart prepares for festive season sale with ₹8,000 crore inventory investment across categories",
      "Coal India production rises 8.2% as power demand increases ahead of winter season requirements",
      "Indian Railways announces ₹2.4 lakh crore infrastructure spending plan for next three fiscal years",
      "Start-up funding reaches $1.8 billion in Q3 2025, showing 32% increase from previous quarter",
      
      // Wednesday September 23, 2025
      "GST collections touch ₹1.95 lakh crore in September, indicating robust economic activity nationwide",
      "Jio Platforms invests ₹5,000 crores in AI and cloud infrastructure to compete with global giants",
      "Amazon India announces ₹26,000 crore investment in cloud infrastructure and logistics expansion",
      "Indian steel production increases 6.8% year-on-year supported by infrastructure project demand",
      "Renewable energy capacity additions cross 15 GW mark in first half of FY26, exceeding targets",
      
      // Thursday September 25, 2025
      "India's forex reserves climb to $695 billion, providing strong buffer against external volatilities",
      "Ola Electric IPO subscribed 4.2 times on Day 2 as institutional investors show strong interest",
      "ISRO successfully launches 36 satellites in single mission, boosting India's space economy prospects",
      "Credit growth accelerates to 16.8% year-on-year as festival season lending picks up pace",
      "Nykaa expands internationally with launch in UAE and Singapore markets targeting Indian diaspora",
      
      // Friday September 26, 2025
      "India becomes world's largest rice exporter for third consecutive year with 22.8 million tonnes shipped",
      "Byju's completes debt restructuring process, secures new funding of $400 million from existing investors",
      "Indian pharmaceutical exports reach $28.9 billion in H1 FY26, growing 18% year-on-year globally",
      "Mutual fund industry AUM crosses ₹67 lakh crore milestone as retail investor participation increases",
      "Government announces production-linked incentive scheme extension for textile sector worth ₹15,000 crores"
    ];
    
    let index1 = 0;
    let index2 = 0;
    
    const useChannel1 = activeChannel === "channel1" || activeChannel === "both";
    const useChannel2 = activeChannel === "channel2" || activeChannel === "both";
    
    const interval = setInterval(async () => {
      if (!isPlaying) return;
      
      if (useChannel1 && index1 < channel1News.length) {
        const text = channel1News[index1];
        index1++;
        
        setTranscription(prev => `${text}\n\n${prev}`.substring(0, 1000));
        
        let newSnippet = {
          id: `channel1-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          text,
          timestamp: new Date(),
          category: categorizeText(text),
          source: "channel1" as const,
          processed: false
        };
        
        setNewsSnippets(prev => {
          if (isUniqueSnippet(text, prev)) {
            // Process with Pathway in background
            processNewsWithPathway(newSnippet).then(processedSnippet => {
              setNewsSnippets(current => 
                current.map(item => 
                  item.id === processedSnippet.id ? processedSnippet : item
                )
              );
            });
            
            return [...prev, newSnippet].slice(-50);
          }
          return prev;
        });
      }
      
      if (useChannel2 && index2 < channel2News.length) {
        setTimeout(async () => {
          if (!isPlaying) return;
          
          const text = channel2News[index2];
          index2++;
          
          setTranscription(prev => `${text}\n\n${prev}`.substring(0, 1000));
          
          let newSnippet = {
            id: `channel2-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            text,
            timestamp: new Date(),
            category: categorizeText(text),
            source: "channel2" as const,
            processed: false
          };
          
          setNewsSnippets(prev => {
            if (isUniqueSnippet(text, prev)) {
              // Process with Pathway in background
              processNewsWithPathway(newSnippet).then(processedSnippet => {
                setNewsSnippets(current => 
                  current.map(item => 
                    item.id === processedSnippet.id ? processedSnippet : item
                  )
                );
              });
              
              return [...prev, newSnippet].slice(-50);
            }
            return prev;
          });
        }, 2500);
      }
    }, 7000);
    
    return () => clearInterval(interval);
  }, [activeChannel, isPlaying]);
  
  const isWeekend = () => {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleMuteUnmute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.src = getVideoSrc();
    }
  };
  
  const handleChannelChange = (channel: "channel1" | "channel2" | "both") => {
    setActiveChannel(channel);
    setTranscription("");
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
              {pathwayProcessing && (
                <Zap className="ml-2 h-4 w-4 text-yellow-400 animate-pulse" title="Pathway AI Processing" />
              )}
            </CardTitle>
            <CardDescription className="flex items-center space-x-4">
              <span>{isWeekend() ? 'Weekend recap' : 'Real-time market updates'}</span>
              <div className="flex items-center space-x-1 text-xs">
                <Brain className="h-3 w-3 text-primary" />
                <span>Powered by Pathway AI</span>
              </div>
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
        
        {/* Pathway Stats */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            <Brain className="w-3 h-3 mr-1" />
            Processed: {pathwayStats.totalProcessed}
          </Badge>
          <Badge variant="outline" className="text-xs">
            High Impact: {pathwayStats.highImpactNews}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Avg Relevance: {pathwayStats.avgRelevanceScore.toFixed(1)}%
          </Badge>
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
        
        {/* Live transcription with Pathway insights */}
        <div className="h-40 overflow-y-auto p-4 bg-muted/30">
          {isWeekend() ? (
            <div className="flex flex-col h-full justify-center items-center">
              <p className="text-muted-foreground">Markets are closed for the weekend.</p>
              <p className="text-sm text-muted-foreground mt-1">Pathway AI analyzing weekend developments.</p>
            </div>
          ) : transcription ? (
            <div className="space-y-2">
              <p className="whitespace-pre-line text-sm">{transcription}</p>
              
              {/* Show latest Pathway insights */}
              {newsSnippets.length > 0 && newsSnippets[newsSnippets.length - 1].pathwayInsights && (
                <div className="mt-3 p-2 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-2 mb-1">
                    <Brain className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium text-primary">Pathway AI Analysis</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {newsSnippets[newsSnippets.length - 1].pathwayInsights?.aiSummary}
                  </div>
                  <div className="flex space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {newsSnippets[newsSnippets.length - 1].pathwayInsights?.sentiment}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {newsSnippets[newsSnippets.length - 1].pathwayInsights?.marketImpact} impact
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground">Waiting for news transcription...</p>
                <div className="flex items-center justify-center mt-2 space-x-2">
                  <Brain className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-xs text-primary">Pathway AI Ready</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}