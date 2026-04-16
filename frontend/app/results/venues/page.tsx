"use client"

import { MapPin, Users, DollarSign, ThumbsUp, ThumbsDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const venues = [
  {
    id: 1,
    name: "The Grand Tech Center",
    city: "San Francisco, CA",
    capacity: 6000,
    dailyCost: 45000,
    fitScore: 94,
    pros: ["State-of-the-art AV", "Central location", "On-site catering", "Multiple breakout rooms"],
    cons: ["Limited parking", "Booking fills quickly"],
  },
  {
    id: 2,
    name: "Innovation Hub Convention Center",
    city: "San Jose, CA",
    capacity: 8000,
    dailyCost: 38000,
    fitScore: 88,
    pros: ["Huge capacity", "Affordable", "Great Wi-Fi infrastructure", "Near airport"],
    cons: ["Dated interior design", "Less prestigious address"],
  },
  {
    id: 3,
    name: "Bayside Conference Center",
    city: "Oakland, CA",
    capacity: 5500,
    dailyCost: 35000,
    fitScore: 82,
    pros: ["Waterfront views", "Good value", "Flexible layouts", "Easy public transit"],
    cons: ["Smaller main stage", "Limited VIP areas"],
  },
  {
    id: 4,
    name: "Tech Campus Pavilion",
    city: "Palo Alto, CA",
    capacity: 4000,
    dailyCost: 55000,
    fitScore: 79,
    pros: ["Silicon Valley prestige", "Modern design", "Great networking spaces"],
    cons: ["Higher cost", "Capacity constraints", "Limited availability"],
  },
  {
    id: 5,
    name: "Downtown Event Plaza",
    city: "San Francisco, CA",
    capacity: 7000,
    dailyCost: 42000,
    fitScore: 85,
    pros: ["Excellent location", "Hotel partnerships", "Proven tech event host"],
    cons: ["Complex setup logistics", "Union labor requirements"],
  },
]

export default function VenuesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Venues</h1>
        <p className="text-muted-foreground">5 venues evaluated based on capacity, cost, and fit for your event.</p>
      </div>

      <div className="grid gap-4">
        {venues.map((venue, index) => (
          <Card 
            key={venue.id} 
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
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p className="font-semibold text-foreground">{venue.capacity.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Daily Cost</p>
                        <p className="font-semibold text-foreground">${venue.dailyCost.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-sm text-muted-foreground mb-1">Fit Score</p>
                      <div className="flex items-center gap-2">
                        <Progress value={venue.fitScore} className="h-2 flex-1" />
                        <span className="font-semibold text-primary">{venue.fitScore}%</span>
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
                        {venue.pros.map((pro, i) => (
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
                        {venue.cons.map((con, i) => (
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
