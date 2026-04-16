"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const channels = [
  { name: "LinkedIn Ads", budget: 25, description: "Targeting AI/ML professionals and decision makers" },
  { name: "Twitter/X", budget: 20, description: "Thought leadership content and speaker announcements" },
  { name: "Email Marketing", budget: 15, description: "Nurture sequences to existing database" },
  { name: "Content Marketing", budget: 15, description: "Blog posts, guest articles, podcast appearances" },
  { name: "Partner Marketing", budget: 10, description: "Co-marketing with sponsors and speakers" },
  { name: "Community", budget: 8, description: "Discord, Slack communities, Reddit engagement" },
  { name: "PR & Media", budget: 5, description: "Press releases and tech publication outreach" },
  { name: "Retargeting", budget: 2, description: "Website visitor remarketing campaigns" },
]

const timeline = [
  {
    phase: "Phase 1: Awareness",
    weeks: "12-10 weeks out",
    activities: [
      "Launch event website and registration",
      "Announce keynote speakers",
      "Begin LinkedIn ad campaigns",
      "PR outreach to tech publications",
    ],
  },
  {
    phase: "Phase 2: Early Bird",
    weeks: "10-8 weeks out",
    activities: [
      "Launch early bird pricing",
      "Email blast to database",
      "Speaker social media takeovers",
      "Partner co-marketing campaigns",
    ],
  },
  {
    phase: "Phase 3: Momentum",
    weeks: "8-4 weeks out",
    activities: [
      "Content series: speaker interviews",
      "Community engagement ramp-up",
      "Retargeting campaigns launch",
      "Sponsor announcements for press",
    ],
  },
  {
    phase: "Phase 4: Final Push",
    weeks: "4-0 weeks out",
    activities: [
      "Last-chance pricing communications",
      "Full agenda reveal",
      "Attendee engagement content",
      "Pre-event networking app launch",
    ],
  },
]

export default function GTMPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">GTM Plan</h1>
        <p className="text-muted-foreground">Multi-channel go-to-market strategy optimized for your target audience.</p>
      </div>

      {/* Channel Budget Allocation */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-serif">Channel Budget Allocation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {channels.map((channel) => (
            <div key={channel.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-foreground">{channel.name}</span>
                  <p className="text-sm text-muted-foreground">{channel.description}</p>
                </div>
                <span className="font-semibold text-primary">{channel.budget}%</span>
              </div>
              <Progress value={channel.budget} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Marketing Timeline */}
      <div>
        <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Marketing Timeline</h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

          <div className="space-y-6">
            {timeline.map((phase, index) => (
              <div key={phase.phase} className="relative flex gap-6">
                {/* Timeline dot */}
                <div className="hidden md:flex shrink-0 w-8 h-8 rounded-full bg-primary items-center justify-center text-primary-foreground font-semibold text-sm z-10">
                  {index + 1}
                </div>

                <Card className="flex-1 bg-card border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                      <h3 className="font-serif text-lg font-semibold text-foreground">{phase.phase}</h3>
                      <span className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
                        {phase.weeks}
                      </span>
                    </div>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {phase.activities.map((activity) => (
                        <li key={activity} className="flex items-start gap-2 text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-serif">Target Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold text-foreground">500K</p>
              <p className="text-sm text-muted-foreground">Total impressions</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold text-foreground">25K</p>
              <p className="text-sm text-muted-foreground">Website visitors</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold text-foreground">18%</p>
              <p className="text-sm text-muted-foreground">Conversion rate</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold text-foreground">$65</p>
              <p className="text-sm text-muted-foreground">Cost per acquisition</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
