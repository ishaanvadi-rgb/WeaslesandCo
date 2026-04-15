import json
from langchain_core.messages import SystemMessage, HumanMessage
from llm import llm
from state import ConferenceState
from tools.search import web_search, format_results


def sponsor_node(state: ConferenceState) -> dict:
    spec = state["event_spec"]
    plan = json.loads(state["plan"])
    instructions = plan["agent_instructions"]["sponsor"]

    print(f"\n[Sponsor Agent] Searching for sponsors...")

    query1 = f"{spec['category']} conference sponsors {spec['geography']} 2024 2025"
    query2 = f"top {spec['category']} companies {spec['geography']}"

    results1 = web_search(query1, max_results=4)
    results2 = web_search(query2, max_results=4)

    all_results = format_results(results1 + results2)

    system_prompt = """You are a sponsorship discovery agent.
Based on search results, identify and rank potential sponsors for the conference.

Return ONLY a valid JSON array, nothing else:
[
  {
    "name": "Company name",
    "tier": "Title/Gold/Silver/Community",
    "relevance_score": 8,
    "why": "One sentence on why they would sponsor",
    "approach": "How to reach out to them"
  }
]"""

    human_message = f"""Event: {spec['category']} in {spec['geography']} for {spec['audience_size']} people
Instructions: {instructions}

Search results:
{all_results}

Find the best 6 sponsor candidates."""

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
        sponsors = json.loads(raw.strip())
    except json.JSONDecodeError:
        sponsors = [{"raw": response.content}]

    print(f"[Sponsor Agent] Found {len(sponsors)} candidates")
    return {"sponsors": sponsors}