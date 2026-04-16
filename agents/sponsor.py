import json
from langchain_core.messages import SystemMessage, HumanMessage
from llm import llm
from state import ConferenceState
from tools.rag import query


def sponsor_node(state: ConferenceState) -> dict:
    spec = state["event_spec"]
    plan = json.loads(state["plan"])
    instructions = plan["agent_instructions"]["sponsor"]

    print(f"\n[Sponsor Agent] Finding sponsors...")

    # Query RAG for relevant context — only gets 4 relevant chunks, not everything
    context = query(f"sponsors companies {spec['category']} conference {spec['geography']}")

    system_prompt = """You are a sponsorship discovery agent.
Based on context and your knowledge, identify and rank potential sponsors.

Return ONLY a valid JSON array, nothing else:
[
  {
    "name": "Company name",
    "tier": "Title/Gold/Silver/Community",
    "relevance_score": 8,
    "why": "One sentence on why they would sponsor",
    "approach": "How to reach out"
  }
]"""

    human_message = f"""Event: {spec['category']} in {spec['geography']} for {spec['audience_size']} people
Instructions: {instructions}

Relevant context from past events:
{context}

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