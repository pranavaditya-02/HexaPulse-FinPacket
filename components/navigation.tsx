"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SettingsPanel } from "@/components/settings-panel"
import { useLanguage } from "@/components/language-provider"
import { 
  Home, 
  BookmarkIcon, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Menu, 
  X, 
  Sparkles,
  Sun,
  Moon,
  Settings
} from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { t } = useLanguage()

  const navItems = [
    { href: "/", label: t.home, icon: Home },
    { href: "/watchlist", label: t.watchlist, icon: BookmarkIcon },
    { href: "/heatmap", label: t.heatmap, icon: TrendingUp },
    { href: "/alerts", label: t.alerts, icon: AlertTriangle },
    { href: "/digest", label: t.digest, icon: FileText },
  ]

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <nav className="glass-strong border-b sticky top-0 z-50 animate-slide-up backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center space-x-3 group">

            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-blue-600 to-accent bg-clip-text text-transparent">
                HexaPulse
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                FinPocket
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-xl px-4 py-2 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              </Link>
            ))}
            
            {/* Dark Mode Toggle - Enhanced */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 group relative"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <Sun className={`w-5 h-5 transition-all duration-300 ${isDarkMode ? 'scale-0 rotate-180' : 'scale-100 rotate-0'} absolute`} />
              <Moon className={`w-5 h-5 transition-all duration-300 ${isDarkMode ? 'scale-100 rotate-0' : 'scale-0 -rotate-180'} absolute`} />
            </Button>

            {/* Settings Panel */}
            <div className="border-l border-gray-200 dark:border-gray-700 pl-2 ml-2">
              <SettingsPanel />
            </div>
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 relative"
            >
              <Sun className={`w-5 h-5 transition-all duration-300 ${isDarkMode ? 'scale-0 rotate-180' : 'scale-100 rotate-0'} absolute`} />
              <Moon className={`w-5 h-5 transition-all duration-300 ${isDarkMode ? 'scale-100 rotate-0' : 'scale-0 -rotate-180'} absolute`} />
            </Button>

            <SettingsPanel />
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-xl hover:bg-primary/10 transition-all duration-300"
            >
              {isOpen ? 
                <X className="w-5 h-5 rotate-180 transition-transform duration-300" /> : 
                <Menu className="w-5 h-5 transition-transform duration-300" />
              }
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-slide-up border-t border-gray-200 dark:border-gray-700 mt-4">
            {navItems.map((item, index) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start space-x-3 hover:bg-primary/10 hover:text-primary rounded-xl py-3 group transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              </Link>
            ))}
            
            {/* Mobile Menu Footer */}
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Theme
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 flex items-center space-x-2"
                >
                  {isDarkMode ? (
                    <>
                      <Moon className="w-4 h-4" />
                      <span className="text-sm">Dark</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4" />
                      <span className="text-sm">Light</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced styling with CSS custom properties for better theming */}
      <style jsx>{`
        .glass-strong {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
          from {
            box-shadow: 0 0 20px rgba(var(--primary-rgb, 59, 130, 246), 0.4);
          }
          to {
            box-shadow: 0 0 30px rgba(var(--primary-rgb, 59, 130, 246), 0.8);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  )
}