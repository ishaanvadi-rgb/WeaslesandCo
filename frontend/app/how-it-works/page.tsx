"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Search, GitBranch, Building2, Mic2, MapPin, DollarSign, Megaphone, CalendarClock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const agents = [
  {
    id: "researcher",
    name: "Researcher Agent",
    icon: Search,
    description: "Scours the web for industry data, competitor events, pricing benchmarks, and market trends relevant to your conference category and geography.",
    color: "bg-blue-500",
  },
  {
    id: "orchestrator",
    name: "Orchestrator Agent",
    icon: GitBranch,
    description: "Coordinates all specialist agents, manages data flow between them, and ensures each agent has the context it needs to produce quality results.",
    color: "bg-purple-500",
  },
  {
    id: "sponsor",
    name: "Sponsor Hunter",
    icon: Building2,
    description: "Identifies and ranks potential sponsors by budget alignment, industry relevance, and historical sponsorship activity. Generates personalized outreach strategies.",
    color: "bg-primary",
  },
  {
    id: "speaker",
    name: "Speaker Finder",
    icon: Mic2,
    description: "Discovers thought leaders, researchers, and practitioners in your event's domain. Calculates influence scores and suggests appropriate speaking slots.",
    color: "bg-green-500",
  },
  {
    id: "venue",
    name: "Venue Scout",
    icon: MapPin,
    description: "Evaluates venues by capacity, location, cost, and amenities. Provides fit scores and highlights pros/cons for informed decision making.",
    color: "bg-yellow-500",
  },
  {
    id: "pricing",
    name: "Pricing Analyst",
    icon: DollarSign,
    description: "Designs optimal ticket tier structures, models attendance scenarios, and projects revenue across conservative, expected, and optimistic cases.",
    color: "bg-pink-500",
  },
  {
    id: "gtm",
    name: "GTM Strategist",
    icon: Megaphone,
    description: "Creates multi-channel go-to-market plans with budget allocations, timeline phases, and target metrics for maximum attendee acquisition.",
    color: "bg-indigo-500",
  },
  {
    id: "ops",
    name: "Ops Planner",
    icon: CalendarClock,
    description: "Builds comprehensive operational timelines with tasks, priorities, and owner assignments from planning through post-event activities.",
    color: "bg-teal-500",
  },
  {
    id: "critic",
    name: "Critic Agent",
    icon: ShieldCheck,
    description: "Reviews all agent outputs for quality, consistency, and feasibility. Provides scores and highlights areas needing attention before final delivery.",
    color: "bg-red-500",
  },
]

export default function HowItWorksPage() {
  const [activeAgent, setActiveAgent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % agents.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold text-foreground">
            ConferenceAI
          </Link>
          <Link href="/setup">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Start Planning
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 px-6 bg-secondary/30">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6">
              How ConferenceAI Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our autonomous AI agents work in concert to research, plan, and prepare everything you need for a successful conference.
            </p>
          </div>
        </section>

        {/* Animated Pipeline Diagram */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
              The Agent Pipeline
            </h2>

            {/* Visual Pipeline */}
            <div className="relative mb-16">
              <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                {agents.map((agent, index) => {
                  const Icon = agent.icon
                  const isActive = index === activeAgent
                  const isPast = index < activeAgent
                  return (
                    <div key={agent.id} className="flex items-center">
                      <div
                        className={`
                          w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500
                          ${isActive 
                            ? `${agent.color} text-white scale-110 shadow-lg animate-pulse` 
                            : isPast
                              ? "bg-green-500 text-white"
                              : "bg-secondary text-muted-foreground"
                          }
                        `}
                      >
                        <Icon className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      {index < agents.length - 1 && (
                        <div className={`w-4 md:w-8 h-0.5 ${isPast ? "bg-green-500" : "bg-border"}`} />
                      )}
                    </div>
                  )
                })}
              </div>
              <p className="text-center mt-6 text-primary font-medium animate-pulse">
                {agents[activeAgent].name} is working...
              </p>
            </div>

            {/* Agent Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent, index) => {
                const Icon = agent.icon
                const isActive = index === activeAgent
                return (
                  <Card 
                    key={agent.id} 
                    className={`bg-card border-border transition-all duration-300 hover:shadow-lg ${isActive ? "ring-2 ring-primary shadow-lg" : ""}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${agent.color} text-white shrink-0`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                            {agent.name}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {agent.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-20 px-6 bg-secondary/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
              Your Journey
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Configure Your Event",
                  description: "Choose your event category, geography, expected audience size, and date. Our agents use this context to tailor every recommendation.",
                },
                {
                  step: 2,
                  title: "Watch Agents Work",
                  description: "See the live pipeline as each agent researches, analyzes, and generates recommendations. Real-time logs show exactly what's happening.",
                },
                {
                  step: 3,
                  title: "Review Results",
                  description: "Explore detailed findings across sponsors, speakers, venues, pricing, marketing, and operations. Each recommendation includes reasoning and scores.",
                },
                {
                  step: 4,
                  title: "Take Action",
                  description: "Use our built-in outreach tools to generate personalized emails for sponsors and speakers. Export your plan and start executing.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to plan your conference?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Let our AI agents do the heavy lifting while you focus on what matters.
            </p>
            <Link href="/setup">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 h-auto group"
              >
                Start Planning Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif text-lg font-bold text-foreground">ConferenceAI</span>
          <p className="text-muted-foreground text-sm">
            © 2024 ConferenceAI. Autonomous conference planning.
          </p>
        </div>
      </footer>
    </div>
  )
}
