import streamlit as st
import json
import time
import threading
import queue
from graph import graph
from agents.outreach import draft_sponsor_email, draft_speaker_email

# ── Page config ────────────────────────────────────────────────────────
st.set_page_config(
    page_title="ConferenceAI",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ── Custom CSS ─────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

/* Base */
html, body, [class*="css"] {
    font-family: 'DM Sans', sans-serif;
    background-color: #FAF7F2;
    color: #2C2416;
}

.stApp {
    background-color: #FAF7F2;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C4A882' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* Hide streamlit defaults */
#MainMenu, footer, header {visibility: hidden;}
.block-container {padding-top: 2rem; padding-bottom: 2rem; max-width: 1100px;}

/* Hero */
.hero {
    text-align: center;
    padding: 3rem 0 2rem;
    border-bottom: 1px solid #E8DDD0;
    margin-bottom: 2.5rem;
}
.hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 3.2rem;
    font-weight: 700;
    color: #1A1208;
    line-height: 1.1;
    margin-bottom: 0.5rem;
}
.hero-title span {
    color: #C4622D;
}
.hero-sub {
    font-size: 1rem;
    color: #7A6A55;
    font-weight: 300;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

/* Input card */
.input-card {
    background: #FFFFFF;
    border: 1px solid #E8DDD0;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 20px rgba(196, 98, 45, 0.06);
}

/* Section headers */
.section-header {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1A1208;
    margin: 2rem 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #C4622D;
    display: inline-block;
}

/* Agent log */
.log-box {
    background: #1A1208;
    border-radius: 12px;
    padding: 1.2rem 1.5rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    color: #C4A882;
    min-height: 120px;
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 1.5rem;
    line-height: 1.8;
}
.log-line-done { color: #7EC99A; }
.log-line-running { color: #F0C070; }
.log-line-info { color: #C4A882; }

/* Result cards */
.result-card {
    background: #FFFFFF;
    border: 1px solid #E8DDD0;
    border-radius: 12px;
    padding: 1.2rem 1.5rem;
    margin-bottom: 0.8rem;
    transition: box-shadow 0.2s;
}
.result-card:hover {
    box-shadow: 0 4px 20px rgba(196, 98, 45, 0.1);
}
.card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    font-weight: 600;
    color: #1A1208;
    margin-bottom: 0.3rem;
}
.card-meta {
    font-size: 0.82rem;
    color: #7A6A55;
    margin-bottom: 0.4rem;
}
.card-body {
    font-size: 0.88rem;
    color: #4A3F30;
    line-height: 1.6;
}
.tier-badge {
    display: inline-block;
    padding: 0.15rem 0.7rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    margin-right: 0.4rem;
}
.tier-title { background: #FFF0E8; color: #C4622D; border: 1px solid #F0C4A8; }
.tier-gold { background: #FFF8E8; color: #A07820; border: 1px solid #E8D4A0; }
.tier-silver { background: #F4F4F4; color: #606060; border: 1px solid #D8D8D8; }
.tier-community { background: #EFF8F0; color: #3A7A4A; border: 1px solid #A8D8B0; }
.score-pill {
    display: inline-block;
    padding: 0.1rem 0.6rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    background: #FFF0E8;
    color: #C4622D;
    border: 1px solid #F0C4A8;
}

/* Pricing table */
.pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.8rem;
    margin-bottom: 1rem;
}
.pricing-card {
    background: #FFFAF5;
    border: 1px solid #E8DDD0;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
}
.pricing-name {
    font-size: 0.8rem;
    font-weight: 500;
    color: #7A6A55;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.3rem;
}
.pricing-price {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: #C4622D;
}
.pricing-perks {
    font-size: 0.75rem;
    color: #7A6A55;
    margin-top: 0.3rem;
    line-height: 1.4;
}

/* Critic scores */
.score-bar-wrap {
    margin-bottom: 0.6rem;
}
.score-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: #4A3F30;
    margin-bottom: 0.2rem;
    display: flex;
    justify-content: space-between;
}
.score-bar-bg {
    background: #F0EAE0;
    border-radius: 8px;
    height: 8px;
    overflow: hidden;
}
.score-bar-fill {
    height: 100%;
    border-radius: 8px;
    background: linear-gradient(90deg, #C4622D, #E8943A);
    transition: width 0.8s ease;
}

/* Run button */
.stButton > button {
    background: #C4622D !important;
    color: white !important;
    border: none !important;
    border-radius: 10px !important;
    padding: 0.7rem 2.5rem !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 1rem !important;
    font-weight: 500 !important;
    letter-spacing: 0.02em !important;
    cursor: pointer !important;
    transition: background 0.2s !important;
    width: 100% !important;
}
.stButton > button:hover {
    background: #A8501F !important;
}

/* Selectbox and number input */
.stSelectbox > div > div,
.stNumberInput > div > div > input {
    border-color: #E8DDD0 !important;
    border-radius: 8px !important;
    background: #FFFFFF !important;
}

/* Forecast numbers */
.forecast-grid {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
}
.forecast-item {
    flex: 1;
    background: #FFFAF5;
    border: 1px solid #E8DDD0;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
}
.forecast-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #7A6A55;
    margin-bottom: 0.3rem;
}
.forecast-number {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #1A1208;
}
.forecast-number.optimistic { color: #3A7A4A; }
.forecast-number.conservative { color: #C4622D; }
</style>
""", unsafe_allow_html=True)


# ── Hero ───────────────────────────────────────────────────────────────
st.markdown("""
<div class="hero">
    <div class="hero-title">Conference<span>AI</span></div>
    <div class="hero-sub">Autonomous Event Planning · Powered by Multi-Agent AI</div>
</div>
""", unsafe_allow_html=True)


# ── Input form ─────────────────────────────────────────────────────────
st.markdown('<div class="input-card">', unsafe_allow_html=True)

col1, col2, col3 = st.columns(3)

with col1:
    category = st.selectbox(
        "Event Category",
        ["AI & Machine Learning", "Web3 & Blockchain", "ClimateTech",
         "Music Festival", "Sports", "HealthTech", "Fintech", "EdTech"],
        index=0,
    )

with col2:
    geography = st.selectbox(
        "Geography",
        ["India", "USA", "Europe", "Singapore", "UAE", "UK"],
        index=0,
    )

with col3:
    audience_size = st.number_input(
        "Audience Size",
        min_value=100,
        max_value=50000,
        value=1000,
        step=100,
    )

st.markdown("<br>", unsafe_allow_html=True)
run_button = st.button("Plan My Conference →")
st.markdown('</div>', unsafe_allow_html=True)


# ── Run pipeline ───────────────────────────────────────────────────────
if "final_state" not in st.session_state:
    st.session_state.final_state = None

if run_button:
    # Log placeholder
    st.markdown('<div class="section-header">Agent Activity</div>', unsafe_allow_html=True)
    log_placeholder = st.empty()
    logs = []

    def add_log(msg, style="info"):
        logs.append((msg, style))
        log_html = '<div class="log-box">'
        for text, s in logs[-8:]:
            css = f"log-line-{s}"
            log_html += f'<div class="{css}">› {text}</div>'
        log_html += '</div>'
        log_placeholder.markdown(log_html, unsafe_allow_html=True)

    add_log("Initialising agent pipeline...", "info")
    time.sleep(0.3)

    # Build initial state
    initial_state = {
        "event_spec": {
            "category": category,
            "geography": geography,
            "audience_size": int(audience_size),
        },
        "plan": None,
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

    # Stream agent updates using graph.stream()
    add_log(f"Starting: {category} · {geography} · {audience_size:,} attendees", "info")

    agent_labels = {
        "orchestrator": "Orchestrator planning the conference...",
        "sponsor": "Sponsor Agent searching for sponsors...",
        "speaker": "Speaker Agent discovering talent...",
        "venue": "Venue Agent shortlisting locations...",
        "pricing": "Pricing Agent forecasting revenue...",
        "gtm": "GTM Agent building marketing plan...",
        "ops": "Ops Agent creating timeline...",
        "critic": "Critic evaluating all outputs...",
        "retry": "Retrying flagged agents...",
    }

    final_state = None
    try:
        for chunk in graph.stream(initial_state):
            for node_name, node_output in chunk.items():
                label = agent_labels.get(node_name, f"{node_name} running...")
                add_log(label, "running")
                time.sleep(0.2)
            final_state = chunk

        # Get final complete state by running invoke
        add_log("Finalising results...", "info")
        st.session_state.final_state = graph.invoke(initial_state)
        add_log("All agents complete ✓", "done")

    except Exception as e:
        add_log(f"Error: {str(e)}", "running")
        st.error(f"Pipeline error: {e}")
        st.stop()

if st.session_state.final_state:
    final_state = st.session_state.final_state

    # ── Results ────────────────────────────────────────────────────────

    # Critic scores
    scores = final_state.get("critic_scores", {}).get("scores", {})
    feedback = final_state.get("critic_scores", {}).get("feedback", {})

    if scores:
        st.markdown('<div class="section-header">Quality Scores</div>', unsafe_allow_html=True)
        score_cols = st.columns(len(scores))
        for i, (agent, score) in enumerate(scores.items()):
            with score_cols[i]:
                pct = score * 10
                st.markdown(f"""
                <div class="score-bar-wrap">
                    <div class="score-label">
                        <span>{agent.title()}</span>
                        <span>{score}/10</span>
                    </div>
                    <div class="score-bar-bg">
                        <div class="score-bar-fill" style="width:{pct}%"></div>
                    </div>
                    <div style="font-size:0.75rem;color:#7A6A55;margin-top:0.3rem">{feedback.get(agent, '')}</div>
                </div>
                """, unsafe_allow_html=True)

    # Tabs for results
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "🏢 Sponsors", "🎤 Speakers", "🏛️ Venues", "💰 Pricing & Revenue", "📋 Ops Timeline"
    ])

    # ── Sponsors ──────────────────────────────────────────────────────
    with tab1:
        st.markdown('<div class="section-header">Recommended Sponsors</div>', unsafe_allow_html=True)
        sponsors = final_state.get("sponsors", [])
        for i, s in enumerate(sponsors):
            if not isinstance(s, dict) or "name" not in s:
                continue
            tier = s.get("tier", "Community").lower().replace(" ", "")
            tier_class = f"tier-{tier}" if tier in ["title", "gold", "silver", "community"] else "tier-community"
            st.markdown(f"""
            <div class="result-card">
                <div class="card-title">
                    {s.get('name', '')}
                    <span class="tier-badge {tier_class}">{s.get('tier', '')}</span>
                    <span class="score-pill">Score: {s.get('relevance_score', '')}/10</span>
                </div>
                <div class="card-body">{s.get('why', '')}</div>
                <div class="card-meta" style="margin-top:0.4rem">📬 {s.get('approach', '')}</div>
            </div>
            """, unsafe_allow_html=True)

            if st.button(f"✉ Draft outreach email", key=f"sponsor_email_{i}"):
                with st.spinner("Drafting email..."):
                    email = draft_sponsor_email(s, final_state["event_spec"])
                st.markdown(f"""
                <div class="result-card" style="background:#FFFAF5;border-left:3px solid #C4622D;margin-top:-0.5rem">
                    <div style="white-space:pre-wrap;font-size:0.88rem;line-height:1.7;color:#2C2416">{email}</div>
                </div>
                """, unsafe_allow_html=True)

    # ── Speakers ──────────────────────────────────────────────────────
    with tab2:
        st.markdown('<div class="section-header">Speaker Lineup</div>', unsafe_allow_html=True)
        speakers = final_state.get("speakers", [])
        for i, s in enumerate(speakers):
            if not isinstance(s, dict) or "name" not in s:
                continue
            st.markdown(f"""
            <div class="result-card">
                <div class="card-title">
                    {s.get('name', '')}
                    <span class="score-pill">{s.get('suggested_slot', '')}</span>
                </div>
                <div class="card-meta">{s.get('title', '')} · {s.get('expertise', '')}</div>
                <div class="card-body">{s.get('why', '')}</div>
            </div>
            """, unsafe_allow_html=True)

            if st.button(f"✉ Draft invitation email", key=f"speaker_email_{i}"):
                with st.spinner("Drafting email..."):
                    email = draft_speaker_email(s, final_state["event_spec"])
                st.markdown(f"""
                <div class="result-card" style="background:#FFFAF5;border-left:3px solid #C4622D;margin-top:-0.5rem">
                    <div style="white-space:pre-wrap;font-size:0.88rem;line-height:1.7;color:#2C2416">{email}</div>
                </div>
                """, unsafe_allow_html=True)

    # ── Venues ────────────────────────────────────────────────────────
    with tab3:
        st.markdown('<div class="section-header">Venue Options</div>', unsafe_allow_html=True)
        venues = final_state.get("venues", [])
        for v in venues:
            if not isinstance(v, dict) or "name" not in v:
                continue
            pros = " · ".join(v.get("pros", []))
            cons = " · ".join(v.get("cons", []))
            st.markdown(f"""
            <div class="result-card">
                <div class="card-title">
                    {v.get('name', '')}
                    <span class="score-pill">Fit: {v.get('fit_score', '')}/10</span>
                </div>
                <div class="card-meta">{v.get('city', '')} · {v.get('type', '')} · Capacity: {v.get('capacity', ''):,} · ~${v.get('estimated_daily_cost_usd', 0):,}/day</div>
                <div class="card-body">✓ {pros}</div>
                <div class="card-body" style="color:#C4622D">✗ {cons}</div>
            </div>
            """, unsafe_allow_html=True)

    # ── Pricing ───────────────────────────────────────────────────────
    with tab4:
        pricing = final_state.get("pricing", {})
        if pricing:
            st.markdown('<div class="section-header">Ticket Tiers</div>', unsafe_allow_html=True)

            # Pricing cards
            tiers = pricing.get("ticket_tiers", [])
            cols = st.columns(min(len(tiers), 4))
            for i, tier in enumerate(tiers):
                with cols[i % 4]:
                    st.markdown(f"""
                    <div class="pricing-card">
                        <div class="pricing-name">{tier.get('name', '')}</div>
                        <div class="pricing-price">${tier.get('price_usd', 0)}</div>
                        <div class="pricing-perks">{tier.get('perks', '')[:80]}...</div>
                    </div>
                    """, unsafe_allow_html=True)

            # Forecast
            st.markdown('<div class="section-header">Attendance Forecast</div>', unsafe_allow_html=True)
            forecast = pricing.get("attendance_forecast", {})
            st.markdown(f"""
            <div class="forecast-grid">
                <div class="forecast-item">
                    <div class="forecast-label">Conservative</div>
                    <div class="forecast-number conservative">{forecast.get('conservative', 0):,}</div>
                </div>
                <div class="forecast-item">
                    <div class="forecast-label">Realistic</div>
                    <div class="forecast-number">{forecast.get('realistic', 0):,}</div>
                </div>
                <div class="forecast-item">
                    <div class="forecast-label">Optimistic</div>
                    <div class="forecast-number optimistic">{forecast.get('optimistic', 0):,}</div>
                </div>
            </div>
            """, unsafe_allow_html=True)

            # Revenue
            revenue = pricing.get("revenue_projection_usd", {})
            st.markdown('<div class="section-header">Revenue Projection</div>', unsafe_allow_html=True)
            st.markdown(f"""
            <div class="forecast-grid">
                <div class="forecast-item">
                    <div class="forecast-label">From Tickets</div>
                    <div class="forecast-number">${revenue.get('from_tickets', 0):,}</div>
                </div>
                <div class="forecast-item">
                    <div class="forecast-label">From Sponsors</div>
                    <div class="forecast-number">${revenue.get('from_sponsorships', 0):,}</div>
                </div>
                <div class="forecast-item">
                    <div class="forecast-label">Total</div>
                    <div class="forecast-number optimistic">${revenue.get('total', 0):,}</div>
                </div>
            </div>
            """, unsafe_allow_html=True)

            st.markdown(f"""
            <div class="result-card">
                <div class="card-body">{pricing.get('rationale', '')}</div>
            </div>
            """, unsafe_allow_html=True)

    # ── Ops Timeline ──────────────────────────────────────────────────
    with tab5:
        st.markdown('<div class="section-header">Operational Timeline</div>', unsafe_allow_html=True)
        ops = final_state.get("ops_timeline", [])
        for phase in ops:
            if not isinstance(phase, dict):
                continue
            with st.expander(f"📌 {phase.get('phase', '')} — {phase.get('weeks_before_event', '')} weeks out"):
                for task in phase.get("tasks", []):
                    priority = task.get("priority", "Medium")
                    color = "#C4622D" if priority == "High" else "#A07820" if priority == "Medium" else "#7A6A55"
                    st.markdown(f"""
                    <div style="display:flex;align-items:center;gap:0.8rem;padding:0.4rem 0;border-bottom:1px solid #F0EAE0">
                        <span style="font-size:0.75rem;font-weight:500;color:{color};min-width:60px">{priority}</span>
                        <span style="font-size:0.88rem;color:#2C2416">{task.get('task', '')}</span>
                        <span style="font-size:0.75rem;color:#7A6A55;margin-left:auto">{task.get('owner', '')}</span>
                    </div>
                    """, unsafe_allow_html=True)