import json
from langchain_core.messages import SystemMessage, HumanMessage
from llm import llm
from state import ConferenceState


def ops_node(state: ConferenceState) -> dict:
    spec = state["event_spec"]

    # Read all other agents' outputs
    sponsors = state.get("sponsors", [])
    speakers = state.get("speakers", [])
    venues = state.get("venues", [])
    pricing = state.get("pricing", {})

    print(f"\n[Ops Agent] Building operational timeline...")

    sponsor_count = len([s for s in sponsors if isinstance(s, dict) and "name" in s])
    speaker_count = len([s for s in speakers if isinstance(s, dict) and "name" in s])
    top_venue = venues[0].get("name", "TBD") if venues else "TBD"
    ticket_tiers = len(pricing.get("ticket_tiers", []))

    system_prompt = """You are an event operations agent.
Given a summary of what's been planned, build an operational timeline.

Return ONLY a valid JSON array, nothing else:
[
  {
    "phase": "Phase name",
    "weeks_before_event": 16,
    "tasks": [
      {"task": "Task description", "owner": "Organizer/Sponsor team/Speaker team", "priority": "High/Medium/Low"}
    ]
  }
]

Cover 6 phases: Planning, Venue & Logistics, Speaker Management, Sponsor Management, Marketing, Week-of."""

    human_message = f"""Event summary:
- Type: {spec['category']} in {spec['geography']} for {spec['audience_size']} people
- Sponsors identified: {sponsor_count}
- Speakers confirmed: {speaker_count}
- Top venue: {top_venue}
- Ticket tiers: {ticket_tiers}

Build the full operational timeline."""

    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=human_message),
    ])

    try:
        raw = response.content.strip()
        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        ops_timeline = json.loads(raw.strip())
    except json.JSONDecodeError:
        ops_timeline = [{"raw": response.content}]

    print(f"[Ops Agent] Timeline built with {len(ops_timeline)} phases")
    return {"ops_timeline": ops_timeline}