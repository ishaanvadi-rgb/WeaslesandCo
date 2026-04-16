"use client"

import { ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const phases = [
  {
    id: "planning",
    name: "Planning Phase",
    timeline: "12-8 weeks before",
    tasks: [
      { task: "Finalize venue contract", priority: "High", owner: "Ops Lead" },
      { task: "Confirm speaker lineup", priority: "High", owner: "Content Lead" },
      { task: "Lock in sponsor agreements", priority: "High", owner: "Partnerships" },
      { task: "Design event branding", priority: "Medium", owner: "Design Team" },
      { task: "Set up registration platform", priority: "High", owner: "Tech Lead" },
    ],
  },
  {
    id: "production",
    name: "Production Phase",
    timeline: "8-4 weeks before",
    tasks: [
      { task: "Order swag and materials", priority: "Medium", owner: "Ops Lead" },
      { task: "Finalize catering menu", priority: "Medium", owner: "Ops Lead" },
      { task: "Coordinate AV requirements", priority: "High", owner: "Tech Lead" },
      { task: "Create run-of-show document", priority: "High", owner: "Event Manager" },
      { task: "Brief all volunteers", priority: "Medium", owner: "Volunteer Coordinator" },
      { task: "Test registration systems", priority: "High", owner: "Tech Lead" },
    ],
  },
  {
    id: "execution",
    name: "Execution Phase",
    timeline: "4-1 weeks before",
    tasks: [
      { task: "Final venue walkthrough", priority: "High", owner: "Ops Lead" },
      { task: "Confirm all vendor arrivals", priority: "High", owner: "Ops Lead" },
      { task: "Send attendee reminders", priority: "Medium", owner: "Marketing" },
      { task: "Prepare speaker green room", priority: "Medium", owner: "Content Lead" },
      { task: "Set up networking app", priority: "High", owner: "Tech Lead" },
      { task: "Finalize security briefing", priority: "High", owner: "Security Lead" },
    ],
  },
  {
    id: "event-day",
    name: "Event Day",
    timeline: "Day of event",
    tasks: [
      { task: "Early arrival venue setup", priority: "High", owner: "Full Team" },
      { task: "Registration desk staffing", priority: "High", owner: "Volunteer Team" },
      { task: "Speaker check-ins", priority: "High", owner: "Content Lead" },
      { task: "Real-time issue management", priority: "High", owner: "Event Manager" },
      { task: "Social media coverage", priority: "Medium", owner: "Marketing" },
      { task: "VIP attendee management", priority: "High", owner: "VIP Coordinator" },
    ],
  },
  {
    id: "post-event",
    name: "Post-Event",
    timeline: "1-2 weeks after",
    tasks: [
      { task: "Send thank you emails", priority: "High", owner: "Marketing" },
      { task: "Collect feedback surveys", priority: "High", owner: "Ops Lead" },
      { task: "Process vendor payments", priority: "Medium", owner: "Finance" },
      { task: "Compile event report", priority: "Medium", owner: "Event Manager" },
      { task: "Share recordings with attendees", priority: "Medium", owner: "Tech Lead" },
    ],
  },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700 border-red-200"
    case "Medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "Low":
      return "bg-green-100 text-green-700 border-green-200"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

export default function OpsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Ops Timeline</h1>
        <p className="text-muted-foreground">Phase-by-phase operational plan with tasks, priorities, and owners.</p>
      </div>

      <Accordion type="multiple" defaultValue={["planning", "production"]} className="space-y-4">
        {phases.map((phase) => (
          <AccordionItem key={phase.id} value={phase.id} className="border-0">
            <Card className="bg-card border-border">
              <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]>div>svg]:rotate-180">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <h3 className="font-serif text-lg font-semibold text-foreground text-left">{phase.name}</h3>
                    <Badge variant="outline" className="text-muted-foreground">
                      {phase.tasks.length} tasks
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-primary font-medium hidden sm:inline">{phase.timeline}</span>
                    <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0 pb-6">
                  <div className="border-t border-border pt-4">
                    <div className="space-y-3">
                      {phase.tasks.map((task, index) => (
                        <div 
                          key={index} 
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                        >
                          <span className="text-foreground">{task.task}</span>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(task.priority)} variant="outline">
                              {task.priority}
                            </Badge>
                            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                              {task.owner}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
