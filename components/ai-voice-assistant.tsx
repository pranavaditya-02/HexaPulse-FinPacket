"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Brain } from "lucide-react"
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
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-float" />
            <span className="font-semibold">AI Voice Assistant</span>
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isListening ? "destructive" : "default"}
              onClick={isListening ? stopListening : startListening}
              className="animate-float"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            {isSpeaking && (
              <Button size="sm" variant="outline" onClick={stopSpeaking}>
                <VolumeX className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {isListening && (
          <div className="mb-4 p-3 bg-primary/10 rounded-lg animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
              <span className="text-sm font-medium">Listening...</span>
            </div>
            {transcript && <p className="text-sm text-muted-foreground">{transcript}</p>}
          </div>
        )}

        {isSpeaking && (
          <div className="mb-4 p-3 bg-accent/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-4 w-4 text-accent animate-pulse" />
              <span className="text-sm font-medium">Speaking...</span>
            </div>
          </div>
        )}

        {response && (
          <div className="p-3 bg-card/50 rounded-lg animate-slide-up">
            <p className="text-sm">{response}</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-2">
          Ask me anything about markets, stocks, or trading strategies
        </p>
      </CardContent>
    </Card>
  )
}
