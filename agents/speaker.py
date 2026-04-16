import json
from langchain_core.messages import SystemMessage, HumanMessage
from llm import llm
from state import ConferenceState
from tools.rag import query


def speaker_node(state: ConferenceState) -> dict:
    spec = state["event_spec"]
    plan = json.loads(state["plan"])
    instructions = plan["agent_instructions"]["speaker"]

    print(f"\n[Speaker Agent] Finding speakers...")

    context = query(f"speakers keynote experts {spec['category']} conference {spec['geography']}")

    system_prompt = """You are a speaker discovery agent.
Based on context and your knowledge, identify relevant speakers and map them to agenda slots.

Return ONLY a valid JSON array, nothing else:
[
  {
    "name": "Full name",
    "title": "Current role and company",
    "expertise": "Their specific area in 3 words",
    "suggested_slot": "Keynote / Panel: [topic] / Workshop: [topic] / Talk: [topic]",
    "influence_score": 8,
    "why": "One sentence on why they fit this event"
  }
]"""

    human_message = f"""Event: {spec['category']} in {spec['geography']} for {spec['audience_size']} people
Instructions: {instructions}

Relevant context from past events:
{context}

Find 6 speakers and assign each to a specific agenda slot."""

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
        speakers = json.loads(raw.strip())
    except json.JSONDecodeError:
        speakers = [{"raw": response.content}]

    print(f"[Speaker Agent] Found {len(speakers)} speakers")
    return {"speakers": speakers}