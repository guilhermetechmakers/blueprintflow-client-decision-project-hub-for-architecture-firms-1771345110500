import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Terms() {
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
        <h1 className="text-h1 mb-6">Terms of Service</h1>
        <div className="prose prose-slate text-body text-muted-foreground space-y-4">
          <p>
            By using BlueprintFlow you agree to these terms. You are responsible for your account and
            the data you upload. We provide the service as-is and reserve the right to update
            these terms with notice.
          </p>
          <p>
            Acceptance timestamps are recorded for audit purposes where required.
          </p>
        </div>
        <Button variant="secondary" className="mt-8" asChild>
          <Link to="/">Back to home</Link>
        </Button>
      </main>
    </div>
  )
}
