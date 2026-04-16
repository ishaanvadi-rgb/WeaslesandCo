import json
from langchain_core.messages import SystemMessage, HumanMessage
from llm import llm


def draft_sponsor_email(sponsor: dict, event_spec: dict) -> str:
    """
    Drafts a personalized sponsor outreach email.
    Streams the response token by token.
    """
    system_prompt = """You are an expert event sponsorship outreach writer.
Write a short, warm, specific outreach email to a potential sponsor.

Rules:
- 3 short paragraphs max
- First paragraph: why we're reaching out to THEM specifically
- Second paragraph: what's in it for them (audience fit, brand visibility)
- Third paragraph: clear call to action
- No generic phrases like "I hope this email finds you well"
- Sign off as "The ConferenceAI Team"
- Subject line on the first line prefixed with "Subject: "
"""

    human_message = f"""Draft a sponsor outreach email for:

Company: {sponsor.get('name')}
Sponsor tier we're offering: {sponsor.get('tier')}
Why they're relevant: {sponsor.get('why')}
Suggested approach: {sponsor.get('approach')}

Event details:
- Category: {event_spec.get('category')}
- Geography: {event_spec.get('geography')}
- Audience size: {event_spec.get('audience_size')}"""

    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=human_message),
    ])

    return response.content


def draft_speaker_email(speaker: dict, event_spec: dict) -> str:
    """
    Drafts a personalized speaker invitation email.
    """
    system_prompt = """You are an expert event speaker relations writer.
Write a short, warm, specific speaker invitation email.

Rules:
- 3 short paragraphs max
- First paragraph: why we want THEM specifically for this event
- Second paragraph: what the session looks like and what's in it for them
- Third paragraph: clear next step
- No generic phrases
- Sign off as "The ConferenceAI Team"
- Subject line on the first line prefixed with "Subject: "
"""

    human_message = f"""Draft a speaker invitation email for:

Name: {speaker.get('name')}
Title: {speaker.get('title')}
Suggested slot: {speaker.get('suggested_slot')}
Why relevant: {speaker.get('why')}

Event details:
- Category: {event_spec.get('category')}
- Geography: {event_spec.get('geography')}
- Audience size: {event_spec.get('audience_size')}"""

    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=human_message),
    ])

    return response.content