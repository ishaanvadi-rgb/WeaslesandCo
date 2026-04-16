import time
import random
from ddgs import DDGS


def web_search(query: str, max_results: int = 3) -> list[dict]:
    # Small random delay to avoid parallel request blocking
    time.sleep(random.uniform(1, 3))
    try:
        with DDGS(timeout=15) as ddgs:
            results = list(ddgs.text(query, max_results=max_results))
        return results
    except Exception as e:
        print(f"[Search] Failed: {e}")
        return []


def format_results(results: list[dict]) -> str:
    if not results:
        return "No search results available. Use your training knowledge."

    formatted = []
    for i, r in enumerate(results, 1):
        formatted.append(
            f"{i}. {r.get('title', '')}\n"
            f"   {r.get('body', '')[:200]}\n"
        )
    return "\n".join(formatted)
