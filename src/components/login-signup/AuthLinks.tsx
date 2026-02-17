import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface AuthLinksProps {
  className?: string
}

export function AuthLinks({ className }: AuthLinksProps) {
  return (
    <nav
      className={cn('flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-small', className)}
      aria-label="Authentication and legal links"
    >
      <Link
        to="/password-reset"
        className="text-muted-foreground transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
      >
        Forgot password
      </Link>
      <span className="text-muted-foreground/60" aria-hidden>
        ·
      </span>
      <Link
        to="/terms"
        className="text-muted-foreground transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
      >
        Terms
      </Link>
      <span className="text-muted-foreground/60" aria-hidden>
        ·
      </span>
      <Link
        to="/privacy"
        className="text-muted-foreground transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
      >
        Privacy
      </Link>
    </nav>
  )
}
