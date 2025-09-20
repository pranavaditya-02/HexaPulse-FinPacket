"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Mic, Sparkles, Loader2, TrendingUp, AlertCircle } from "lucide-react"

interface SearchResult {
  response: string
  toolCalls?: any[]
  toolResults?: any[]
  timestamp: string
}

export function AISearch() {
  const [query, setQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    setError(null)
    setSearchResult(null)

    try {
      const response = await fetch("/api/ai-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const result = await response.json()
      setSearchResult(result)
    } catch (err) {
      setError("Failed to search. Please try again.")
      console.error("Search error:", err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleVoiceSearch = () => {
    setIsListening(!isListening)
    // TODO: Implement voice search with Web Speech API
    if (!isListening) {
      // Start voice recognition
      if ("webkitSpeechRecognition" in window) {
        const recognition = new (window as any).webkitSpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "en-US"

        recognition.onstart = () => setIsListening(true)
        recognition.onend = () => setIsListening(false)
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setQuery(transcript)
          setIsListening(false)
        }

        recognition.start()
      }
    }
  }

  const formatResponse = (text: string) => {
    // Simple formatting for better readability
    return text.split("\n").map((paragraph, index) => (
      <p key={index} className="mb-2 last:mb-0">
        {paragraph}
      </p>
    ))
  }

  return (
    <div className="space-y-6">
      <Card className="glass max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-center justify-center">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium text-muted-foreground">Ask anything about the markets</span>
            </div>

            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Why is Tesla stock moving? What's happening with Apple?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !isSearching && handleSearch()}
                  className="pl-10 glass border-border/50"
                  disabled={isSearching}
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleVoiceSearch}
                className={`glass ${isListening ? "bg-destructive/20 border-destructive" : ""}`}
                disabled={isSearching}
              >
                <Mic className={`w-4 h-4 ${isListening ? "text-destructive animate-pulse" : ""}`} />
              </Button>

              <Button
                onClick={handleSearch}
                disabled={isSearching || !query.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Market sentiment today",
                "Tesla earnings impact",
                "Best tech stocks",
                "Crypto market analysis",
                "Fed rate decision effects",
                "NVIDIA stock forecast",
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(suggestion)}
                  className="glass text-xs"
                  disabled={isSearching}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {error && (
        <Card className="glass border-destructive/50 max-w-4xl mx-auto">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {searchResult && (
        <Card className="glass max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>AI Analysis</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {new Date(searchResult.timestamp).toLocaleTimeString()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none text-foreground">{formatResponse(searchResult.response)}</div>

            {/* Tool Results Display */}
            {searchResult.toolResults && searchResult.toolResults.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Live Data Used</span>
                </h4>
                <div className="grid gap-3">
                  {searchResult.toolResults.map((result, index) => (
                    <div key={index} className="p-3 rounded-lg glass-strong">
                      <pre className="text-xs text-muted-foreground overflow-x-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
