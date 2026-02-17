import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-14 items-center px-6">
          <Link to="/" className="font-semibold text-h2 text-primary">
            BlueprintFlow
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-h1 mb-6">Privacy Policy</h1>
        <div className="prose prose-slate text-body text-muted-foreground space-y-4">
          <p>
            This privacy policy describes how BlueprintFlow collects, uses, and protects your information.
          </p>
          <p>
            We collect account data, project data, and usage data to provide and improve the service.
            We do not sell your data. We use industry-standard security and comply with applicable privacy laws.
          </p>
          <p>
            For questions, contact support through the Help page.
          </p>
        </div>
        <Button variant="secondary" className="mt-8" asChild>
          <Link to="/">Back to home</Link>
        </Button>
      </main>
    </div>
  )
}
