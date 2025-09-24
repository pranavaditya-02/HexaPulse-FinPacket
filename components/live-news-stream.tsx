"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Pause, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function LiveNewsStream() {
  const [transcription, setTranscription] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  // In a real implementation, you would:
  // 1. Connect to the YouTube Live stream
  // 2. Process the audio through a real-time speech-to-text service
  // 3. Update the transcription as new text comes in
  
  // Mock implementation for demonstration
  useEffect(() => {
    const newsItems = [
      "Markets open higher following Fed announcement on interest rates",
      "Tech stocks rally as inflation data comes in lower than expected",
      "Oil prices stabilize after OPEC meeting concludes with production cuts",
      "Healthcare sector showing strong growth amid earnings season",
      "Retail sales data suggests consumer spending remains resilient",
      "Major merger announced in the telecommunications industry",
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      if (!isPlaying) return;
      
      setTranscription((prev) => {
        const newText = newsItems[index % newsItems.length];
        index++;
        return `${newText}\n\n${prev}`.substring(0, 1000);
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, you would control the video playback
  };
  
  const handleMuteUnmute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, you would control the video audio
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
            <CardDescription>Real-time news stream</CardDescription>
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
        <div className="aspect-video bg-black">
          {/* Replace with your YouTube embed URL */}
          <iframe 
            ref={videoRef}
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/KQp-e_XQnDE?si=OJOCjsRiRqlww2gj" 
            title="Financial News Live Stream" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className={isMuted ? "opacity-50" : "opacity-100"}
          ></iframe>
        </div>
        <div className="h-40 overflow-y-auto p-4 bg-muted/30">
          <p className="whitespace-pre-line text-sm">{transcription || "Waiting for news transcription..."}</p>
        </div>
      </CardContent>
    </Card>
  )
}