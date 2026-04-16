export function setResults(data: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem("conferenceResults", JSON.stringify(data))
  }
}

export function getResults() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("conferenceResults")
    return stored ? JSON.parse(stored) : null
  }
  return null
}

export function setEventSpec(spec: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem("eventSpec", JSON.stringify(spec))
  }
}

export function getEventSpec() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("eventSpec")
    return stored ? JSON.parse(stored) : null
  }
  return null
}
