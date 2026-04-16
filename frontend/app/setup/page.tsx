"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Cpu, Link2, Leaf, Music, Trophy, Heart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { setEventSpec } from "@/lib/store"

const categories = [
  { id: "ai-ml", name: "AI/ML", icon: Cpu },
  { id: "web3", name: "Web3", icon: Link2 },
  { id: "climate", name: "ClimateTech", icon: Leaf },
  { id: "music", name: "Music Festival", icon: Music },
  { id: "sports", name: "Sports", icon: Trophy },
  { id: "health", name: "HealthTech", icon: Heart },
]

const geographies = [
  { id: "india", name: "India", flag: "🇮🇳" },
  { id: "usa", name: "USA", flag: "🇺🇸" },
  { id: "europe", name: "Europe", flag: "🇪🇺" },
  { id: "singapore", name: "Singapore", flag: "🇸🇬" },
  { id: "uae", name: "UAE", flag: "🇦🇪" },
  { id: "uk", name: "UK", flag: "🇬🇧" },
]

export default function SetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState("")
  const [geography, setGeography] = useState("")
  const [eventName, setEventName] = useState("")
  const [audienceSize, setAudienceSize] = useState([5000])
  const [eventDate, setEventDate] = useState("")

  const canProceed = () => {
    if (step === 1) return category !== ""
    if (step === 2) return geography !== ""
    if (step === 3) return eventName !== "" && eventDate !== ""
    return false
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      setEventSpec({
        category,
        geography,
        audience_size: audienceSize[0],
      })
      router.push("/pipeline")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold text-foreground">
            ConferenceAI
          </Link>
          <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </Link>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                  s < step 
                    ? "bg-primary text-primary-foreground" 
                    : s === step 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-muted-foreground"
                }`}
              >
                {s < step ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 rounded ${s < step ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {step === 1 && (
            <div className="animate-in fade-in duration-300">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-3">
                What type of event?
              </h2>
              <p className="text-muted-foreground text-center mb-10">
                Choose the category that best fits your conference
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                        category === cat.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <Icon className={`h-10 w-10 mx-auto mb-3 ${category === cat.id ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`font-medium ${category === cat.id ? "text-primary" : "text-foreground"}`}>
                        {cat.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in duration-300">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-3">
                Where will it be held?
              </h2>
              <p className="text-muted-foreground text-center mb-10">
                Select the primary geography for your event
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {geographies.map((geo) => (
                  <button
                    key={geo.id}
                    onClick={() => setGeography(geo.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                      geography === geo.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <span className="text-4xl block mb-3">{geo.flag}</span>
                    <span className={`font-medium ${geography === geo.id ? "text-primary" : "text-foreground"}`}>
                      {geo.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in duration-300">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-3">
                Event details
              </h2>
              <p className="text-muted-foreground text-center mb-10">
                Tell us more about your conference
              </p>
              <div className="max-w-md mx-auto space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="eventName" className="text-foreground">Event Name</Label>
                  <Input
                    id="eventName"
                    placeholder="e.g., TechSummit 2025"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="bg-card border-border"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Expected Audience</Label>
                    <span className="text-primary font-semibold">{audienceSize[0].toLocaleString()} attendees</span>
                  </div>
                  <Slider
                    value={audienceSize}
                    onValueChange={setAudienceSize}
                    min={100}
                    max={50000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>100</span>
                    <span>50,000</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="text-foreground">Event Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="bg-card border-border"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {step === 3 ? "Launch Agents" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
