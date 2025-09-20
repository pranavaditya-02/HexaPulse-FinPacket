"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { type Language, useTranslation } from "@/lib/i18n"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: ReturnType<typeof useTranslation>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const t = useTranslation(language)

  useEffect(() => {
    const saved = localStorage.getItem("trading-buddy-language") as Language
    if (saved) {
      setLanguage(saved)
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.split("-")[0] as Language
      if (["en", "es", "fr", "de", "zh", "ja", "ko", "pt", "ru", "ar"].includes(browserLang)) {
        setLanguage(browserLang)
      }
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("trading-buddy-language", lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
