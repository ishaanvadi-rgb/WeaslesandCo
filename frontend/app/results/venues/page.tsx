"use client"

import { useEffect, useState } from "react"
import { MapPin, Users, DollarSign, ThumbsUp, ThumbsDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getResults } from "@/lib/store"

export default function VenuesPage() {
  const [venues, setVenues] = useState<any[]>([])

  useEffect(() => {
    const results = getResults()
    if (results?.venues) setVenues(results.venues.filter((v: any) => v?.name))
  }, [])

  if (!venues.length) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No venue data yet. <a href="/setup" className="text-primary underline">Run the pipeline first.</a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Venues</h1>
        <p className="text-muted-foreground">{venues.length} venues evaluated based on capacity, cost, and fit for your event.</p>
      </div>

      <div className="grid gap-4">
        {venues.map((venue, index) => (
          <Card
            key={index}
            className={`bg-card border-border hover:shadow-md transition-shadow ${index === 0 ? "ring-2 ring-primary" : ""}`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-xl font-semibold text-foreground">{venue.name}</h3>
                        {index === 0 && (
                          <Badge className="bg-primary text-primary-foreground">Top Pick</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>{venue.city}</span>
                        {venue.type && <span className="ml-2 text-sm">· {venue.type}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p className="font-semibold text-foreground">{(venue.capacity ?? 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Daily Cost</p>
                        <p className="font-semibold text-foreground">${(venue.estimated_daily_cost_usd ?? 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-sm text-muted-foreground mb-1">Fit Score</p>
                      <div className="flex items-center gap-2">
                        <Progress value={(venue.fit_score ?? 0) * 10} className="h-2 flex-1" />
                        <span className="font-semibold text-primary">{venue.fit_score}/10</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ThumbsUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-foreground">Pros</span>
                      </div>
                      <ul className="space-y-1">
                        {(venue.pros ?? []).map((pro: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ThumbsDown className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-foreground">Cons</span>
                      </div>
                      <ul className="space-y-1">
                        {(venue.cons ?? []).map((con: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
