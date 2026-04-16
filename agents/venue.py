import json
from langchain_core.messages import SystemMessage, HumanMessage
from llm import llm_small as llm
from state import ConferenceState
from tools.rag import query


def venue_node(state: ConferenceState) -> dict:
    spec = state["event_spec"]
    plan = json.loads(state["plan"])
    instructions = plan["agent_instructions"]["venue"]

    print(f"\n[Venue Agent] Finding venues...")

    context = query(f"venue conference hall {spec['geography']} capacity {spec['audience_size']}")

    system_prompt = """You are a venue selection agent.
Based on context and your knowledge, recommend suitable venues.

Return ONLY a valid JSON array, nothing else:
[
  {
    "name": "Venue name",
    "city": "City name",
    "capacity": 2000,
    "type": "Convention Center / Hotel Ballroom / Tech Campus / Exhibition Hall",
    "pros": ["pro 1", "pro 2"],
    "cons": ["con 1"],
    "estimated_daily_cost_usd": 5000,
    "fit_score": 8
  }
]"""

    human_message = f"""Event: {spec['category']} in {spec['geography']} for {spec['audience_size']} people
Instructions: {instructions}

Relevant context:
{context}

Recommend 5 venues ranked by fit score."""

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
        venues = json.loads(raw.strip())
        if not isinstance(venues, list):
            venues = venues.get("venues", [])
    except json.JSONDecodeError:
        venues = [{"raw": response.content}]

    print(f"[Venue Agent] Found {len(venues)} venues")
    return {"venues": venues}