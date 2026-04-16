import json
from langchain_core.messages import SystemMessage, HumanMessage
from llm import llm_small as llm
from state import ConferenceState
from tools.rag import query


def pricing_node(state: ConferenceState) -> dict:
    spec = state["event_spec"]
    plan = json.loads(state["plan"])
    instructions = plan["agent_instructions"]["pricing"]

    venues = state.get("venues", [])
    top_venue_cost = venues[0].get("estimated_daily_cost_usd", "unknown") if venues else "unknown"

    print(f"\n[Pricing Agent] Building pricing strategy...")

    context = query(f"ticket price registration fee {spec['category']} conference {spec['geography']}")

    system_prompt = """You are a ticket pricing and revenue strategy agent.

Return ONLY valid JSON, nothing else:
{
  "ticket_tiers": [
    {"name": "Early Bird", "price_usd": 50, "perks": "..."},
    {"name": "Standard", "price_usd": 100, "perks": "..."},
    {"name": "VIP", "price_usd": 300, "perks": "..."},
    {"name": "Virtual", "price_usd": 20, "perks": "..."}
  ],
  "attendance_forecast": {
    "optimistic": 1200,
    "realistic": 900,
    "conservative": 600
  },
  "revenue_projection_usd": {
    "from_tickets": 80000,
    "from_sponsorships": 50000,
    "total": 130000
  },
  "rationale": "2 sentence explanation"
}"""

    human_message = f"""Event: {spec['category']} in {spec['geography']} for {spec['audience_size']} people
Instructions: {instructions}
Top venue daily cost: ${top_venue_cost}

Relevant context from past events:
{context}

Create a ticket pricing strategy."""

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
        pricing = json.loads(raw.strip())
    except json.JSONDecodeError:
        pricing = {"raw": response.content}

    print(f"[Pricing Agent] Strategy ready")
    return {"pricing": pricing}