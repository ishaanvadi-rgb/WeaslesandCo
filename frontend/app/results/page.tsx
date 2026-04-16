"use client"

import { useEffect, useState } from "react"
import { Building2, Mic2, MapPin, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getResults, getEventSpec } from "@/lib/store"

export default function OverviewPage() {
  const [results, setResults] = useState<any>(null)
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>({})

  useEffect(() => {
    const data = getResults()
    if (data) {
      setResults(data)
      // Animate scores in
      setTimeout(() => {
        const scores = data?.critic_scores?.scores ?? {}
        setAnimatedScores(scores)
      }, 300)
    }
  }, [])

  const sponsors = results?.sponsors ?? []
  const speakers = results?.speakers ?? []
  const venues = results?.venues ?? []
  const pricing = results?.pricing ?? {}
  const scores = results?.critic_scores?.scores ?? {}
  const feedback = results?.critic_scores?.feedback ?? {}
  const revenue = pricing?.revenue_projection_usd?.total ?? 0
  const intel = results?.past_event_intel

  const summaryCards = [
    { icon: Building2, label: "Sponsors Found", value: sponsors.filter((s: any) => s?.name).length.toString(), color: "text-primary" },
    { icon: Mic2, label: "Speakers Identified", value: speakers.filter((s: any) => s?.name).length.toString(), color: "text-green-600" },
    { icon: MapPin, label: "Venues Evaluated", value: venues.filter((v: any) => v?.name).length.toString(), color: "text-blue-600" },
    { icon: DollarSign, label: "Revenue Projection", value: revenue ? `$${Math.round(revenue / 1000)}K` : "—", color: "text-primary" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Results Overview</h1>
        <p className="text-muted-foreground">Your AI agents have completed their analysis. Here&apos;s what they found.</p>
      </div>

      {/* Past event intel banner */}
      {intel && !intel.raw && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm font-medium text-amber-800 mb-1">Grounded in real past events</p>
          <p className="text-sm text-amber-700">{intel.what_worked}</p>
          {intel.events_found?.length > 0 && (
            <p className="text-xs text-amber-600 mt-1">
              Based on: {intel.events_found.map((e: any) => e.name).join(", ")}
            </p>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className="bg-card border-border hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-secondary ${card.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{card.value}</p>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quality Scores */}
      {Object.keys(scores).length > 0 && (
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Agent Quality Scores</h2>
          <div className="grid gap-3">
            {Object.entries(scores).map(([agent, score]: [string, any]) => (
              <div key={agent} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground capitalize">{agent}</span>
                  <span className="text-primary font-semibold">{score}/10</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${(animatedScores[agent] ?? 0) * 10}%` }}
                  />
                </div>
                {feedback[agent] && (
                  <p className="text-xs text-muted-foreground mt-2">{feedback[agent]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!results && (
        <div className="text-center py-20 text-muted-foreground">
          No results yet. <a href="/setup" className="text-primary underline">Run the pipeline first.</a>
        </div>
      )}
    </div>
  )
}
