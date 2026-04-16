"use client"

import { useState } from "react"
import { Mail, Copy, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const sponsors = [
  { id: 1, name: "CloudScale AI", tier: "Title", email: "partnerships@cloudscale.ai" },
  { id: 2, name: "Neural Networks Inc", tier: "Gold", email: "sponsors@neuralnetworks.io" },
  { id: 3, name: "DataFlow Systems", tier: "Gold", email: "events@dataflow.dev" },
  { id: 4, name: "TechVentures Capital", tier: "Silver", email: "marketing@techventures.vc" },
  { id: 5, name: "CodeCraft Tools", tier: "Silver", email: "partnerships@codecraft.tools" },
  { id: 6, name: "Open Source Foundation", tier: "Community", email: "events@opensource.ai" },
]

const speakers = [
  { id: 1, name: "Dr. Sarah Chen", role: "Chief AI Scientist", email: "sarah@techgiant.com" },
  { id: 2, name: "Marcus Williams", role: "VP Engineering", email: "marcus@cloudscale.ai" },
  { id: 3, name: "Dr. Priya Sharma", role: "Research Lead", email: "priya@deepmind.com" },
  { id: 4, name: "James O'Connor", role: "Founder", email: "james@aistartuplabs.com" },
  { id: 5, name: "Dr. Lisa Zhang", role: "Professor", email: "lzhang@stanford.edu" },
  { id: 6, name: "Alex Rivera", role: "Head of ML", email: "alex@fintechcorp.com" },
]

const generateSponsorEmail = (name: string) => `Subject: Partnership Opportunity - TechSummit 2025

Dear ${name} Team,

I hope this message finds you well. I'm reaching out on behalf of TechSummit 2025, an upcoming premier AI/ML conference expecting over 5,000 attendees from leading tech companies and startups.

We believe ${name} would be an ideal partner for our event given your strong presence in the AI ecosystem. Our sponsorship packages offer:

- Brand visibility to a highly targeted audience
- Speaking opportunities and workshop hosting
- Premium booth locations and demo spaces
- Exclusive networking access with industry leaders

I'd love to schedule a brief call to discuss how we can create a mutually beneficial partnership.

Would you be available for a 15-minute call this week or next?

Best regards,
[Your Name]
TechSummit 2025 Partnerships Team`

const generateSpeakerEmail = (name: string, role: string) => `Subject: Speaking Invitation - TechSummit 2025

Dear ${name},

I hope this message finds you well. On behalf of the TechSummit 2025 organizing committee, I'm delighted to extend a speaking invitation to you.

Given your exceptional work as ${role} and your thought leadership in the AI community, we believe your insights would be invaluable to our audience of 5,000+ AI practitioners, researchers, and business leaders.

We're offering:
- Keynote or panel speaking opportunity
- Full conference pass and VIP access
- Travel and accommodation coverage
- Exclusive speaker dinner with industry peers

The conference is scheduled for Q3 2025, and we're currently finalizing our speaker lineup.

Would you be interested in joining us? I'd be happy to provide more details on a call at your convenience.

Warm regards,
[Your Name]
TechSummit 2025 Program Committee`

export default function OutreachPage() {
  const [selectedSponsor, setSelectedSponsor] = useState<number | null>(null)
  const [selectedSpeaker, setSelectedSpeaker] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Title":
        return "bg-primary text-primary-foreground"
      case "Gold":
        return "bg-yellow-500 text-white"
      case "Silver":
        return "bg-gray-400 text-white"
      case "Community":
        return "bg-green-600 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Outreach Center</h1>
        <p className="text-muted-foreground">Generate and send personalized outreach emails to sponsors and speakers.</p>
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
            {sponsors.map((sponsor) => (
              <div key={sponsor.id}>
                <button
                  onClick={() => setSelectedSponsor(selectedSponsor === sponsor.id ? null : sponsor.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                    selectedSponsor === sponsor.id
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

                {selectedSponsor === sponsor.id && (
                  <div className="mt-3 p-4 bg-secondary/50 rounded-lg border border-border animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">To: {sponsor.email}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleCopy(generateSponsorEmail(sponsor.name), `sponsor-${sponsor.id}`)}
                      >
                        {copiedId === `sponsor-${sponsor.id}` ? (
                          <>
                            <Check className="h-4 w-4 text-green-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                      {generateSponsorEmail(sponsor.name)}
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
            {speakers.map((speaker) => (
              <div key={speaker.id}>
                <button
                  onClick={() => setSelectedSpeaker(selectedSpeaker === speaker.id ? null : speaker.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                    selectedSpeaker === speaker.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-secondary/30 hover:bg-secondary/50"
                  }`}
                >
                  <div className="text-left">
                    <span className="font-medium text-foreground block">{speaker.name}</span>
                    <span className="text-sm text-muted-foreground">{speaker.role}</span>
                  </div>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </button>

                {selectedSpeaker === speaker.id && (
                  <div className="mt-3 p-4 bg-secondary/50 rounded-lg border border-border animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">To: {speaker.email}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleCopy(generateSpeakerEmail(speaker.name, speaker.role), `speaker-${speaker.id}`)}
                      >
                        {copiedId === `speaker-${speaker.id}` ? (
                          <>
                            <Check className="h-4 w-4 text-green-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                      {generateSpeakerEmail(speaker.name, speaker.role)}
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
