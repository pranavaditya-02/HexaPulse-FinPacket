"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/components/language-provider"
import { languages } from "@/lib/i18n"
import { Settings, Sun, Moon, Monitor, Globe, Palette, Zap } from "lucide-react"

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="relative animate-float">
        <Settings className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md glass-strong animate-slide-up">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center gap-2 justify-center">
                <Palette className="h-5 w-5 text-primary" />
                {t.settings}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  {t.theme}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className="flex items-center gap-1"
                  >
                    <Sun className="h-3 w-3" />
                    {t.lightMode}
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className="flex items-center gap-1"
                  >
                    <Moon className="h-3 w-3" />
                    {t.darkMode}
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("system")}
                    className="flex items-center gap-1"
                  >
                    <Monitor className="h-3 w-3" />
                    System
                  </Button>
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t.language}
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(languages).map(([code, name]) => (
                      <SelectItem key={code} value={code}>
                        <div className="flex items-center gap-2">
                          <span>{name}</span>
                          {code === language && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Premium Features Badge */}
              <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-primary animate-glow" />
                  <span className="text-sm font-medium">Premium Features</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  AI-powered insights, real-time data, and advanced analytics
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setIsOpen(false)} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
