import requests
from bs4 import BeautifulSoup
from state import ConferenceState
from tools.search import web_search
from tools.rag import init_collection, add_documents


def scrape_website(url: str, max_chars: int = 2000) -> str:
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers, timeout=8)
        soup = BeautifulSoup(response.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        text = soup.get_text(separator=" ", strip=True)
        text = " ".join(text.split())
        return text[:max_chars]
    except Exception as e:
        return ""


def researcher_node(state: ConferenceState) -> dict:
    spec = state["event_spec"]
    print(f"\n[Researcher] Building knowledge base for {spec['category']} in {spec['geography']}...")

    # Initialize fresh RAG collection
    init_collection()

    # Search for past events
    query = f"{spec['category']} event {spec['geography']} 2024 2025 official site"
    results = web_search(query, max_results=4)

    if not results:
        print("[Researcher] No search results, skipping RAG")
        return {"past_event_intel": None}

    # Scrape top 2 results and add to RAG
    scraped_texts = []
    for r in results[:2]:
        url = r.get("href", "")
        if not url:
            continue
        print(f"[Researcher] Scraping {url[:60]}...")
        content = scrape_website(url)
        if content:
            scraped_texts.append(content)

    # Also add search snippets directly
    snippets = [r.get("body", "") for r in results if r.get("body")]
    all_texts = scraped_texts + snippets

    if all_texts:
        add_documents(all_texts, source=f"{spec['category']}_{spec['geography']}")

    intel = {
        "events_found": [
            {"name": r.get("title", ""), "url": r.get("href", "")}
            for r in results[:3]
        ],
        "rag_ready": True,
    }

    print(f"[Researcher] Knowledge base ready with {len(all_texts)} documents")
    return {"past_event_intel": intel}