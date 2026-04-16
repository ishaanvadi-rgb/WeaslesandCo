"use client"

import { useEffect, useState } from "react"
import { Mail, Star, Twitter, Linkedin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getResults } from "@/lib/store"

const slotColor = (slot: string) => {
  const s = slot?.toLowerCase() ?? ""
  if (s.includes("keynote")) return "bg-primary text-primary-foreground"
  if (s.includes("panel")) return "bg-blue-600 text-white"
  if (s.includes("workshop")) return "bg-green-600 text-white"
  return "bg-purple-600 text-white"
}

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<any[]>([])
  const [emailDraft, setEmailDraft] = useState<number | null>(null)

  useEffect(() => {
    const results = getResults()
    if (results?.speakers) setSpeakers(results.speakers.filter((s: any) => s?.name))
  }, [])

  if (!speakers.length) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No speaker data yet. <a href="/setup" className="text-primary underline">Run the pipeline first.</a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Speakers</h1>
        <p className="text-muted-foreground">{speakers.length} speakers identified and mapped to agenda slots.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {speakers.map((speaker, index) => (
          <Card key={index} className="bg-card border-border hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">{speaker.name}</h3>
                    <p className="text-sm text-muted-foreground">{speaker.title}</p>
                  </div>
                  <Badge className={slotColor(speaker.suggested_slot)}>{speaker.suggested_slot}</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-foreground">{speaker.influence_score}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">influence score</span>
                </div>

                <p className="text-sm text-muted-foreground">{speaker.why}</p>

                {speaker.expertise && (
                  <div className="flex flex-wrap gap-2">
                    {speaker.expertise.split(/[,·]/).map((topic: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">{topic.trim()}</Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setEmailDraft(emailDraft === index ? null : index)}
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

              {emailDraft === index && (
                <div className="mt-4 p-4 bg-secondary/50 rounded-lg border border-border animate-in fade-in duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Invitation Draft</span>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(
                      `Subject: Speaking Invitation\n\nDear ${speaker.name},\n\nWe'd love to invite you to speak at our upcoming conference as a ${speaker.suggested_slot?.toLowerCase()} speaker.\n\nGiven your expertise in ${speaker.expertise} — ${speaker.why?.toLowerCase()} — we believe you'd be an exceptional addition to our lineup.\n\nBest regards,\n[Your Name]`
                    )}>Copy</Button>
                  </div>
                  <div className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                    <p className="mb-2"><strong className="text-foreground">Subject:</strong> Speaking Invitation</p>
                    <p>Dear {speaker.name},</p>
                    <p className="mt-2">We&apos;d love to invite you to speak at our upcoming conference as a {speaker.suggested_slot?.toLowerCase()} speaker.</p>
                    <p className="mt-2">Given your expertise in {speaker.expertise} — {speaker.why?.toLowerCase()} — we believe you&apos;d be an exceptional addition to our lineup.</p>
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
