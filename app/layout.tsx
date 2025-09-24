import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { Toaster } from "@/components/ui/toaster"
import { Chatbot } from "@/components/chatbot"
import "./globals.css"

export const metadata: Metadata = {
  title: "Trading Buddy - AI-Powered Finance Dashboard",
  description:
    "Modern finance AI web app with real-time stock data, market sentiment analysis, and intelligent trading insights. Supports multiple languages and themes.",
  generator: "Trading Buddy",
  keywords: ["trading", "finance", "AI", "stocks", "market analysis", "dashboard"],
  authors: [{ name: "Trading Buddy Team" }],
  openGraph: {
    title: "Trading Buddy - AI Finance Dashboard",
    description: "Next-gen Bloomberg Terminal with AI insights",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('trading-buddy-theme') || 'dark';
                  var root = document.documentElement;
                  
                  root.classList.remove('light', 'dark');
                  
                  if (theme === 'system') {
                    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    root.classList.add(systemTheme);
                  } else {
                    root.classList.add(theme);
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider defaultTheme="dark" storageKey="trading-buddy-theme">
          <LanguageProvider>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            <Toaster />
            <Analytics />
            <Chatbot />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
