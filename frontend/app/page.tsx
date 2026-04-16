import Link from "next/link"
import { ArrowRight, Search, Users, Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold text-foreground">
            ConferenceAI
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              href="/how-it-works" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
            </Link>
            <Link href="/setup">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Planning
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-tight text-balance mb-6">
              Plan your next conference. Autonomously.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
              6 specialized AI agents. Real web research. End-to-end execution.
            </p>
            <Link href="/setup">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 h-auto group"
              >
                Start Planning
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="py-24 px-6 bg-secondary/30">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Search className="h-8 w-8" />}
                title="Real-time web research"
                description="Our agents scour the web to find the best sponsors, speakers, and venues tailored to your event."
              />
              <FeatureCard
                icon={<Users className="h-8 w-8" />}
                title="6 specialist agents"
                description="Researcher, Sponsor Hunter, Speaker Finder, Venue Scout, Pricing Analyst, and GTM Strategist working in concert."
              />
              <FeatureCard
                icon={<Mail className="h-8 w-8" />}
                title="Instant outreach drafts"
                description="Get personalized email drafts ready to send to sponsors and speakers with one click."
              />
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">Powered by autonomous AI</span>
            </div>
            <p className="font-serif text-2xl md:text-3xl text-foreground">
              {"\""}The future of event planning is here. What used to take weeks now takes minutes.{"\""}
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif text-lg font-bold text-foreground">ConferenceAI</span>
          <p className="text-muted-foreground text-sm">
            © 2024 ConferenceAI. Autonomous conference planning.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
