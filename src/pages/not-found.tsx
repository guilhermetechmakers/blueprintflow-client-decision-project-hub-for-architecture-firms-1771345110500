import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="max-w-md text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="size-24 rounded-full bg-muted flex items-center justify-center">
            <FileQuestion className="size-12 text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-h1">Page not found</h1>
        <p className="text-body text-muted-foreground">
          The page you’re looking for doesn’t exist or was moved.
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
