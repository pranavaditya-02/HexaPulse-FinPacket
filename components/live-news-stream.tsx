"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Pause, Play, Brain, Zap, FileText, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Subtitle types
type SubtitleEntry = {
  id: number;
  startTime: number; // in seconds
  endTime: number; // in seconds
  text: string;
}

// News types
type NewsSnippet = {
  id: string;
  text: string;
  timestamp: Date;
  category: "general" | "markets" | "stocks" | "crypto" | "economy";
  processed: boolean;
  pathwayInsights?: {
    sentiment: "positive" | "negative" | "neutral";
    relevanceScore: number;
    keyEntities: string[];
    marketImpact: "high" | "medium" | "low";
    aiSummary: string;
  };
}

export function LiveNewsStream() {
  // Hardcoded YouTube video URL - replace with your video
  const YOUTUBE_VIDEO_URL = "https://www.youtube.com/watch?v=iX4z3Jo6e78";
  const SRT_FILE_PATH = "/assets/subtitle.srt";
  
  const [videoId, setVideoId] = useState("");
  const [subtitles, setSubtitles] = useState<SubtitleEntry[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<SubtitleEntry | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [newsSnippets, setNewsSnippets] = useState<NewsSnippet[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [pathwayProcessing, setPathwayProcessing] = useState(false);
  const [subtitlesLoaded, setSubtitlesLoaded] = useState(false);
  const [videoStartTime, setVideoStartTime] = useState<Date | null>(null);
  const [initialVideoLoad, setInitialVideoLoad] = useState(true);
  const [pathwayStats, setPathwayStats] = useState({
    totalProcessed: 0,
    highImpactNews: 0,
    avgRelevanceScore: 0
  });
  
  const videoRef = useRef<HTMLIFrameElement>(null);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Keywords for automatic categorization
  const categoryKeywords = {
    markets: ["index", "market", "nifty", "sensex", "trading", "rally", "decline", "correction", "bull", "bear", "stocks", "futures"],
    stocks: ["stock", "share", "company", "earnings", "dividend", "CEO", "gains", "falls", "investor", "shareholders", "alibaba", "micron", "oracle"],
    economy: ["RBI", "interest rate", "inflation", "GDP", "economic", "growth", "policy", "repo rate", "FII", "federal", "fed", "employment", "jobs"],
    crypto: ["bitcoin", "ethereum", "crypto", "blockchain", "token", "coin", "defi", "wallet", "mining", "nft"]
  };

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string): string => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : "";
  };

  // Parse SRT file content
  const parseSRT = (srtContent: string): SubtitleEntry[] => {
    const entries: SubtitleEntry[] = [];
    const blocks = srtContent.trim().split(/\n\s*\n/);

    blocks.forEach(block => {
      const lines = block.trim().split('\n');
      if (lines.length >= 3) {
        const id = parseInt(lines[0]);
        const timeMatch = lines[1].match(/(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/);
        
        if (timeMatch) {
          const startTime = 
            parseInt(timeMatch[1]) * 3600 + 
            parseInt(timeMatch[2]) * 60 + 
            parseInt(timeMatch[3]) + 
            parseInt(timeMatch[4]) / 1000;
          
          const endTime = 
            parseInt(timeMatch[5]) * 3600 + 
            parseInt(timeMatch[6]) * 60 + 
            parseInt(timeMatch[7]) + 
            parseInt(timeMatch[8]) / 1000;

          const text = lines.slice(2).join(' ').replace(/<[^>]*>/g, '');

          entries.push({
            id,
            startTime,
            endTime,
            text
          });
        }
      }
    });

    return entries.sort((a, b) => a.startTime - b.startTime);
  };

  // Load SRT file from assets
  const loadSubtitles = async () => {
    try {
      console.log('Loading subtitles from:', SRT_FILE_PATH);
      const response = await fetch(SRT_FILE_PATH);
      
      if (response.ok) {
        const srtContent = await response.text();
        const parsedSubtitles = parseSRT(srtContent);
        setSubtitles(parsedSubtitles);
        setSubtitlesLoaded(true);
        console.log(`Successfully loaded ${parsedSubtitles.length} subtitles`);
      } else {
        console.error('Failed to load SRT file. Status:', response.status, response.statusText);
        setSubtitlesLoaded(false);
      }
    } catch (error) {
      console.error('Error loading SRT file:', error);
      setSubtitlesLoaded(false);
    }
  };

  // Initialize component
  useEffect(() => {
    const id = extractVideoId(YOUTUBE_VIDEO_URL);
    if (id) {
      setVideoId(id);
      loadSubtitles();
    }
  }, []);

  // Auto-categorize text based on keywords
  const categorizeText = (text: string): "general" | "markets" | "stocks" | "crypto" | "economy" => {
    const lowerText = text.toLowerCase();
    
    if (categoryKeywords.markets.some(keyword => lowerText.includes(keyword))) return "markets";
    if (categoryKeywords.stocks.some(keyword => lowerText.includes(keyword))) return "stocks";
    if (categoryKeywords.economy.some(keyword => lowerText.includes(keyword))) return "economy";
    if (categoryKeywords.crypto.some(keyword => lowerText.includes(keyword))) return "crypto";
    
    return "general";
  };

  // Process news with AI analysis
  const processNewsWithPathway = async (text: string) => {
    // Avoid duplicate processing
    const isDuplicate = newsSnippets.some(snippet => snippet.text === text);
    if (isDuplicate) return;

    try {
      setPathwayProcessing(true);
      
      const newSnippet: NewsSnippet = {
        id: `news-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        text,
        timestamp: new Date(),
        category: categorizeText(text),
        processed: false
      };

      // Simulate AI processing
      setTimeout(() => {
        newSnippet.pathwayInsights = {
          sentiment: determineSentiment(text),
          relevanceScore: Math.floor(Math.random() * 40) + 60,
          keyEntities: extractKeyEntities(text),
          marketImpact: determineMarketImpact(text),
          aiSummary: `AI Analysis: ${text.length > 100 ? text.substring(0, 100) + '...' : text}`
        };
        newSnippet.processed = true;

        setNewsSnippets(prev => [newSnippet, ...prev].slice(0, 20));
        
        // Update stats
        setPathwayStats(prev => ({
          totalProcessed: prev.totalProcessed + 1,
          highImpactNews: prev.highImpactNews + (newSnippet.pathwayInsights?.marketImpact === 'high' ? 1 : 0),
          avgRelevanceScore: Math.round((prev.avgRelevanceScore * prev.totalProcessed + (newSnippet.pathwayInsights?.relevanceScore || 0)) / (prev.totalProcessed + 1))
        }));
        
        setPathwayProcessing(false);
      }, 1500);

    } catch (error) {
      console.error('Error processing news:', error);
      setPathwayProcessing(false);
    }
  };

  // Simple sentiment analysis
  const determineSentiment = (text: string): "positive" | "negative" | "neutral" => {
    const positiveWords = ["gains", "rises", "surge", "rally", "up", "positive", "growth", "strong", "beat", "higher", "soaring", "optimism", "rebound"];
    const negativeWords = ["falls", "decline", "drop", "losses", "down", "negative", "weak", "pressure", "sold off", "pullback", "risks", "failed"];
    
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
    const stockNames = ["ALIBABA", "MICRON", "ORACLE", "NVIDIA", "S&P", "NASDAQ", "DOW"];
    const companies = ["YAHOO", "FINANCE", "FED", "FEDERAL RESERVE"];
    
    [...stockNames, ...companies].forEach(entity => {
      if (text.toUpperCase().includes(entity)) entities.push(entity);
    });
    
    return entities.slice(0, 3);
  };

  // Determine market impact
  const determineMarketImpact = (text: string): "high" | "medium" | "low" => {
    const highImpactWords = ["AI", "federal reserve", "fed", "interest rate", "bubble", "market", "rally", "crash", "earnings", "futures"];
    const mediumImpactWords = ["stock", "company", "announcement", "revenue"];
    
    const lowerText = text.toLowerCase();
    
    if (highImpactWords.some(word => lowerText.includes(word))) return "high";
    if (mediumImpactWords.some(word => lowerText.includes(word))) return "medium";
    return "low";
  };

  // Check if subtitle contains financial content
  const containsFinancialKeywords = (text: string): boolean => {
    const keywords = [
      'market', 'stock', 'share', 'trading', 'investor', 'earnings', 'revenue',
      'financial', 'economy', 'fed', 'federal reserve', 'interest rate',
      'company', 'business', 'AI', 'alibaba', 'micron', 'oracle', 'nvidia',
      'futures', 'rally', 'decline', 'gains', 'losses'
    ];
    
    const lowerText = text.toLowerCase();
    return keywords.some(keyword => lowerText.includes(keyword));
  };

  // Handle play/pause
  const handlePlayPause = () => {
    if (!isPlaying) {
      setVideoStartTime(new Date());
      setCurrentTime(0);
      setInitialVideoLoad(false);
    }
    setIsPlaying(!isPlaying);
  };

  // Handle mute/unmute
  const handleMuteUnmute = () => {
    setIsMuted(!isMuted);
  };

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Update current time and find current subtitle
  useEffect(() => {
    if (isPlaying && videoId && subtitles.length > 0 && videoStartTime) {
      timeIntervalRef.current = setInterval(() => {
        const now = new Date();
        const elapsed = (now.getTime() - videoStartTime.getTime()) / 1000;
        setCurrentTime(elapsed);
        
        // Find current subtitle
        const currentSub = subtitles.find(sub => 
          elapsed >= sub.startTime && elapsed <= sub.endTime
        );
        
        if (currentSub && currentSub.id !== currentSubtitle?.id) {
          setCurrentSubtitle(currentSub);
          
          // Process financial content
          if (containsFinancialKeywords(currentSub.text)) {
            processNewsWithPathway(currentSub.text);
          }
        } else if (!currentSub && currentSubtitle) {
          setCurrentSubtitle(null);
        }
      }, 500);
    } else {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
    }

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, [isPlaying, videoId, subtitles, currentSubtitle, videoStartTime]);

  // Jump to specific time
  const jumpToTime = (time: number) => {
    const now = new Date();
    setVideoStartTime(new Date(now.getTime() - (time * 1000)));
    setCurrentTime(time);
  };

  // Generate stable YouTube URL - only changes when play state changes
  const getYouTubeUrl = () => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&enablejsapi=1&controls=1&rel=0`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <span className="flex h-3 w-3 mr-2">
                <span className={`animate-ping absolute inline-flex h-3 w-3 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              Live Financial News Analysis
              {pathwayProcessing && (
                <Zap className="ml-2 h-4 w-4 text-yellow-400 animate-pulse" title="AI Processing" />
              )}
            </CardTitle>
            <CardDescription className="flex items-center space-x-4">
              <span>{isPlaying ? 'Playing with synchronized subtitles' : 'Ready to analyze'}</span>
            </CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button size="icon" variant="ghost" onClick={handleMuteUnmute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={handlePlayPause} disabled={!videoId || !subtitlesLoaded}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Video Player - Stable URL to prevent flickering */}
        {videoId && (
          <div className="aspect-video bg-black">
            <iframe 
              ref={videoRef}
              key={`${videoId}-${isPlaying}-${isMuted}`} // Only re-render when these change
              width="100%" 
              height="100%" 
              src={getYouTubeUrl()}
              title="Financial News Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className={`transition-opacity duration-200 ${isMuted ? "opacity-70" : "opacity-100"}`}
              style={{ border: 'none' }}
            />
          </div>
        )}
        
        {/* Current Subtitle Display - Large and Prominent */}
        <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          {currentSubtitle ? (
            <div className="animate-in fade-in duration-300">
              <p className="text-lg font-medium leading-relaxed text-foreground">
                {currentSubtitle.text}
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">
                {isPlaying 
                  ? "Waiting for next subtitle..." 
                  : subtitlesLoaded 
                    ? "Click play to start synchronized transcription" 
                    : "Loading subtitles..."}
              </p>
            </div>
          )}
        </div>
        
        {/* Content Display - Updated Layout */}
        <div className="space-y-6 p-4">
          {/* AI-Detected Financial News - Full Width */}
          <div className="w-full">
            <h3 className="font-semibold mb-4 flex items-center text-lg">
              🤖 AI-Detected Financial News
              {pathwayProcessing && (
                <Zap className="ml-2 h-4 w-4 text-yellow-400 animate-pulse" />
              )}
            </h3>
            <div className="h-96 overflow-y-auto p-4 bg-muted/30 rounded-lg border">
              {newsSnippets.length > 0 ? (
                <div className="space-y-4">
                  {newsSnippets.map((snippet) => (
                    <div key={snippet.id} className="p-4 bg-background rounded-lg border animate-in slide-in-from-top duration-300 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className="text-xs capitalize">
                          {snippet.category}
                        </Badge>
                        
                      </div>
                      <p className="text-base mb-3 font-medium leading-relaxed">{snippet.text}</p>
                      
                      {snippet.pathwayInsights && (
                        <div className="space-y-3 pt-3 border-t">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant={
                              snippet.pathwayInsights.sentiment === 'positive' ? 'default' :
                              snippet.pathwayInsights.sentiment === 'negative' ? 'destructive' : 'secondary'
                            } className="text-xs">
                              {snippet.pathwayInsights.sentiment}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {snippet.pathwayInsights.marketImpact} impact
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Score: {snippet.pathwayInsights.relevanceScore}%
                            </Badge>
                          </div>
                          {snippet.pathwayInsights.keyEntities.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {snippet.pathwayInsights.keyEntities.map((entity, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {entity}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">AI will analyze financial content from subtitles</p>
                    <p className="text-sm mt-2">Click play to start analysis</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subtitle Timeline - Full Width */}
          <div className="w-full">
            <h3 className="font-semibold mb-4 flex items-center text-lg">📝 Subtitle Timeline</h3>
            <div className="h-80 overflow-y-auto p-4 bg-muted/30 rounded-lg border space-y-3">
              {subtitles.length > 0 ? (
                subtitles.slice(0, 50).map((subtitle) => (
                  <div 
                    key={subtitle.id} 
                    className={`p-4 rounded border cursor-pointer transition-all duration-200 ${
                      currentSubtitle?.id === subtitle.id 
                        ? 'bg-primary/20 border-primary shadow-md transform scale-[1.02]' 
                        : 'bg-background hover:bg-muted/50 hover:border-muted-foreground/20'
                    }`}
                    onClick={() => jumpToTime(subtitle.startTime)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        {formatTime(subtitle.startTime)} - {formatTime(subtitle.endTime)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        #{subtitle.id}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed">{subtitle.text}</p>
                    {currentSubtitle?.id === subtitle.id && (
                      <div className="mt-3 animate-in fade-in duration-200">
                        <Badge variant="default" className="text-xs">
                          ▶ Currently Playing
                        </Badge>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Loading subtitles...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}