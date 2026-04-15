import json
from langchain_core.messages import SystemMessage, HumanMessage
from llm import llm
from state import ConferenceState


def critic_node(state: ConferenceState) -> dict:
    spec = state["event_spec"]

    print(f"\n[Critic] Evaluating all agent outputs...")

    summary = f"""
Event: {spec['category']} in {spec['geography']} for {spec['audience_size']} people

SPONSORS: {json.dumps(state.get('sponsors', [])[:3], indent=2)}
SPEAKERS: {json.dumps(state.get('speakers', [])[:3], indent=2)}
VENUES: {json.dumps(state.get('venues', [])[:3], indent=2)}
PRICING: {json.dumps(state.get('pricing', {}), indent=2)[:500]}
GTM: {json.dumps(state.get('gtm_plan', {}), indent=2)[:500]}
"""

    system_prompt = """You are a quality critic for a conference planning system.
Score each agent's output from 0-10 based on:
- Relevance to the specific event and geography
- Specificity (not vague or generic)
- Completeness (enough detail to be useful)

Return ONLY valid JSON, nothing else:
{
  "scores": {
    "sponsor": 8,
    "speaker": 7,
    "venue": 6,
    "pricing": 9,
    "gtm": 8
  },
  "feedback": {
    "sponsor": "one sentence",
    "speaker": "one sentence",
    "venue": "one sentence",
    "pricing": "one sentence",
    "gtm": "one sentence"
  },
  "needs_retry": []
}

Put agent names in needs_retry only if their score is below 6."""

    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Evaluate these outputs:\n{summary}"),
    ])

    try:
        raw = response.content.strip()
        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        result = json.loads(raw.strip())
    except json.JSONDecodeError:
        result = {"scores": {}, "feedback": {}, "needs_retry": []}

    print(f"[Critic] Scores: {result.get('scores', {})}")
    print(f"[Critic] Needs retry: {result.get('needs_retry', [])}")

    return {
        "critic_scores": result,
        "needs_retry": result.get("needs_retry", []),
    }