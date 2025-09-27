"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircleMore, X, Send, Mic, MicOff, Globe, Loader2, ChevronDown, ChevronUp, Maximize2, Minimize2, IndianRupee, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

type Message = {
  id: string
  text: string
  isUser: boolean
  isLoading?: boolean
  stockData?: StockAnalysis
}

interface StockAnalysis {
  symbol: string
  name: string
  currentPrice: number
  change: number
  changePercent: number
  recommendation: 'BUY' | 'SELL' | 'HOLD' | 'STRONG_BUY' | 'STRONG_SELL'
  targetPrice: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  marketCap: number
  pe: number
  analysis: {
    strengths: string[]
    risks: string[]
    outlook: string
  }
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
  { code: "hi", name: "हिंदी" },
];

// Mock stock data - In production, use real API like Alpha Vantage, Yahoo Finance, etc.
const mockStockData: Record<string, StockAnalysis> = {
  'RELIANCE': {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    currentPrice: 2485.30,
    change: 45.20,
    changePercent: 1.85,
    recommendation: 'BUY',
    targetPrice: 2650.00,
    riskLevel: 'MEDIUM',
    marketCap: 1680000,
    pe: 24.5,
    analysis: {
      strengths: ['Strong petrochemical business', 'Growing digital ecosystem with Jio', 'Retail expansion', 'Debt reduction'],
      risks: ['Oil price volatility', 'Regulatory changes', 'Competition in telecom'],
      outlook: 'Positive long-term outlook with diversified business model and strong digital growth'
    }
  },
  'TCS': {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    currentPrice: 3987.45,
    change: -23.15,
    changePercent: -0.58,
    recommendation: 'HOLD',
    targetPrice: 4100.00,
    riskLevel: 'LOW',
    marketCap: 1450000,
    pe: 28.7,
    analysis: {
      strengths: ['Market leader in IT services', 'Strong client relationships', 'Digital transformation expertise'],
      risks: ['Currency fluctuation', 'Visa restrictions', 'Increased competition'],
      outlook: 'Stable growth expected with focus on cloud and digital services'
    }
  },
  'HDFCBANK': {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    currentPrice: 1642.75,
    change: 28.90,
    changePercent: 1.79,
    recommendation: 'STRONG_BUY',
    targetPrice: 1800.00,
    riskLevel: 'LOW',
    marketCap: 1250000,
    pe: 19.8,
    analysis: {
      strengths: ['Strong asset quality', 'Consistent profitability', 'Digital banking leadership', 'Robust deposit growth'],
      risks: ['Interest rate changes', 'Economic slowdown impact', 'Regulatory changes'],
      outlook: 'Excellent fundamentals with strong growth prospects in retail banking'
    }
  },
  'INFY': {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    currentPrice: 1845.60,
    change: -12.35,
    changePercent: -0.66,
    recommendation: 'HOLD',
    targetPrice: 1900.00,
    riskLevel: 'MEDIUM',
    marketCap: 780000,
    pe: 25.4,
    analysis: {
      strengths: ['Strong digital capabilities', 'Good client diversification', 'Consistent margins'],
      risks: ['Talent retention challenges', 'Currency headwinds', 'Slowing growth'],
      outlook: 'Moderate growth expected with focus on automation and AI services'
    }
  },
  'BHARTIARTL': {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd',
    currentPrice: 1567.25,
    change: 67.80,
    changePercent: 4.52,
    recommendation: 'BUY',
    targetPrice: 1700.00,
    riskLevel: 'MEDIUM',
    marketCap: 890000,
    pe: 56.8,
    analysis: {
      strengths: ['5G rollout advantage', 'Strong market position', 'Digital services growth', 'Africa operations'],
      risks: ['High spectrum costs', 'Regulatory pressures', 'Competition from Jio'],
      outlook: 'Positive outlook with 5G monetization and digital services expansion'
    }
  }
};

function StockCard({ stockData }: { stockData: StockAnalysis }) {
  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'STRONG_BUY': return 'bg-green-600 text-white'
      case 'BUY': return 'bg-green-500 text-white'
      case 'HOLD': return 'bg-yellow-500 text-black'
      case 'SELL': return 'bg-red-500 text-white'
      case 'STRONG_SELL': return 'bg-red-600 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="mt-3 p-4 border rounded-lg bg-card space-y-3">
      {/* Stock Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            {stockData.symbol}
            <IndianRupee className="w-4 h-4" />
          </h3>
          <p className="text-sm text-muted-foreground">{stockData.name}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold">₹{stockData.currentPrice.toFixed(2)}</span>
            {stockData.change >= 0 ? 
              <TrendingUp className="w-5 h-5 text-green-500" /> : 
              <TrendingDown className="w-5 h-5 text-red-500" />
            }
          </div>
          <div className={`text-sm ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <span className="text-muted-foreground">Market Cap:</span>
          <div className="font-semibold">₹{(stockData.marketCap / 100000).toFixed(1)}L Cr</div>
        </div>
        <div className="space-y-1">
          <span className="text-muted-foreground">P/E Ratio:</span>
          <div className="font-semibold">{stockData.pe}</div>
        </div>
        <div className="space-y-1">
          <span className="text-muted-foreground">Target Price:</span>
          <div className="font-semibold">₹{stockData.targetPrice.toFixed(2)}</div>
        </div>
        <div className="space-y-1">
          <span className="text-muted-foreground">Upside:</span>
          <div className="font-semibold text-green-600">
            {(((stockData.targetPrice - stockData.currentPrice) / stockData.currentPrice) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Recommendation & Risk */}
      <div className="flex items-center justify-between">
        <Badge className={getRecommendationColor(stockData.recommendation)}>
          {stockData.recommendation.replace('_', ' ')}
        </Badge>
        <Badge variant="outline" className={getRiskColor(stockData.riskLevel)}>
          {stockData.riskLevel} RISK
        </Badge>
      </div>

      {/* Analysis */}
      <div className="space-y-2">
        <div>
          <h4 className="font-semibold text-green-700 text-sm mb-1">Strengths:</h4>
          <ul className="text-xs text-muted-foreground space-y-0.5">
            {stockData.analysis.strengths.map((strength, idx) => (
              <li key={idx}>• {strength}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-red-700 text-sm mb-1">Risks:</h4>
          <ul className="text-xs text-muted-foreground space-y-0.5">
            {stockData.analysis.risks.map((risk, idx) => (
              <li key={idx}>• {risk}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-blue-700 text-sm mb-1">Outlook:</h4>
          <p className="text-xs text-muted-foreground">{stockData.analysis.outlook}</p>
        </div>
      </div>

      <div className="text-xs text-center text-muted-foreground pt-2 border-t">
        ⚠️ This is not financial advice. Please consult with a financial advisor before investing.
      </div>
    </div>
  )
}

function ChatMessage({ message }: { message: Message }) {
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className={line.startsWith('*') ? "font-semibold my-1" : "my-1"}>
        {line.startsWith('*') ? line.substring(1).trim() : line}
      </p>
    ));
  };

  return (
    <div className={cn("mb-3 animate-slide-up", message.isUser ? "flex justify-end" : "flex justify-start")}>
      <div 
        className={cn(
          "max-w-[85%] rounded-lg px-4 py-2",
          message.isUser ? 
            "bg-primary text-primary-foreground shadow-md" : 
            "bg-muted text-muted-foreground shadow-sm"
        )}
      >
        {message.isLoading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm">Analyzing market data...</span>
          </div>
        ) : (
          <>
            <div className="text-sm space-y-1">
              {formatText(message.text)}
            </div>
            {message.stockData && <StockCard stockData={message.stockData} />}
          </>
        )}
      </div>
    </div>
  )
}

function ChatbotContainer({ onClose }: { onClose: () => void }) {
  const { t, language, setLanguage } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "es" | "fr" | "de" | "zh" | "ja" | "ko" | "ru" | "ar" | "pt" | "hi">(language as "en" | "es" | "fr" | "de" | "zh" | "ja" | "ko" | "ru" | "ar" | "pt" | "hi");
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
      en: "Hi! I'm HexaPulse Assistant. I specialize in Indian stock market analysis. Ask me about any company and I'll provide current price, detailed analysis, and investment recommendations. Try asking: 'Should I invest in Reliance?' or 'Analysis of TCS stock'",
      es: "¡Hola! Soy el Asistente de HexaPulse. Me especializo en análisis del mercado de valores indio. Pregúntame sobre cualquier empresa y te proporcionaré el precio actual, análisis detallado y recomendaciones de inversión.",
      hi: "नमस्ते! मैं HexaPulse असिस्टेंट हूं। मैं भारतीय शेयर बाज़ार के विश्लेषण में विशेषज्ञ हूं। किसी भी कंपनी के बारे में पूछें और मैं वर्तमान मूल्य, विस्तृत विश्लेषण और निवेश की सिफारिशें प्रदान करूंगा।",
      // ... other languages
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

  const extractStockSymbol = (text: string): string | null => {
    const symbols = Object.keys(mockStockData);
    const upperText = text.toUpperCase();
    
    // Check for exact matches first
    for (const symbol of symbols) {
      if (upperText.includes(symbol)) {
        return symbol;
      }
    }

    // Check for company name matches
    const nameMatches: Record<string, string> = {
      'RELIANCE': ['RELIANCE', 'RIL'],
      'TCS': ['TCS', 'TATA CONSULTANCY'],
      'HDFCBANK': ['HDFC BANK', 'HDFC'],
      'INFY': ['INFOSYS', 'INFY'],
      'BHARTIARTL': ['BHARTI AIRTEL', 'AIRTEL', 'BHARTI']
    };

    for (const [symbol, names] of Object.entries(nameMatches)) {
      if (names.some(name => upperText.includes(name))) {
        return symbol;
      }
    }

    return null;
  };

  const sendMessageToGemini = async (text: string) => {
    try {
      const stockSymbol = extractStockSymbol(text);
      let response = "";

      if (stockSymbol && mockStockData[stockSymbol]) {
        const stock = mockStockData[stockSymbol];
        
        response = `**${stock.name} (${stock.symbol}) - Investment Analysis**

**Current Market Status:**
• Current Price: ₹${stock.currentPrice.toFixed(2)}
• Today's Change: ${stock.change >= 0 ? '+' : ''}₹${stock.change.toFixed(2)} (${stock.changePercent.toFixed(2)}%)
• Market Cap: ₹${(stock.marketCap / 100000).toFixed(1)} Lakh Crores
• P/E Ratio: ${stock.pe}

**Investment Recommendation: ${stock.recommendation.replace('_', ' ')}**
Target Price: ₹${stock.targetPrice.toFixed(2)} (${(((stock.targetPrice - stock.currentPrice) / stock.currentPrice) * 100).toFixed(1)}% upside)
Risk Level: ${stock.riskLevel}

**Investment Analysis:**

*Key Strengths:*
${stock.analysis.strengths.map(s => `• ${s}`).join('\n')}

*Key Risks:*
${stock.analysis.risks.map(r => `• ${r}`).join('\n')}

*Market Outlook:*
${stock.analysis.outlook}

**Investment Decision Framework:**
${stock.recommendation === 'STRONG_BUY' || stock.recommendation === 'BUY' ? 
  '✅ **POSITIVE INVESTMENT CASE**: Strong fundamentals and growth prospects support investment.' :
  stock.recommendation === 'HOLD' ?
  '⚡ **NEUTRAL CASE**: Current position holders can maintain, new investors may wait for better entry points.' :
  '❌ **CAUTION ADVISED**: Current market conditions suggest careful evaluation before investing.'
}

**Important Disclaimer:** This analysis is for educational purposes only and should not be considered as financial advice. Please consult with a certified financial advisor and conduct your own research before making any investment decisions.`;

        return { response, stockData: stock };
      } else {
        // Regular AI response for non-stock queries
        if (!GEMINI_API_KEY) {
          return { response: "API key is not configured. Please add your Gemini API key to continue.", stockData: null };
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const apiResponse = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are HexaPulse Assistant, a sophisticated Indian financial market expert. 
                    Focus on Indian markets (NSE/BSE), companies, and investment opportunities.
                    
                    If the user asks about investing in any Indian company, provide:
                    1. Brief company overview
                    2. Current market position
                    3. Financial health indicators
                    4. Growth prospects
                    5. Risk assessment
                    6. Investment recommendation with reasoning
                    
                    Always include a disclaimer about not being financial advice.
                    
                    User query (in ${selectedLanguage}): "${text}"
                    Respond in ${selectedLanguage} language.`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topP: 0.8,
              maxOutputTokens: 1500,
            },
          }),
        });

        const data = await apiResponse.json();
        
        if (data.error) {
          return { response: `Sorry, I encountered an error: ${data.error.message}`, stockData: null };
        }
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
          return { response: data.candidates[0].content.parts[0].text, stockData: null };
        } else {
          return { response: "I'm having trouble processing that request. Can you try asking about a specific Indian company?", stockData: null };
        }
      }
    } catch (error) {
      console.error("Error:", error);
      return { response: "I'm sorry, I couldn't connect to my knowledge base. Please check your internet connection and try again.", stockData: null };
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
    const currentInput = input;
    setInput("");
    setIsProcessing(true);
    
    try {
      const { response, stockData } = await sendMessageToGemini(currentInput);
      
      setMessages((prev) => prev.map((msg) => 
        msg.id === pendingMessage.id 
          ? { ...msg, text: response, isLoading: false, stockData } 
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
      
      setTimeout(() => {
        const mockTranscriptions = [
          "Should I invest in Reliance?",
          "Tell me about TCS stock",
          "Analysis of HDFC Bank",
          "Is Bharti Airtel a good investment?"
        ];
        const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
        setInput(randomTranscription);
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
          ? "bottom-6 w-[90vw] sm:w-[600px] h-[85vh]" 
          : "bottom-24 w-80 sm:w-96 h-[600px]"
      )}
    >
      <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <IndianRupee className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-medium">HexaPulse Assistant</span>
            <div className="text-xs text-muted-foreground">Indian Stock Market Expert</div>
          </div>
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
        {/* Quick Actions */}
        <div className="mb-3 flex flex-wrap gap-2">
          {['RELIANCE', 'TCS', 'HDFCBANK', 'BHARTIARTL'].map((symbol) => (
            <Button
              key={symbol}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setInput(`Should I invest in ${symbol}?`)}
            >
              {symbol}
            </Button>
          ))}
        </div>

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
            placeholder="Ask: 'Should I invest in Reliance?' or 'TCS stock analysis'"
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
          <p>Powered by Google Gemini AI • Indian Market Data</p>
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
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-accent hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
              size="icon"
            >
              <MessageCircleMore className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            Indian Stock Market Assistant
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {isOpen && <ChatbotContainer onClose={() => setIsOpen(false)} />}
    </>
  );
}