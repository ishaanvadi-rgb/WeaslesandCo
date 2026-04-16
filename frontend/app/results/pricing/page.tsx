"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const ticketTiers = [
  {
    name: "Early Bird",
    price: 299,
    description: "First 1,000 tickets",
    features: ["Full conference access", "Networking sessions", "Lunch included", "Conference swag"],
    projected: 1000,
  },
  {
    name: "Regular",
    price: 499,
    description: "Standard admission",
    features: ["Full conference access", "Networking sessions", "Lunch included", "Conference swag", "Workshop access"],
    projected: 3000,
  },
  {
    name: "VIP",
    price: 999,
    description: "Premium experience",
    features: ["Full conference access", "VIP networking lounge", "Speaker dinner invite", "Priority seating", "Exclusive swag", "1-on-1 mentor sessions"],
    projected: 500,
  },
  {
    name: "Corporate",
    price: 2499,
    description: "Team packages (5 tickets)",
    features: ["5 full conference passes", "Private meeting room", "Logo on website", "Recruiting booth", "Team networking event"],
    projected: 100,
  },
]

const scenarios = [
  { name: "Conservative", attendance: 3500, revenue: 245000, color: "#8B7355" },
  { name: "Expected", attendance: 4600, revenue: 320000, color: "#C4622D" },
  { name: "Optimistic", attendance: 5500, revenue: 420000, color: "#2D8C4E" },
]

const revenueBreakdown = [
  { name: "Sponsorships", value: 180000 },
  { name: "Early Bird", value: 45000 },
  { name: "Regular", value: 75000 },
  { name: "VIP", value: 20000 },
]

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Pricing Strategy</h1>
        <p className="text-muted-foreground">Optimized ticket tiers and revenue projections for your event.</p>
      </div>

      {/* Ticket Tiers */}
      <div>
        <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Ticket Tiers</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ticketTiers.map((tier, index) => (
            <Card 
              key={tier.name} 
              className={`bg-card border-border hover:shadow-md transition-shadow ${index === 1 ? "ring-2 ring-primary" : ""}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif text-lg">{tier.name}</CardTitle>
                  {index === 1 && <Badge className="bg-primary text-primary-foreground">Popular</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-3xl font-bold text-foreground">${tier.price}</span>
                  <span className="text-muted-foreground">/ticket</span>
                </div>
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Projected: <span className="font-semibold text-foreground">{tier.projected.toLocaleString()}</span> tickets
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Scenarios */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif">Attendance Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scenarios.map((scenario) => (
                <div key={scenario.name} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: scenario.color }}
                    />
                    <div>
                      <p className="font-medium text-foreground">{scenario.name}</p>
                      <p className="text-sm text-muted-foreground">{scenario.attendance.toLocaleString()} attendees</p>
                    </div>
                  </div>
                  <span className="font-semibold text-foreground">${(scenario.revenue / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif">Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
                  <XAxis type="number" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                    contentStyle={{ 
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E8DDD0",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#C4622D" : "#D4956A"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Recommendations */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-serif">Pricing Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <p className="text-muted-foreground">
                <span className="text-foreground font-medium">Launch early bird 60 days before event</span> — 
                Historical data shows 25% higher conversion when launched at least 8 weeks in advance.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <p className="text-muted-foreground">
                <span className="text-foreground font-medium">Create urgency with limited quantities</span> — 
                Cap early bird at 1,000 tickets to drive early commitment.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <p className="text-muted-foreground">
                <span className="text-foreground font-medium">Bundle corporate packages</span> — 
                Team discounts increase average order value by 40% in similar events.
              </p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
