"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Droplets, Pill, ShieldCheck, Bug, Sprout, MapPin, Globe, Loader2 } from "lucide-react"

export interface AnalysisResult {
  disease: string
  confidence: number
  treatment: string
  watering: string
  prevention: string
  isHealthy: boolean
}

interface AIAnalysisPanelProps {
  result: AnalysisResult | null
  isLoading: boolean
}

export function AIAnalysisPanel({ result, isLoading }: AIAnalysisPanelProps) {
  const [language, setLanguage] = useState("en")
  const [translatedResult, setTranslatedResult] = useState<AnalysisResult | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)

  const LANGUAGES = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi (हिंदी)" },
    { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
    { code: "bn", name: "Bengali (বাংলা)" },
    { code: "te", name: "Telugu (తెలుగు)" },
    { code: "mr", name: "Marathi (मराठी)" },
    { code: "ta", name: "Tamil (தமிழ்)" },
    { code: "gu", name: "Gujarati (ગુજરાતી)" },
    { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
    { code: "es", name: "Spanish (Español)" },
  ]

  useEffect(() => {
    if (!result) {
      setTranslatedResult(null)
      return
    }

    if (language === "en") {
      setTranslatedResult(result)
      return
    }

    const translateInfo = async () => {
      setIsTranslating(true)
      try {
        // Translate fields in parallel
        const translate = async (text: string) => {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, targetLang: language })
          })
          if (!res.ok) throw new Error("Translation failed")
          const data = await res.json()
          return data.translated || text
        }

        const [tDisease, tTreatment, tWatering, tPrevention] = await Promise.all([
          translate(result.disease),
          translate(result.treatment),
          translate(result.watering),
          translate(result.prevention)
        ])

        setTranslatedResult({
          ...result,
          disease: tDisease,
          treatment: tTreatment,
          watering: tWatering,
          prevention: tPrevention
        })
      } catch (error) {
        console.error("Translation failed:", error)
        setTranslatedResult(result) // Fallback to english
      } finally {
        setIsTranslating(false)
      }
    }

    translateInfo()
  }, [result, language])

  return (
    <div className="w-[320px] shrink-0 flex flex-col bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-[#1B5E20] px-6 py-4 flex items-center justify-between shrink-0 h-16">
        <h2 className="text-lg font-bold text-white leading-none pt-1">AI Analysis</h2>
        {result && (
          <div className="flex items-center bg-white/20 rounded overflow-hidden hover:bg-white/30 transition-colors">
            <Globe className="w-3.5 h-3.5 text-white ml-2 shrink-0" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white text-xs py-1.5 focus:outline-none cursor-pointer appearance-none pl-1.5 pr-2 max-w-[100px] truncate"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="text-black">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 relative overflow-y-auto">
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="w-10 h-10 border-3 border-[#1B5E20] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Analyzing image...</p>
          </div>
        )}

        {!isLoading && !result && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center h-[100%]">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
              <Sprout className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Upload and scan a crop image to get AI-powered disease analysis
            </p>
          </div>
        )}

        {!isLoading && result && (
          <div className="flex flex-col gap-6 relative">
            {isTranslating && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
                <Loader2 className="w-8 h-8 text-[#1B5E20] animate-spin mb-2" />
                <p className="text-xs font-semibold text-[#1B5E20]">Translating...</p>
              </div>
            )}
            
            {/* Disease Name + Confidence */}
            <div className="flex items-start gap-3">
              <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                result.isHealthy ? "bg-green-100" : "bg-red-100"
              }`}>
                {result.isHealthy ? (
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                ) : (
                  <Bug className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Confidence: {result.confidence.toFixed(1)}%
                </p>
                <h3 className={`text-lg font-bold leading-tight mt-0.5 ${
                  result.isHealthy ? "text-green-700" : "text-red-600"
                }`}>
                  {translatedResult?.disease || result.disease}
                </h3>
              </div>
            </div>

            {/* Treatment */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Pill className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Treatment</p>
              </div>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{translatedResult?.treatment || result.treatment}</p>
            </div>

            {/* Watering */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Droplets className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Watering</p>
              </div>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{translatedResult?.watering || result.watering}</p>
            </div>

            {/* Prevention */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Prevention</p>
              </div>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{translatedResult?.prevention || result.prevention}</p>
            </div>

            {/* Pesticide Nearby Store Info */}
            {!result.isHealthy && (
              <div className="mt-1 pt-5 border-t border-dashed border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Local Supplies</p>
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Need treatment supplies? Find agricultural stores and pesticide shops near your location.
                </p>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/search/pesticide+and+agriculture+stores+near+me`, '_blank')}
                  className="w-full py-3 px-4 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MapPin className="w-4 h-4" />
                  Find Nearby Stores
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
