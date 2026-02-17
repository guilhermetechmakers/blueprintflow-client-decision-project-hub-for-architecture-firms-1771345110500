import { useState } from 'react'
import { toast } from 'sonner'
import { Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { validateInviteToken } from '@/api/auth'
import { cn } from '@/lib/utils'

export interface MagicLinkInviteFlowProps {
  onSuccess?: () => void
  className?: string
}

export function MagicLinkInviteFlow({ onSuccess, className }: MagicLinkInviteFlowProps) {
  const [token, setToken] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = token.trim()
    if (!trimmed) {
      setError('Paste your invite token')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      await validateInviteToken(trimmed)
      localStorage.setItem('token', 'demo')
      toast.success('Invite accepted. Welcome!')
      onSuccess?.()
      window.location.href = '/dashboard'
    } catch {
      setError('Invalid or expired invite token. Please check and try again.')
      toast.error('Invalid invite token')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-3', className)}>
      <div className="space-y-2">
        <Label htmlFor="invite-token">Invite token</Label>
        <div className="flex gap-2">
          <Input
            id="invite-token"
            type="text"
            placeholder="Paste invite token or magic link code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="one-time-code"
            className={cn(
              'flex-1 transition-colors',
              error ? 'border-destructive focus-visible:ring-destructive' : ''
            )}
            aria-invalid={!!error}
            aria-describedby={error ? 'invite-token-error' : undefined}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="shrink-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            aria-label="Submit invite token"
          >
            <Link2 className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        {error && (
          <p id="invite-token-error" className="text-small text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    </form>
  )
}
