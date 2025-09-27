"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Brain, TrendingUp, AlertTriangle, Target, Shield } from "lucide-react"
import type { SpeechRecognition } from "types/speech-recognition" // Assuming SpeechRecognition is a type or interface

export function AIVoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang =
        language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : `${language}-${language.toUpperCase()}`

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)

      recognition.onresult = (event: any) => {
        const current = event.resultIndex
        const transcript = event.results[current][0].transcript
        setTranscript(transcript)

        if (event.results[current].isFinal) {
          handleVoiceQuery(transcript)
        }
      }

      recognitionRef.current = recognition
    }
  }, [language])

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript("")
      setResponse("")
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const handleVoiceQuery = async (query: string) => {
    try {
      const response = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, language }),
      })

      const data = await response.json()
      setResponse(data.response)

      // Text-to-speech response
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(data.response)
        utterance.lang =
          language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : `${language}-${language.toUpperCase()}`
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error("Voice query error:", error)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <Card className="glass border-primary/20 animate-glow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary animate-float" />
            <span className="text-lg font-semibold">AI Voice Assistant</span>
            <Badge variant="secondary" className="text-sm">
              <Sparkles className="w-4 h-4 mr-1" />
              Premium
            </Badge>
          </div>

          <div className="flex gap-3">
            <Button
              size="default"
              variant={isListening ? "destructive" : "default"}
              onClick={isListening ? stopListening : startListening}
              className="animate-float"
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            {isSpeaking && (
              <Button size="default" variant="outline" onClick={stopSpeaking}>
                <VolumeX className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {isListening && (
          <div className="mb-6 p-4 bg-primary/10 rounded-lg animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-primary rounded-full animate-ping" />
              <span className="text-base font-medium">Listening...</span>
            </div>
            {transcript && <p className="text-base text-muted-foreground">{transcript}</p>}
          </div>
        )}

        {isSpeaking && (
          <div className="mb-6 p-4 bg-accent/10 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Volume2 className="h-5 w-5 text-accent animate-pulse" />
              <span className="text-base font-medium">Speaking...</span>
            </div>
          </div>
        )}

        {response && (
          <div className="p-4 bg-card/50 rounded-lg animate-slide-up mb-6">
            <p className="text-base leading-relaxed">{response}</p>
          </div>
        )}

        {/* Sample Investment Analysis Display */}
        <div className="space-y-6 p-5 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-primary">Reliance Industries Ltd (RELIANCE)</h2>
            <p className="text-lg font-semibold text-muted-foreground">Investment Analysis</p>
          </div>

          {/* Current Market Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-xl font-bold">₹2485.30</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Today's Change</p>
              <p className="text-xl font-bold text-green-600">+₹45.20 (1.85%)</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Market Cap</p>
              <p className="text-xl font-bold">₹16.8L Cr</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-sm text-muted-foreground">P/E Ratio</p>
              <p className="text-xl font-bold">24.5</p>
            </div>
          </div>

          {/* Investment Recommendation */}
          <div className="text-center space-y-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <span className="text-2xl font-bold text-green-600">BUY</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-lg">Target: ₹2650.00 (6.6% upside)</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-500" />
                <span className="text-lg text-orange-600">MEDIUM RISK</span>
              </div>
            </div>
          </div>

          {/* Investment Analysis */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Key Strengths */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Key Strengths:
              </h3>
              <ul className="space-y-2 text-base">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  Strong petrochemical business
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  Growing digital ecosystem with Jio
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  Retail expansion
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  Debt reduction
                </li>
              </ul>
            </div>

            {/* Key Risks */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Key Risks:
              </h3>
              <ul className="space-y-2 text-base">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Oil price volatility
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Regulatory changes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Competition in telecom
                </li>
              </ul>
            </div>
          </div>

          {/* Market Outlook */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Market Outlook:</h3>
            <p className="text-base leading-relaxed p-3 bg-background/50 rounded-lg">
              Positive long-term outlook with diversified business model and strong digital growth
            </p>
          </div>

          {/* Investment Decision Framework */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                  POSITIVE INVESTMENT CASE
                </h3>
                <p className="text-base text-green-600 dark:text-green-300">
                  Strong fundamentals and growth prospects support investment.
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400 mb-2">
                  Important Disclaimer
                </h3>
                <p className="text-base text-orange-600 dark:text-orange-300 leading-relaxed">
                  This analysis is for educational purposes only and should not be considered as financial advice. 
                  Please consult with a certified financial advisor and conduct your own research before making any investment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          Ask me anything about markets, stocks, or trading strategies
        </p>
      </CardContent>
    </Card>
  )
}
