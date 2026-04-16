import json
from langchain_core.messages import SystemMessage, HumanMessage
from llm import llm_small as llm
from state import ConferenceState
from tools.rag import query


def gtm_node(state: ConferenceState) -> dict:
    spec = state["event_spec"]
    plan = json.loads(state["plan"])
    instructions = plan["agent_instructions"]["gtm"]

    print(f"\n[GTM Agent] Building go-to-market plan...")

    context = query(f"marketing promotion channels {spec['category']} conference {spec['geography']}")

    system_prompt = """You are a go-to-market strategy agent for conference planning.

Return ONLY valid JSON, nothing else:
{
  "target_segments": ["segment 1", "segment 2"],
  "channels": [
    {"name": "LinkedIn", "strategy": "one sentence", "budget_percent": 30},
    {"name": "Twitter/X", "strategy": "one sentence", "budget_percent": 20}
  ],
  "timeline": [
    {"weeks_before": 16, "action": "Launch event website and early bird tickets"},
    {"weeks_before": 12, "action": "..."}
  ],
  "key_messages": ["message 1", "message 2"],
  "outreach_templates": {
    "sponsor_subject": "email subject line",
    "speaker_subject": "email subject line"
  }
}"""

    human_message = f"""Event: {spec['category']} in {spec['geography']} for {spec['audience_size']} people
Instructions: {instructions}

Relevant context from past events:
{context}

Create a GTM plan."""

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
        gtm_plan = json.loads(raw.strip())
    except json.JSONDecodeError:
        gtm_plan = {"raw": response.content}

    print(f"[GTM Agent] Plan ready")
    return {"gtm_plan": gtm_plan}