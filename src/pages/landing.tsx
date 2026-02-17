import { Link } from 'react-router-dom'
import { Check, FileCheck, MessageSquare, Calendar, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: FileCheck,
    title: 'Decision Log',
    description: 'Comparison cards with versioned approvals and audit-ready provenance.',
  },
  {
    icon: MessageSquare,
    title: 'Contextual Messaging',
    description: 'Threads tied to decisions, documents, and tasks—no more lost context.',
  },
  {
    icon: Calendar,
    title: 'Project Timeline',
    description: 'Phases, milestones, and dependencies in one view.',
  },
  {
    icon: BarChart3,
    title: 'Reports & Handover',
    description: 'Pre-built reports and exportable audit bundles.',
  },
]

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Animated gradient hero background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-14 items-center justify-between px-6">
          <Link to="/" className="font-semibold text-h2 text-primary">
            BlueprintFlow
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/pricing" className="text-body text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/login">
              <Button variant="tertiary">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary">Get started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Client decision & project hub for{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              architecture firms
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Centralize timelines, decision logs, documents, and communication. Prove every client decision with versioned approvals and audit-ready exports.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="min-w-[160px]" asChild>
              <Link to="/signup">Start free trial</Link>
            </Button>
            <Button size="lg" variant="secondary" className="min-w-[160px]" asChild>
              <Link to="/login">Book a demo</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 border-t border-border">
        <h2 className="text-h1 text-center mb-12">Why BlueprintFlow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className="flex gap-4 p-6 rounded-lg border border-border bg-card shadow-card hover:shadow-card-hover transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="shrink-0 size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="text-h3 font-semibold mb-1">{title}</h3>
                <p className="text-body text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-h1">Ready to reduce scope creep and speed approvals?</h2>
          <p className="text-body text-muted-foreground">
            Join architecture firms who use BlueprintFlow as their single source of truth.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <ul className="flex flex-wrap justify-center gap-6 text-body text-muted-foreground">
              {['Immutable decision records', 'Contextual messaging', 'Document annotation'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Button size="lg" asChild>
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border bg-card mt-24">
        <div className="container mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-small text-muted-foreground">© BlueprintFlow. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-small text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="text-small text-muted-foreground hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
