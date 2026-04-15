import json
from langchain_core.messages import SystemMessage, HumanMessage
from llm import llm
from state import ConferenceState


def orchestrator_node(state: ConferenceState) -> dict:
    spec = state["event_spec"]

    print(f"\n[Orchestrator] Planning: {spec['category']} in {spec['geography']} for {spec['audience_size']} people")

    system_prompt = """You are the orchestrator of a conference planning system.
Given an event spec, produce a focused plan for these specialist agents:
- sponsor: who should sponsor this event
- speaker: what kind of speakers to look for
- venue: what kind of venue is needed
- pricing: what pricing strategy makes sense
- gtm: how to market this event

Return ONLY valid JSON in this exact format, nothing else:
{
  "analysis": "brief analysis of this event type",
  "agent_instructions": {
    "sponsor": "specific guidance",
    "speaker": "specific guidance",
    "venue": "specific guidance",
    "pricing": "specific guidance",
    "gtm": "specific guidance"
  }
}"""

    human_message = f"""Plan this conference:
- Category: {spec['category']}
- Geography: {spec['geography']}
- Audience size: {spec['audience_size']}"""

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
        plan = json.loads(raw.strip())
        plan_str = json.dumps(plan, indent=2)
    except json.JSONDecodeError:
        plan_str = response.content

    print(f"[Orchestrator] Plan ready")

    return {
        "plan": plan_str,
        "retry_count": 0,
        "errors": [],
    }