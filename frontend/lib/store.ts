let conferenceResults: any = null
let eventSpec: any = null

export function setResults(data: any) {
  conferenceResults = data
}

export function getResults() {
  return conferenceResults
}

export function setEventSpec(spec: any) {
  eventSpec = spec
}

export function getEventSpec() {
  return eventSpec
}
