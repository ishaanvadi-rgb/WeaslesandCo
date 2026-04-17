const API_BASE = "https://weaslesandco-production.up.railway.app"

export interface EventSpec {
  category: string
  geography: string
  audience_size: number
}

export async function planConference(spec: EventSpec) {
  const response = await fetch(`${API_BASE}/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spec),
  })
  if (!response.ok) throw new Error("Pipeline failed")
  return response.json()
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`)
  return response.json()
}
