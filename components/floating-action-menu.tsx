"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { Plus, MessageSquare, Bell, Settings, Zap, X, Sparkles } from "lucide-react"

export function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  const actions = [
    { icon: MessageSquare, label: "AI Chat", color: "text-primary", action: () => console.log("AI Chat") },
    { icon: Bell, label: "Alerts", color: "text-accent", action: () => console.log("Alerts") },
    { icon: Settings, label: "Settings", color: "text-secondary", action: () => console.log("Settings") },
    { icon: Zap, label: "Quick Analysis", color: "text-destructive", action: () => console.log("Analysis") },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <Card className="mb-4 glass-strong animate-slide-up">
          <CardContent className="p-3">
            <div className="space-y-2">
              {actions.map((action, index) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  size="sm"
                  onClick={action.action}
                  className={`w-full justify-start gap-2 animate-slide-up ${action.color}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-14 h-14 shadow-lg animate-glow hover:scale-110 transition-transform"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <Plus className="h-6 w-6" />
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs animate-pulse"
            >
              <Sparkles className="w-3 h-3" />
            </Badge>
          </div>
        )}
      </Button>
    </div>
  )
}
