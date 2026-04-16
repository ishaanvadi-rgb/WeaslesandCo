# ConferenceAI — Engineering Document

## System Overview

ConferenceAI is an autonomous conference planning system powered by a multi-agent AI pipeline. Given three inputs — event category, geography, and target audience size — the system autonomously researches, plans, and produces a complete conference blueprint covering sponsors, speakers, venues, ticket pricing, go-to-market strategy, and operational timeline.

---

## Architecture

### High-Level Design

```
User Input (React Frontend)
        ↓
FastAPI Backend (REST API)
        ↓
LangGraph State Machine
        ↓
┌─────────────────────────────────────┐
│  Researcher Agent (RAG + Web)       │
│  Orchestrator Agent (Planning)      │
│  Sponsor Agent   ─┐                 │
│  Speaker Agent   ─┼─ Parallel       │
│  Venue Agent     ─┘                 │
│  Pricing Agent (Sequential)         │
│  GTM Agent      (Sequential)        │
│  Ops Agent      (Sequential)        │
│  Critic Agent   (Quality Control)   │
└─────────────────────────────────────┘
        ↓
Structured JSON Output
        ↓
React Results Dashboard
```

### Technology Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | Next.js 16 + Tailwind CSS | Production-grade React with routing |
| Backend API | FastAPI + Uvicorn | Async Python, fast, clean REST |
| Agent Framework | LangGraph | State machine for multi-agent orchestration |
| LLM | Groq (llama-3.3-70b-versatile) | Fast inference, generous free tier |
| Embeddings | HuggingFace Inference API | Remote embeddings, no local model needed |
| Web Search | DuckDuckGo (ddgs) | Free, no API key, sufficient quality |
| Web Scraping | BeautifulSoup4 + requests | Lightweight HTML parsing |
| Vector Store | In-memory numpy (cosine similarity) | No external DB needed, fast |
| Deployment (Frontend) | Vercel | Zero-config Next.js deployment |
| Deployment (Backend) | Render | Free Python hosting, no image size limit |
| Dependency Management | Poetry | Reproducible builds, clean lockfile |

---

## Agent Design

### 1. Researcher Agent
**Runs first.** Builds a RAG knowledge base from real past conference data.

- Searches DuckDuckGo for past similar events
- Scrapes top 2 event websites using BeautifulSoup
- Chunks scraped content into 300-character overlapping segments
- Embeds chunks via HuggingFace Inference API (all-MiniLM-L6-v2)
- Stores embeddings in an in-memory numpy vector store

**Why RAG here?** Instead of sending 2000+ tokens of raw scraped text to the LLM, agents query the vector store with a specific question and retrieve only the 3-4 most relevant chunks (~400 tokens). This reduces token usage by ~80% while improving relevance.

### 2. Orchestrator Agent
**Runs second.** Creates a tailored plan for all downstream agents.

- Reads event spec + past event intelligence from shared state
- Generates specific instructions per agent (e.g. "focus on deep tech VCs and cloud companies in Bangalore")
- Uses `llama-3.3-70b-versatile` — highest reasoning quality needed here

### 3. Sponsor, Speaker, Venue Agents
**Run in parallel.** Each queries the RAG store for relevant context, then uses the LLM to extract and structure recommendations.

- Sponsor: ranks by tier (Title/Gold/Silver/Community) + relevance score
- Speaker: maps each speaker to a specific agenda slot
- Venue: scores by capacity fit, location, AV infrastructure, cost

### 4. Pricing Agent
**Runs after venue.** Reads venue cost from shared state to ground revenue projections.

- Uses `llama-3.1-8b-instant` (smaller model — structured extraction task)
- Produces tiered pricing + attendance forecast + revenue projection

### 5. GTM Agent
**Runs after pricing.** Produces channel strategy, marketing timeline, outreach templates.

### 6. Ops Agent
**Runs last among specialists.** Reads ALL agent outputs and synthesizes into a phased operational timeline. Pure LLM reasoning — no search needed.

### 7. Critic Agent
**Quality control loop.** Scores every agent's output 0-10 on relevance, specificity, and completeness. Any agent scoring below 6 is re-run with enriched context. Maximum 1 retry to prevent infinite loops.

---

## RAG System Design

```
Researcher scrapes websites
        ↓
Text chunked (300 chars, 50 char overlap)
        ↓
HuggingFace API embeds chunks → 384-dim vectors
        ↓
Stored in memory: List[str] + List[List[float]]
        ↓
Agent queries: "sponsors AI conference India"
        ↓
Cosine similarity against all chunks
        ↓
Top 4 chunks returned as context string
        ↓
Injected into agent's LLM prompt
```

**Why in-memory instead of ChromaDB?**
ChromaDB pulled in PyTorch via its Rust bindings, creating a 5.9GB Docker image that exceeded Railway's 4GB limit. A pure numpy cosine similarity implementation achieves identical retrieval quality with zero extra dependencies.

---

## State Management

All agents share a single `ConferenceState` TypedDict that flows through the LangGraph pipeline. Each agent reads the full state and returns only the fields it updates — LangGraph merges these updates automatically.

```python
class ConferenceState(TypedDict):
    event_spec: EventSpec          # Input
    plan: Optional[str]            # Orchestrator output
    past_event_intel: Optional[dict] # Researcher output
    sponsors: Optional[List[dict]] # Sponsor agent output
    speakers: Optional[List[dict]] # Speaker agent output
    venues: Optional[List[dict]]   # Venue agent output
    pricing: Optional[dict]        # Pricing agent output
    gtm_plan: Optional[dict]       # GTM agent output
    ops_timeline: Optional[List[dict]] # Ops agent output
    critic_scores: Optional[dict]  # Critic output
    needs_retry: Optional[List[str]] # Self-correction loop
    retry_count: Optional[int]     # Loop guard
```

---

## Self-Correction Loop

```
All agents complete
        ↓
Critic scores each agent 0-10
        ↓
Any score < 6?
    YES → Re-run flagged agents (retry_count < 1)
    NO  → Proceed to output
        ↓
Critic scores again
        ↓
Format final report
```

This is the key differentiator from a simple pipeline — the system evaluates and improves its own work before returning output.

---

## API Design

### POST /plan
```json
Request:
{
  "category": "AI & Machine Learning",
  "geography": "India",
  "audience_size": 1000
}

Response:
{
  "sponsors": [...],
  "speakers": [...],
  "venues": [...],
  "pricing": {...},
  "gtm_plan": {...},
  "ops_timeline": [...],
  "critic_scores": {...},
  "past_event_intel": {...}
}
```

### Cache Fallback
Every successful run is cached to `last_successful_run.json`. If the LLM provider rate-limits during a request, the API automatically serves the cached result — ensuring demo reliability.

---

## Token Optimization Strategy

Running 9 LLM calls per pipeline on a free tier (100k tokens/day) required careful optimization:

| Optimization | Impact |
|---|---|
| RAG retrieval (4 chunks vs full text) | -80% researcher tokens |
| `llama-3.1-8b-instant` for utility agents | -60% per call vs 70B |
| No search in Ops agent (pure reasoning) | -200 tokens |
| Structured JSON prompts (no padding) | -15% per agent |
| HuggingFace API for embeddings | Removes sentence-transformers from image |

---

## Deployment Architecture

```
GitHub (master branch)
    ├── Vercel (auto-deploy on push)
    │   └── Next.js frontend
    │       └── https://weaslesand-co-v1ya.vercel.app
    │
    └── Render (auto-deploy on push)
        └── FastAPI + LangGraph backend
            └── https://weaslesandco.onrender.com
```

Environment variables managed separately on each platform. `.env` excluded from git via `.gitignore`.

---

## Data Sources

| Source | Used For | Access Method |
|---|---|---|
| DuckDuckGo Search | Past event discovery | `ddgs` Python library (free) |
| Conference websites | Sponsor/speaker grounding | BeautifulSoup scraping |
| HuggingFace Inference API | Text embeddings | REST API (free tier) |
| Groq LLM API | All reasoning tasks | REST API (free tier) |
| LLM training knowledge | Gap-filling when RAG returns nothing | Built into model |

Specific sites scraped include conference directories (indiaaisummit.in, ai4india.org, 10times.com) and event listing aggregators. All scraping is limited to publicly accessible pages with no authentication required.

---

## Known Limitations

- **Render free tier cold starts**: The backend spins down after 15 minutes of inactivity. First request after inactivity takes ~50 seconds to wake up.
- **Groq rate limits**: 100k tokens/day on free tier. Cache fallback mitigates this for demos.
- **RAG quality**: Search results are not always perfectly relevant to the event type. A production system would use curated conference databases.
- **No real-time data**: Speaker influence scores and sponsor budgets are estimated by the LLM, not pulled from live APIs.

---

## Running Locally

```bash
# Clone
git clone https://github.com/ishaanvadi-rgb/WeaslesandCo.git
cd WeaslesandCo

# Backend
poetry install
cp .env.example .env  # Add GROQ_API_KEY and HF_TOKEN
poetry run uvicorn api:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```
