"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getResults } from "@/lib/store"

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "bg-red-100 text-red-700 border-red-200"
    case "Medium": return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "Low": return "bg-green-100 text-green-700 border-green-200"
    default: return "bg-secondary text-secondary-foreground"
  }
}

export default function OpsPage() {
  const [phases, setPhases] = useState<any[]>([])

  useEffect(() => {
    const results = getResults()
    if (results?.ops_timeline) setPhases(results.ops_timeline.filter((p: any) => p?.phase))
  }, [])

  if (!phases.length) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No ops data yet. <a href="/setup" className="text-primary underline">Run the pipeline first.</a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Ops Timeline</h1>
        <p className="text-muted-foreground">Phase-by-phase operational plan with tasks, priorities, and owners.</p>
      </div>

      <Accordion type="multiple" defaultValue={[phases[0]?.phase, phases[1]?.phase].filter(Boolean)} className="space-y-4">
        {phases.map((phase, index) => (
          <AccordionItem key={index} value={phase.phase} className="border-0">
            <Card className="bg-card border-border">
              <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]>div>svg]:rotate-180">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <h3 className="font-serif text-lg font-semibold text-foreground text-left">{phase.phase}</h3>
                    <Badge variant="outline" className="text-muted-foreground">
                      {(phase.tasks ?? []).length} tasks
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-primary font-medium hidden sm:inline">
                      {phase.weeks_before_event} weeks out
                    </span>
                    <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0 pb-6">
                  <div className="border-t border-border pt-4">
                    <div className="space-y-3">
                      {(phase.tasks ?? []).map((task: any, i: number) => (
                        <div
                          key={i}
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
