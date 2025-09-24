"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircleMore, X, Send, Mic, MicOff, Globe, Loader2, ChevronDown, ChevronUp, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Message = {
  id: string
  text: string
  isUser: boolean
  isLoading?: boolean
}

// Access the API key from environment variable
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

// Languages supported by the chatbot
const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "ru", name: "Русский" },
  { code: "ar", name: "العربية" },
];

function ChatMessage({ message }: { message: Message }) {
  const formatText = (text: string) => {
    // Add more sophisticated formatting - handle markdown-like syntax
    return text.split('\n').map((line, i) => (
      <p key={i} className={line.startsWith('*') ? "font-semibold my-1" : "my-1"}>
        {line.startsWith('*') ? line.substring(1).trim() : line}
      </p>
    ));
  };

  return (
    <div 
      className={cn(
        "mb-3 max-w-[85%] rounded-lg px-4 py-2 animate-slide-up",
        message.isUser ? 
          "bg-primary text-primary-foreground ml-auto shadow-md" : 
          "bg-muted text-muted-foreground shadow-sm"
      )}
    >
      {message.isLoading ? (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="text-sm space-y-1">
          {formatText(message.text)}
        </div>
      )}
    </div>
  )
}

function ChatbotContainer({ onClose }: { onClose: () => void }) {
  const { t, language, setLanguage } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "es" | "fr" | "de" | "zh" | "ja" | "ko" | "ru" | "ar" | "pt">(language as "en" | "es" | "fr" | "de" | "zh" | "ja" | "ko" | "ru" | "ar" | "pt");
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    setMessages([{
      id: "welcome",
      text: getWelcomeMessage(language),
      isUser: false,
    }]);
  }, [language]);

  function getWelcomeMessage(lang: string) {
    const welcomeMessages: Record<string, string> = {
      en: "Hi! I'm HexaPulse Assistant. I can help with financial insights, market analysis, and investment questions. What would you like to know today?",
      es: "¡Hola! Soy el Asistente de HexaPulse. Puedo ayudarte con información financiera, análisis de mercado y preguntas sobre inversiones. ¿Qué te gustaría saber hoy?",
      fr: "Bonjour! Je suis l'Assistant HexaPulse. Je peux vous aider avec des informations financières, des analyses de marché et des questions d'investissement. Qu'aimeriez-vous savoir aujourd'hui?",
      de: "Hallo! Ich bin der HexaPulse-Assistent. Ich kann Ihnen mit Finanzinformationen, Marktanalysen und Investitionsfragen helfen. Was möchten Sie heute wissen?",
      zh: "你好！我是 HexaPulse 助手。我可以帮助提供财务见解、市场分析和投资问题。今天您想了解什么？",
      ja: "こんにちは！HexaPulseアシスタントです。財務情報、市場分析、投資に関する質問のお手伝いができます。今日は何についてお知りになりたいですか？",
      ko: "안녕하세요! HexaPulse 어시스턴트입니다. 재무 통찰력, 시장 분석 및 투자 질문에 도움을 드릴 수 있습니다. 오늘은 무엇을 알고 싶으신가요?",
      ru: "Привет! Я помощник HexaPulse. Я могу помочь с финансовой информацией, анализом рынка и вопросами инвестирования. Что бы вы хотели узнать сегодня?",
      ar: "مرحبًا! أنا مساعد HexaPulse. يمكنني المساعدة في الرؤى المالية وتحليل السوق وأسئلة الاستثمار. ما الذي ترغب في معرفته اليوم؟",
    };
    
    return welcomeMessages[lang] || welcomeMessages.en;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus on input when chatbot opens
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

  const handleChangeLanguage = (value: string) => {
    setSelectedLanguage(value as typeof selectedLanguage);
    setLanguage(value as typeof selectedLanguage);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const sendMessageToGemini = async (text: string) => {
    try {
      // Updated API endpoint based on the curl example
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a sophisticated financial assistant named HexaPulse Assistant. 
                  Provide detailed, well-structured analysis on financial topics.
                  
                  When discussing investments or companies:
                  1. Present a clear overview of the company/investment
                  2. Discuss key strengths and potential risks
                  3. Include relevant financial metrics when possible
                  4. Format your response with clear sections and bullet points
                  5. End with important considerations for the investor
                  6. Include a brief disclaimer about not being financial advice
                  
                  The user is asking the following in ${selectedLanguage}: "${text}".
                  Respond in ${selectedLanguage} language.
                  Keep your response comprehensive but concise, with proper structure.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            maxOutputTokens: 1000,
          },
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        return `Sorry, I encountered an error: ${data.error.message}`;
      }
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return "I'm having trouble processing that request. Can you try again?";
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "I'm sorry, I couldn't connect to my knowledge base. Please check your internet connection and try again.";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
    };
    
    const pendingMessage = {
      id: `pending-${Date.now()}`,
      text: "",
      isUser: false,
      isLoading: true,
    };
    
    setMessages((prev) => [...prev, userMessage, pendingMessage]);
    setInput("");
    setIsProcessing(true);
    
    try {
      // Check if API key is available
      if (!GEMINI_API_KEY) {
        setMessages((prev) => prev.map((msg) => 
          msg.id === pendingMessage.id 
            ? { ...msg, text: "API key is not configured. Please add your Gemini API key to the .env.local file.", isLoading: false } 
            : msg
        ));
        setIsProcessing(false);
        return;
      }
      
      const response = await sendMessageToGemini(input);
      
      setMessages((prev) => prev.map((msg) => 
        msg.id === pendingMessage.id 
          ? { ...msg, text: response, isLoading: false } 
          : msg
      ));
    } catch (error) {
      setMessages((prev) => prev.map((msg) => 
        msg.id === pendingMessage.id 
          ? { ...msg, text: "Sorry, I encountered an error processing your request.", isLoading: false } 
          : msg
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunksRef.current.push(event.data);
      });

      mediaRecorder.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        await processAudioInput(audioBlob);
        
        // Stop all tracks in the stream to release the microphone
        stream.getTracks().forEach(track => track.stop());
      });

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access your microphone. Please check permissions and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioInput = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      
      // In a real implementation, you would:
      // 1. Send the audio to a speech-to-text API
      // 2. Get the transcribed text
      // 3. Set it as input or send it directly
      
      // Mock implementation for demonstration:
      setTimeout(() => {
        const mockTranscription = "Tell me about investing in technology stocks";
        setInput(mockTranscription);
        setIsProcessing(false);
      }, 1000);
    } catch (err) {
      console.error("Error processing audio:", err);
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className={cn(
        "fixed right-6 bg-background rounded-xl shadow-xl border border-border flex flex-col z-50 animate-slide-up transition-all duration-300",
        isExpanded 
          ? "bottom-6 w-[90vw] sm:w-[600px] h-[80vh]" 
          : "bottom-24 w-80 sm:w-96 h-[500px]"
      )}
    >
      <div className="p-4 border-b flex items-center justify-between bg-muted/30 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white text-sm font-bold">HP</span>
          </div>
          <span className="font-medium">HexaPulse Assistant</span>
        </div>
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={toggleExpand} className="h-8 w-8">
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isExpanded ? "Minimize" : "Maximize"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Select value={selectedLanguage} onValueChange={handleChangeLanguage}>
                  <SelectTrigger className="w-8 h-8 p-0 justify-center border-none">
                    <SelectValue>
                      <Globe className="h-4 w-4" />
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              <TooltipContent>
                Change Language
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Close
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-background to-muted/20">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t bg-muted/20 rounded-b-xl">
        <form 
          className="flex space-x-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.askAboutMarketTrends || "Ask about market trends..."}
            className="flex-1 bg-background/80"
            disabled={isProcessing || isRecording}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  size="icon"
                  variant="outline"
                  className={cn(
                    isRecording && "bg-red-500 text-white hover:bg-red-600",
                    "transition-all duration-200"
                  )}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isRecording ? "Stop Recording" : "Voice Input"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="submit" 
                  size="icon"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={(!input.trim() || isProcessing) && !isRecording}
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Send Message
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>
        
        <div className="mt-2 text-center text-xs text-muted-foreground">
          <p>Powered by Google Gemini AI</p>
        </div>
      </div>
    </div>
  );
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300 flex items-center justify-center z-50"
              size="icon"
            >
              <MessageCircleMore className="h-6 w-6 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            Financial Assistant
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {isOpen && <ChatbotContainer onClose={() => setIsOpen(false)} />}
    </>
  );
}