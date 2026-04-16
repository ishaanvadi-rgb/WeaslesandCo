"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { getResults } from "@/lib/store"

export default function PricingPage() {
  const [pricing, setPricing] = useState<any>(null)

  useEffect(() => {
    const results = getResults()
    if (results?.pricing) setPricing(results.pricing)
  }, [])

  if (!pricing) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No pricing data yet. <a href="/setup" className="text-primary underline">Run the pipeline first.</a>
      </div>
    )
  }

  const tiers = pricing.ticket_tiers ?? []
  const forecast = pricing.attendance_forecast ?? {}
  const revenue = pricing.revenue_projection_usd ?? {}

  const scenarios = [
    { name: "Conservative", attendance: forecast.conservative ?? 0, revenue: 0, color: "#8B7355" },
    { name: "Realistic", attendance: forecast.realistic ?? 0, revenue: revenue.from_tickets ?? 0, color: "#C4622D" },
    { name: "Optimistic", attendance: forecast.optimistic ?? 0, revenue: revenue.total ?? 0, color: "#2D8C4E" },
  ]

  const revenueBreakdown = [
    { name: "Sponsorships", value: revenue.from_sponsorships ?? 0 },
    { name: "Tickets", value: revenue.from_tickets ?? 0 },
  ]

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
          {tiers.map((tier: any, index: number) => (
            <Card
              key={index}
              className={`bg-card border-border hover:shadow-md transition-shadow ${index === 1 ? "ring-2 ring-primary" : ""}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif text-lg">{tier.name}</CardTitle>
                  {index === 1 && <Badge className="bg-primary text-primary-foreground">Popular</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-3xl font-bold text-foreground">${tier.price_usd}</span>
                  <span className="text-muted-foreground">/ticket</span>
                </div>
                <p className="text-sm text-muted-foreground">{tier.perks}</p>
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
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: scenario.color }} />
                    <div>
                      <p className="font-medium text-foreground">{scenario.name}</p>
                      <p className="text-sm text-muted-foreground">{scenario.attendance.toLocaleString()} attendees</p>
                    </div>
                  </div>
                  {scenario.revenue > 0 && (
                    <span className="font-semibold text-foreground">${(scenario.revenue / 1000).toFixed(0)}K</span>
                  )}
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
                    contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E8DDD0", borderRadius: "8px" }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {revenueBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#C4622D" : "#D4956A"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rationale */}
      {pricing.rationale && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif">Pricing Rationale</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{pricing.rationale}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
