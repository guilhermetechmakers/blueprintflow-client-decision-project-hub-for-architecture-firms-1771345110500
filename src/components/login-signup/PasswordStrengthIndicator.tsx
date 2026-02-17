import { useMemo } from 'react'
import { cn } from '@/lib/utils'

export interface PasswordStrengthIndicatorProps {
  password: string
  className?: string
}

function getStrength(password: string): { score: number; label: string } {
  if (!password) return { score: 0, label: '' }
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong']
  return { score, label: labels[score] }
}

export function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  const { score, label } = useMemo(() => getStrength(password), [password])
  if (!password) return null
  return (
    <div className={cn('space-y-1', className)} role="status" aria-live="polite">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-200',
              i <= score
                ? score <= 2
                  ? 'bg-destructive'
                  : score <= 3
                    ? 'bg-warning'
                    : 'bg-success'
                : 'bg-muted'
            )}
          />
        ))}
      </div>
      {label && (
        <p className="text-small text-muted-foreground">
          Password strength: <span className="font-medium text-foreground">{label}</span>
        </p>
      )}
    </div>
  )
}
