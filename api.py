from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from graph import graph

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class EventRequest(BaseModel):
    category: str
    geography: str
    audience_size: int

@app.post("/plan")
def plan_conference(req: EventRequest):
    initial_state = {
        "event_spec": {
            "category": req.category,
            "geography": req.geography,
            "audience_size": req.audience_size,
        },
        "plan": None,
        "past_event_intel": None,
        "sponsors": None,
        "speakers": None,
        "venues": None,
        "pricing": None,
        "gtm_plan": None,
        "ops_timeline": None,
        "critic_scores": None,
        "needs_retry": [],
        "retry_count": 0,
        "final_report": None,
        "errors": [],
    }
    result = graph.invoke(initial_state)
    return {
        "sponsors": result.get("sponsors"),
        "speakers": result.get("speakers"),
        "venues": result.get("venues"),
        "pricing": result.get("pricing"),
        "gtm_plan": result.get("gtm_plan"),
        "ops_timeline": result.get("ops_timeline"),
        "critic_scores": result.get("critic_scores"),
        "past_event_intel": result.get("past_event_intel"),
    }

@app.get("/health")
def health():
    return {"status": "ok"}