from typing import TypedDict, List, Optional


class EventSpec(TypedDict):
    category: str      # e.g. "AI", "Web3", "Music Festival"
    geography: str     # e.g. "India", "USA", "Singapore"
    audience_size: int # e.g. 1000


class ConferenceState(TypedDict):
    # Input
    event_spec: EventSpec

    # Orchestrator
    plan: Optional[str]

    # Agent outputs
    sponsors: Optional[List[dict]]
    speakers: Optional[List[dict]]
    venues: Optional[List[dict]]
    pricing: Optional[dict]
    gtm_plan: Optional[dict]
    ops_timeline: Optional[List[dict]]

    # Quality control
    critic_scores: Optional[dict]
    needs_retry: Optional[List[str]]
    retry_count: Optional[int]

    # Final
    final_report: Optional[str]
    errors: Optional[List[str]]