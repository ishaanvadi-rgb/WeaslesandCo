"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Check, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { planConference } from "@/lib/api"
import { setResults, getEventSpec } from "@/lib/store"

type AgentState = "waiting" | "running" | "done"

const agents = [
  { id: "researcher", name: "Researcher", x: 50, y: 10 },
  { id: "orchestrator", name: "Orchestrator", x: 50, y: 25 },
  { id: "sponsor", name: "Sponsor", x: 20, y: 45 },
  { id: "speaker", name: "Speaker", x: 50, y: 45 },
  { id: "venue", name: "Venue", x: 80, y: 45 },
  { id: "pricing", name: "Pricing", x: 50, y: 62 },
  { id: "gtm", name: "GTM", x: 50, y: 76 },
  { id: "ops", name: "Ops", x: 50, y: 88 },
  { id: "critic", name: "Critic", x: 50, y: 100 },
]

const connections = [
  { from: "researcher", to: "orchestrator" },
  { from: "orchestrator", to: "sponsor" },
  { from: "orchestrator", to: "speaker" },
  { from: "orchestrator", to: "venue" },
  { from: "sponsor", to: "pricing" },
  { from: "speaker", to: "pricing" },
  { from: "venue", to: "pricing" },
  { from: "pricing", to: "gtm" },
  { from: "gtm", to: "ops" },
  { from: "ops", to: "critic" },
]

const initialAgentStates: Record<string, AgentState> = {
  researcher: "waiting",
  orchestrator: "waiting",
  sponsor: "waiting",
  speaker: "waiting",
  venue: "waiting",
  pricing: "waiting",
  gtm: "waiting",
  ops: "waiting",
  critic: "waiting",
}

export default function PipelinePage() {
  const router = useRouter()
  const [agentStates, setAgentStates] = useState<Record<string, AgentState>>(initialAgentStates)
  const [logs, setLogs] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const addLog = (msg: string) => setLogs(prev => [...prev, msg])

  const setAgentRunning = (id: string) => {
    setAgentStates(prev => ({ ...prev, [id]: "running" }))
    addLog(`[${id}] Starting...`)
  }

  const setAgentDone = (id: string) => {
    setAgentStates(prev => ({ ...prev, [id]: "done" }))
    addLog(`[${id}] Complete ✓`)
  }

  useEffect(() => {
    const run = async () => {
      const spec = getEventSpec()

      if (!spec) {
        router.push("/setup")
        return
      }

      try {
        // Animate agents while real backend runs
        const agentOrder = ["researcher", "orchestrator", "sponsor", "speaker", "venue", "pricing", "gtm", "ops", "critic"]
        let idx = 0

        const animInterval = setInterval(() => {
          if (idx > 0) setAgentDone(agentOrder[idx - 1])
          if (idx < agentOrder.length) {
            setAgentRunning(agentOrder[idx])
            setProgress(Math.round(((idx + 1) / agentOrder.length) * 90))
            idx++
          } else {
            clearInterval(animInterval)
          }
        }, 8000)

        addLog(`Starting pipeline: ${spec.category} · ${spec.geography} · ${spec.audience_size} attendees`)

        // Call real backend
        const results = await planConference(spec)

        // Stop animation, mark all done
        clearInterval(animInterval)
        agentOrder.forEach(id => setAgentDone(id))
        setProgress(100)
        addLog("All agents complete. Preparing results...")

        // Store results
        setResults(results)

        setTimeout(() => router.push("/results"), 1500)

      } catch (err: any) {
        setError(err.message)
        addLog(`Error: ${err.message}`)
      }
    }

    run()
  }, [router])

  const getAgentPosition = (id: string) => agents.find(a => a.id === id) ?? null
  const getAgentState = (id: string): AgentState => agentStates[id] ?? "waiting"

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold text-foreground">
            ConferenceAI
          </Link>
          <span className="text-muted-foreground">
            {progress < 100 ? "Agents Working..." : "Complete!"}
          </span>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-foreground font-medium">Pipeline Progress</span>
            <span className="text-primary font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error} — is the backend running on port 8000?
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Agent Pipeline</h2>
            <div className="relative h-[500px]">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {connections.map((conn, i) => {
                  const from = getAgentPosition(conn.from)
                  const to = getAgentPosition(conn.to)
                  if (!from || !to) return null
                  return (
                    <line
                      key={i}
                      x1={`${from.x}%`}
                      y1={`${from.y}%`}
                      x2={`${to.x}%`}
                      y2={`${to.y}%`}
                      stroke={getAgentState(conn.from) === "done" ? "#C4622D" : "#E8DDD0"}
                      strokeWidth="2"
                      className="transition-colors duration-500"
                    />
                  )
                })}
              </svg>

              {agents.map((agent) => {
                const state = getAgentState(agent.id)
                return (
                  <div
                    key={agent.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${agent.x}%`, top: `${agent.y}%` }}
                  >
                    <div className={`
                      w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-300
                      ${state === "waiting"
                        ? "bg-secondary border-border text-muted-foreground"
                        : state === "running"
                          ? "bg-primary/10 border-primary text-primary animate-pulse shadow-lg shadow-primary/20"
                          : "bg-green-100 border-green-500 text-green-600"
                      }
                    `}>
                      {state === "done" ? (
                        <Check className="h-8 w-8" />
                      ) : state === "running" ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-current" />
                      )}
                    </div>
                    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs font-medium text-foreground whitespace-nowrap">
                      {agent.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-[#1A1208] border border-border rounded-xl overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-white/10">
              <h2 className="font-mono text-sm text-white/80">Live Activity Log</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 max-h-[500px] font-mono text-sm space-y-2">
              {logs.length === 0 && (
                <div className="flex items-center gap-2 text-white/40">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Initializing...</span>
                </div>
              )}
              {logs.map((log, i) => (
                <div key={i} className="text-white/70">
                  <span className="text-primary">›</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
