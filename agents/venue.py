import json
from langchain_core.messages import SystemMessage, HumanMessage
from llm import llm
from state import ConferenceState
from tools.search import web_search, format_results


def venue_node(state: ConferenceState) -> dict:
    spec = state["event_spec"]
    plan = json.loads(state["plan"])
    instructions = plan["agent_instructions"]["venue"]

    print(f"\n[Venue Agent] Searching for venues...")

    query1 = f"conference venue {spec['geography']} capacity {spec['audience_size']} people"
    query2 = f"best {spec['category']} event venue {spec['geography']}"

    results1 = web_search(query1, max_results=4)
    results2 = web_search(query2, max_results=3)

    all_results = format_results(results1 + results2)

    system_prompt = """You are a venue selection agent for conference planning.
Based on search results, recommend and score suitable venues.

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

Search results:
{all_results}

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
    except json.JSONDecodeError:
        venues = [{"raw": response.content}]

    print(f"[Venue Agent] Found {len(venues)} venues")
    return {"venues": venues}