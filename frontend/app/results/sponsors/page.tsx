"use client"

import { useEffect, useState } from "react"
import { Mail, Filter } from "lucide-react"
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
import { getResults } from "@/lib/store"

const tierColor = (tier: string) => {
  switch (tier?.toLowerCase()) {
    case "title": return "bg-primary text-primary-foreground"
    case "gold": return "bg-yellow-500 text-white"
    case "silver": return "bg-gray-400 text-white"
    case "community": return "bg-green-600 text-white"
    default: return "bg-secondary text-secondary-foreground"
  }
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<any[]>([])
  const [filter, setFilter] = useState("all")
  const [emailDraft, setEmailDraft] = useState<number | null>(null)

  useEffect(() => {
    const results = getResults()
    if (results?.sponsors) setSponsors(results.sponsors.filter((s: any) => s?.name))
  }, [])

  const filtered = filter === "all"
    ? sponsors
    : sponsors.filter(s => s.tier?.toLowerCase() === filter)

  if (!sponsors.length) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No sponsor data yet. <a href="/setup" className="text-primary underline">Run the pipeline first.</a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Sponsors</h1>
          <p className="text-muted-foreground">{sponsors.length} potential sponsors identified and ranked by relevance.</p>
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
        {filtered.map((sponsor, index) => (
          <Card key={index} className="bg-card border-border hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-xl font-semibold text-foreground">{sponsor.name}</h3>
                      <Badge className={tierColor(sponsor.tier)}>{sponsor.tier}</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Relevance Score</span>
                      <span className="font-semibold text-primary">{sponsor.relevance_score}/10</span>
                    </div>
                    <Progress value={(sponsor.relevance_score ?? 0) * 10} className="h-2" />
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
                    onClick={() => setEmailDraft(emailDraft === index ? null : index)}
                  >
                    <Mail className="h-4 w-4" />
                    {emailDraft === index ? "Hide Draft" : "Draft Email"}
                  </Button>
                </div>
              </div>

              {emailDraft === index && (
                <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border animate-in fade-in duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Email Draft</span>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(
                      `Subject: Partnership Opportunity\n\nDear ${sponsor.name} Team,\n\n${sponsor.approach}\n\nBest regards,\n[Your Name]`
                    )}>Copy</Button>
                  </div>
                  <div className="font-mono text-sm text-muted-foreground whitespace-pre-wrap">
                    <p className="mb-2"><strong className="text-foreground">Subject:</strong> Partnership Opportunity</p>
                    <p>Dear {sponsor.name} Team,</p>
                    <p className="mt-2">{sponsor.approach}</p>
                    <p className="mt-2">Given your position in the market — {sponsor.why?.toLowerCase()} — we believe this partnership would be mutually beneficial.</p>
                    <p className="mt-4">Best regards,<br />[Your Name]</p>
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
