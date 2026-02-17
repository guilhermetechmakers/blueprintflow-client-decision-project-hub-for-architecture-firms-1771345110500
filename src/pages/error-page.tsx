import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="max-w-md text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="size-24 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="size-12 text-destructive" />
          </div>
        </div>
        <h1 className="text-h1">Something went wrong</h1>
        <p className="text-body text-muted-foreground">
          We’re sorry. Please try again or contact support if the problem persists.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
