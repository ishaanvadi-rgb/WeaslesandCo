"use client"

import { useState } from "react"
import { Mail, Star, Twitter, Linkedin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const speakers = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "Chief AI Scientist, TechGiant",
    slot: "Keynote",
    slotColor: "bg-primary text-primary-foreground",
    influence: 98,
    why: "Published 50+ papers on transformer architectures. 500K+ Twitter followers. Previous keynotes at NeurIPS, ICML.",
    topics: ["Large Language Models", "AI Safety", "Scaling Laws"],
  },
  {
    id: 2,
    name: "Marcus Williams",
    role: "VP Engineering, CloudScale AI",
    slot: "Keynote",
    slotColor: "bg-primary text-primary-foreground",
    influence: 92,
    why: "Built ML infrastructure serving 100M+ users. Known for practical, actionable talks. Strong LinkedIn presence.",
    topics: ["MLOps", "Production ML", "Infrastructure"],
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    role: "Research Lead, DeepMind",
    slot: "Panel",
    slotColor: "bg-blue-600 text-white",
    influence: 95,
    why: "Pioneer in reinforcement learning. TED talk with 2M+ views. Excellent at explaining complex topics.",
    topics: ["Reinforcement Learning", "AI Agents", "Game AI"],
  },
  {
    id: 4,
    name: "James O'Connor",
    role: "Founder, AI Startup Labs",
    slot: "Workshop",
    slotColor: "bg-green-600 text-white",
    influence: 78,
    why: "Serial entrepreneur with 2 successful AI exits. Hands-on teaching style. Popular YouTube channel.",
    topics: ["AI Startups", "Product-Market Fit", "Fundraising"],
  },
  {
    id: 5,
    name: "Dr. Lisa Zhang",
    role: "Professor, Stanford AI Lab",
    slot: "Panel",
    slotColor: "bg-blue-600 text-white",
    influence: 89,
    why: "Leading researcher in computer vision. Authored textbook used by 100+ universities. Engaging speaker.",
    topics: ["Computer Vision", "Multimodal AI", "AI Education"],
  },
  {
    id: 6,
    name: "Alex Rivera",
    role: "Head of ML, FinTech Corp",
    slot: "Talk",
    slotColor: "bg-purple-600 text-white",
    influence: 75,
    why: "Built fraud detection systems saving $500M annually. Practical industry perspective. Rising star.",
    topics: ["FinTech AI", "Fraud Detection", "Risk Modeling"],
  },
  {
    id: 7,
    name: "Dr. Michael Foster",
    role: "AI Ethics Lead, OpenAI",
    slot: "Panel",
    slotColor: "bg-blue-600 text-white",
    influence: 86,
    why: "Leading voice on AI safety and ethics. Congressional testimony experience. Thoughtful, balanced views.",
    topics: ["AI Ethics", "Safety", "Governance"],
  },
  {
    id: 8,
    name: "Nina Patel",
    role: "CTO, HealthTech AI",
    slot: "Talk",
    slotColor: "bg-purple-600 text-white",
    influence: 72,
    why: "Pioneering AI in healthcare diagnostics. FDA approval experience. Inspiring personal story.",
    topics: ["Healthcare AI", "Regulatory", "Clinical ML"],
  },
]

export default function SpeakersPage() {
  const [emailDraft, setEmailDraft] = useState<number | null>(null)

  const handleDraftInvite = (id: number) => {
    setEmailDraft(emailDraft === id ? null : id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Speakers</h1>
        <p className="text-muted-foreground">8 potential speakers identified and ranked by influence score.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {speakers.map((speaker) => (
          <Card key={speaker.id} className="bg-card border-border hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">{speaker.name}</h3>
                    <p className="text-sm text-muted-foreground">{speaker.role}</p>
                  </div>
                  <Badge className={speaker.slotColor}>{speaker.slot}</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-foreground">{speaker.influence}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">influence score</span>
                </div>

                <p className="text-sm text-muted-foreground">{speaker.why}</p>

                <div className="flex flex-wrap gap-2">
                  {speaker.topics.map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2"
                    onClick={() => handleDraftInvite(speaker.id)}
                  >
                    <Mail className="h-4 w-4" />
                    Draft Invite
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {emailDraft === speaker.id && (
                <div className="mt-4 p-4 bg-secondary/50 rounded-lg border border-border animate-in fade-in duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Invitation Draft</span>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(`Subject: Speaking Invitation - TechSummit 2025

Dear ${speaker.name},

I'm reaching out to invite you to speak at TechSummit 2025, a premier AI/ML conference expecting 5,000+ attendees.

Given your expertise in ${speaker.topics[0].toLowerCase()} and ${speaker.why.toLowerCase()}, we believe you would be an exceptional ${speaker.slot.toLowerCase()} speaker.

We would be honored to have you join us.

Best regards,
[Your Name]
TechSummit 2025 Team`)}>
                      Copy
                    </Button>
                  </div>
                  <div className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                    <p className="mb-2"><strong className="text-foreground">Subject:</strong> Speaking Invitation - TechSummit 2025</p>
                    <p>Dear {speaker.name},</p>
                    <p className="mt-2">I&apos;m reaching out to invite you to speak at TechSummit 2025, a premier AI/ML conference expecting 5,000+ attendees.</p>
                    <p className="mt-2">Given your expertise in {speaker.topics[0].toLowerCase()} and {speaker.why.toLowerCase()}, we believe you would be an exceptional {speaker.slot.toLowerCase()} speaker.</p>
                    <p className="mt-2">We would be honored to have you join us.</p>
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
