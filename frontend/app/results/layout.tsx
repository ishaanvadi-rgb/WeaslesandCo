"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Building2, 
  Mic2, 
  MapPin, 
  DollarSign, 
  Megaphone, 
  CalendarClock, 
  Mail,
  Download,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { href: "/results", label: "Overview", icon: LayoutDashboard },
  { href: "/results/sponsors", label: "Sponsors", icon: Building2 },
  { href: "/results/speakers", label: "Speakers", icon: Mic2 },
  { href: "/results/venues", label: "Venues", icon: MapPin },
  { href: "/results/pricing", label: "Pricing", icon: DollarSign },
  { href: "/results/gtm", label: "GTM Plan", icon: Megaphone },
  { href: "/results/ops", label: "Ops Timeline", icon: CalendarClock },
  { href: "/results/outreach", label: "Outreach", icon: Mail },
]

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-2xl font-bold text-foreground">
              ConferenceAI
            </Link>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-3">
              <span className="font-medium text-foreground">TechSummit 2025</span>
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                AI/ML
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                5,000 attendees
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <FileText className="h-4 w-4" />
              Draft All Emails
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card p-4 hidden lg:block">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Mobile Nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 z-50">
          <div className="flex items-center justify-around overflow-x-auto">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  )
}
