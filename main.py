import json
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
from graph import graph

console = Console()


def run(category: str, geography: str, audience_size: int):
    console.print(Panel.fit(
        f"[bold purple]ConferenceAI[/bold purple]\n"
        f"[dim]{category} · {geography} · {audience_size:,} attendees[/dim]",
        border_style="purple"
    ))

    initial_state = {
        "event_spec": {
            "category": category,
            "geography": geography,
            "audience_size": audience_size,
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
        "past_event_intel": None,
        "final_report": None,
        "errors": [],
    }

    console.print("\n[bold]Running agents...[/bold]\n")

    final_state = graph.invoke(initial_state)

    # Print critic scores
    scores = final_state.get("critic_scores", {}).get("scores", {})
    if scores:
        console.print("[bold]Quality scores:[/bold]")
        for agent, score in scores.items():
            color = "green" if score >= 7 else "yellow" if score >= 5 else "red"
            console.print(f"  {agent}: [{color}]{score}/10[/{color}]")

    # Print full results
    console.print("\n[bold]Results:[/bold]\n")
    console.print("[bold]SPONSORS[/bold]")
    console.print(json.dumps(final_state.get("sponsors", []), indent=2))

    console.print("\n[bold]SPEAKERS[/bold]")
    console.print(json.dumps(final_state.get("speakers", []), indent=2))

    console.print("\n[bold]VENUES[/bold]")
    console.print(json.dumps(final_state.get("venues", []), indent=2))

    console.print("\n[bold]PRICING[/bold]")
    console.print(json.dumps(final_state.get("pricing", {}), indent=2))

    console.print("\n[bold]GTM PLAN[/bold]")
    console.print(json.dumps(final_state.get("gtm_plan", {}), indent=2))

    console.print("\n[bold]OPS TIMELINE[/bold]")
    console.print(json.dumps(final_state.get("ops_timeline", []), indent=2))

    # Save to file
    output_file = f"{category.lower().replace(' ', '_')}_{geography.lower()}_plan.json"
    with open(output_file, "w") as f:
        json.dump({
            "event_spec": final_state["event_spec"],
            "sponsors": final_state.get("sponsors"),
            "speakers": final_state.get("speakers"),
            "venues": final_state.get("venues"),
            "pricing": final_state.get("pricing"),
            "gtm_plan": final_state.get("gtm_plan"),
            "ops_timeline": final_state.get("ops_timeline"),
            "critic_scores": final_state.get("critic_scores"),
        }, f, indent=2)

    console.print(f"\n[dim]Saved to {output_file}[/dim]")


if __name__ == "__main__":
    run(
        category="AI",
        geography="India",
        audience_size=1000,
    )