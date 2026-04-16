"use client"

import { useEffect, useState } from "react"
import { Mail, Copy, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getResults } from "@/lib/store"

const getTierColor = (tier: string) => {
  switch (tier?.toLowerCase()) {
    case "title": return "bg-primary text-primary-foreground"
    case "gold": return "bg-yellow-500 text-white"
    case "silver": return "bg-gray-400 text-white"
    case "community": return "bg-green-600 text-white"
    default: return "bg-secondary text-secondary-foreground"
  }
}

const generateSponsorEmail = (sponsor: any) =>
  `Subject: Partnership Opportunity\n\nDear ${sponsor.name} Team,\n\nI'm reaching out about a sponsorship opportunity for our upcoming conference.\n\n${sponsor.approach}\n\nGiven your position in the market — ${sponsor.why?.toLowerCase()} — we believe this would be mutually beneficial.\n\nWould you be available for a brief call to discuss?\n\nBest regards,\n[Your Name]`

const generateSpeakerEmail = (speaker: any) =>
  `Subject: Speaking Invitation\n\nDear ${speaker.name},\n\nWe'd love to invite you to speak at our upcoming conference as a ${speaker.suggested_slot?.toLowerCase()} speaker.\n\nGiven your expertise in ${speaker.expertise} — ${speaker.why?.toLowerCase()} — we believe you'd be an exceptional addition.\n\nWe offer full travel coverage, VIP access, and a speaker dinner with industry peers.\n\nWarm regards,\n[Your Name]`

export default function OutreachPage() {
  const [sponsors, setSponsors] = useState<any[]>([])
  const [speakers, setSpeakers] = useState<any[]>([])
  const [selectedSponsor, setSelectedSponsor] = useState<number | null>(null)
  const [selectedSpeaker, setSelectedSpeaker] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    const results = getResults()
    if (results?.sponsors) setSponsors(results.sponsors.filter((s: any) => s?.name))
    if (results?.speakers) setSpeakers(results.speakers.filter((s: any) => s?.name))
  }, [])

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!sponsors.length && !speakers.length) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No outreach data yet. <a href="/setup" className="text-primary underline">Run the pipeline first.</a>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Outreach Center</h1>
        <p className="text-muted-foreground">Generate and copy personalized outreach emails to sponsors and speakers.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Sponsors Column */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Sponsor Outreach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sponsors.map((sponsor, index) => (
              <div key={index}>
                <button
                  onClick={() => setSelectedSponsor(selectedSponsor === index ? null : index)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                    selectedSponsor === index
                      ? "border-primary bg-primary/5"
                      : "border-border bg-secondary/30 hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">{sponsor.name}</span>
                    <Badge className={getTierColor(sponsor.tier)}>{sponsor.tier}</Badge>
                  </div>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </button>

                {selectedSponsor === index && (
                  <div className="mt-3 p-4 bg-secondary/50 rounded-lg border border-border animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">Draft email</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleCopy(generateSponsorEmail(sponsor), `sponsor-${index}`)}
                      >
                        {copiedId === `sponsor-${index}` ? (
                          <><Check className="h-4 w-4 text-green-600" />Copied</>
                        ) : (
                          <><Copy className="h-4 w-4" />Copy</>
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                      {generateSponsorEmail(sponsor)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Speakers Column */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Speaker Outreach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {speakers.map((speaker, index) => (
              <div key={index}>
                <button
                  onClick={() => setSelectedSpeaker(selectedSpeaker === index ? null : index)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                    selectedSpeaker === index
                      ? "border-primary bg-primary/5"
                      : "border-border bg-secondary/30 hover:bg-secondary/50"
                  }`}
                >
                  <div className="text-left">
                    <span className="font-medium text-foreground block">{speaker.name}</span>
                    <span className="text-sm text-muted-foreground">{speaker.title}</span>
                  </div>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </button>

                {selectedSpeaker === index && (
                  <div className="mt-3 p-4 bg-secondary/50 rounded-lg border border-border animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">Draft email</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleCopy(generateSpeakerEmail(speaker), `speaker-${index}`)}
                      >
                        {copiedId === `speaker-${index}` ? (
                          <><Check className="h-4 w-4 text-green-600" />Copied</>
                        ) : (
                          <><Copy className="h-4 w-4" />Copy</>
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                      {generateSpeakerEmail(speaker)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
