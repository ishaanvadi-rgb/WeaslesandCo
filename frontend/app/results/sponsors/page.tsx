"use client"

import { useState } from "react"
import { Mail, ExternalLink, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const sponsors = [
  {
    id: 1,
    name: "CloudScale AI",
    tier: "Title",
    tierColor: "bg-primary text-primary-foreground",
    relevance: 92,
    why: "Leading enterprise AI platform with $50M+ marketing budget. Recently sponsored 3 major tech conferences.",
    approach: "Emphasize exclusive branding rights and keynote speaking slot.",
    website: "cloudscale.ai",
  },
  {
    id: 2,
    name: "Neural Networks Inc",
    tier: "Gold",
    tierColor: "bg-yellow-500 text-white",
    relevance: 88,
    why: "Fast-growing ML startup looking to establish thought leadership in the AI space.",
    approach: "Offer workshop hosting and demo booth in prime location.",
    website: "neuralnetworks.io",
  },
  {
    id: 3,
    name: "DataFlow Systems",
    tier: "Gold",
    tierColor: "bg-yellow-500 text-white",
    relevance: 85,
    why: "Data infrastructure company targeting enterprise AI teams. Strong alignment with attendee profile.",
    approach: "Highlight networking opportunities with enterprise decision makers.",
    website: "dataflow.dev",
  },
  {
    id: 4,
    name: "TechVentures Capital",
    tier: "Silver",
    tierColor: "bg-gray-400 text-white",
    relevance: 78,
    why: "VC firm with AI-focused portfolio. Interested in deal flow from conference attendees.",
    approach: "Offer investor panel participation and startup showcase access.",
    website: "techventures.vc",
  },
  {
    id: 5,
    name: "CodeCraft Tools",
    tier: "Silver",
    tierColor: "bg-gray-400 text-white",
    relevance: 75,
    why: "Developer tools company with AI code assistant product. Launching new features Q3.",
    approach: "Propose hands-on coding workshop sponsorship.",
    website: "codecraft.tools",
  },
  {
    id: 6,
    name: "Open Source Foundation",
    tier: "Community",
    tierColor: "bg-green-600 text-white",
    relevance: 82,
    why: "Non-profit supporting open-source AI. Strong community goodwill and reach.",
    approach: "Offer community track naming rights and contributor recognition.",
    website: "opensource.ai",
  },
]

export default function SponsorsPage() {
  const [filter, setFilter] = useState("all")
  const [emailDraft, setEmailDraft] = useState<number | null>(null)

  const filteredSponsors = filter === "all" 
    ? sponsors 
    : sponsors.filter(s => s.tier.toLowerCase() === filter)

  const handleDraftEmail = (id: number) => {
    setEmailDraft(emailDraft === id ? null : id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Sponsors</h1>
          <p className="text-muted-foreground">6 potential sponsors identified and ranked by relevance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="community">Community</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredSponsors.map((sponsor) => (
          <Card key={sponsor.id} className="bg-card border-border hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-xl font-semibold text-foreground">{sponsor.name}</h3>
                      <Badge className={sponsor.tierColor}>{sponsor.tier}</Badge>
                    </div>
                    <a 
                      href={`https://${sponsor.website}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Relevance Score</span>
                      <span className="font-semibold text-primary">{sponsor.relevance}%</span>
                    </div>
                    <Progress value={sponsor.relevance} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      <span className="text-foreground font-medium">Why: </span>
                      {sponsor.why}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="text-foreground font-medium">Approach: </span>
                      {sponsor.approach}
                    </p>
                  </div>

                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => handleDraftEmail(sponsor.id)}
                  >
                    <Mail className="h-4 w-4" />
                    {emailDraft === sponsor.id ? "Hide Draft" : "Draft Email"}
                  </Button>
                </div>
              </div>

              {emailDraft === sponsor.id && (
                <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border animate-in fade-in duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Email Draft</span>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(`Subject: Partnership Opportunity - TechSummit 2025

Dear ${sponsor.name} Team,

I'm reaching out regarding an exciting sponsorship opportunity for TechSummit 2025, a premier AI/ML conference expecting 5,000+ attendees.

${sponsor.approach}

Given your position in the market and ${sponsor.why.toLowerCase()}, we believe this partnership would be mutually beneficial.

I'd love to schedule a brief call to discuss the details.

Best regards,
[Your Name]
TechSummit 2025 Team`)}>
                      Copy
                    </Button>
                  </div>
                  <div className="font-mono text-sm text-muted-foreground whitespace-pre-wrap">
                    <p className="mb-2"><strong className="text-foreground">Subject:</strong> Partnership Opportunity - TechSummit 2025</p>
                    <p className="mb-4"><strong className="text-foreground">To:</strong> partnerships@{sponsor.website}</p>
                    <p>Dear {sponsor.name} Team,</p>
                    <p className="mt-2">I&apos;m reaching out regarding an exciting sponsorship opportunity for TechSummit 2025, a premier AI/ML conference expecting 5,000+ attendees.</p>
                    <p className="mt-2">{sponsor.approach}</p>
                    <p className="mt-2">Given your position in the market and {sponsor.why.toLowerCase()}, we believe this partnership would be mutually beneficial.</p>
                    <p className="mt-2">I&apos;d love to schedule a brief call to discuss the details.</p>
                    <p className="mt-4">Best regards,<br />[Your Name]<br />TechSummit 2025 Team</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
