from langgraph.graph import StateGraph, END
from state import ConferenceState
from agents import (
    orchestrator_node,
    sponsor_node,
    speaker_node,
    venue_node,
    pricing_node,
    gtm_node,
    ops_node,
    critic_node,
)


def should_retry(state: ConferenceState) -> str:
    """
    Called after the critic runs.
    Returns the name of the next node to go to.
    """
    needs_retry = state.get("needs_retry", [])
    retry_count = state.get("retry_count", 0)

    if needs_retry and retry_count < 1:
        return "retry"
    else:
        return "done"


def retry_node(state: ConferenceState) -> dict:
    """
    Re-runs only the agents the critic flagged.
    Increments retry_count so we don't loop forever.
    """
    needs_retry = state.get("needs_retry", [])
    retry_count = state.get("retry_count", 0)
    updates = {"retry_count": retry_count + 1, "needs_retry": []}

    if "sponsor" in needs_retry:
        updates.update(sponsor_node(state))
    if "speaker" in needs_retry:
        updates.update(speaker_node(state))
    if "venue" in needs_retry:
        updates.update(venue_node(state))
    if "pricing" in needs_retry:
        updates.update(pricing_node(state))
    if "gtm" in needs_retry:
        updates.update(gtm_node(state))

    return updates


def build_graph():
    workflow = StateGraph(ConferenceState)

    # Add all nodes
    workflow.add_node("orchestrator", orchestrator_node)
    workflow.add_node("sponsor", sponsor_node)
    workflow.add_node("speaker", speaker_node)
    workflow.add_node("venue", venue_node)
    workflow.add_node("pricing", pricing_node)
    workflow.add_node("gtm", gtm_node)
    workflow.add_node("ops", ops_node)
    workflow.add_node("critic", critic_node)
    workflow.add_node("retry", retry_node)

    # Entry point
    workflow.set_entry_point("orchestrator")

    # Orchestrator → parallel research agents
    workflow.add_edge("orchestrator", "sponsor")
    workflow.add_edge("orchestrator", "speaker")
    workflow.add_edge("orchestrator", "venue")

    # Research agents → pricing (needs venue data)
    workflow.add_edge("sponsor", "pricing")
    workflow.add_edge("speaker", "pricing")
    workflow.add_edge("venue", "pricing")

    # Sequential chain
    workflow.add_edge("pricing", "gtm")
    workflow.add_edge("gtm", "ops")
    workflow.add_edge("ops", "critic")

    # Conditional edge from critic
    workflow.add_conditional_edges(
        "critic",
        should_retry,
        {
            "retry": "retry",
            "done": END,
        }
    )

    # After retry go back to critic
    workflow.add_edge("retry", "critic")

    return workflow.compile()


graph = build_graph()