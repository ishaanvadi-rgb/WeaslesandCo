"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getResults } from "@/lib/store"

export default function GTMPage() {
  const [gtm, setGtm] = useState<any>(null)

  useEffect(() => {
    const results = getResults()
    if (results?.gtm_plan) setGtm(results.gtm_plan)
  }, [])

  if (!gtm) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No GTM data yet. <a href="/setup" className="text-primary underline">Run the pipeline first.</a>
      </div>
    )
  }

  const channels = gtm.channels ?? []
  const timeline = gtm.timeline ?? []
  const segments = gtm.target_segments ?? []
  const messages = gtm.key_messages ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">GTM Plan</h1>
        <p className="text-muted-foreground">Multi-channel go-to-market strategy optimized for your target audience.</p>
      </div>

      {/* Target Segments */}
      {segments.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif">Target Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {segments.map((seg: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">{seg}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Channel Budget Allocation */}
      {channels.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif">Channel Budget Allocation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {channels.map((channel: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-foreground">{channel.name}</span>
                    <p className="text-sm text-muted-foreground">{channel.strategy}</p>
                  </div>
                  <span className="font-semibold text-primary">{channel.budget_percent}%</span>
                </div>
                <Progress value={channel.budget_percent} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Marketing Timeline */}
      {timeline.length > 0 && (
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Marketing Timeline</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
            <div className="space-y-6">
              {timeline.map((item: any, index: number) => (
                <div key={index} className="relative flex gap-6">
                  <div className="hidden md:flex shrink-0 w-8 h-8 rounded-full bg-primary items-center justify-center text-primary-foreground font-semibold text-sm z-10">
                    {index + 1}
                  </div>
                  <Card className="flex-1 bg-card border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <p className="text-foreground">{item.action}</p>
                        <span className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                          {item.weeks_before} weeks before
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Key Messages */}
      {messages.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif">Key Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {messages.map((msg: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <p className="text-muted-foreground">{msg}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
