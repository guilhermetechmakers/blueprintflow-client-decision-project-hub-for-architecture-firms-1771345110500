import { toast } from 'sonner'
import { Building2, Mail, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface SocialLoginButtonsProps {
  onSSOClick?: (provider: 'saml' | 'google' | 'microsoft') => void
  className?: string
}

export function SocialLoginButtons({ onSSOClick, className }: SocialLoginButtonsProps) {
  const handleSSO = (provider: 'saml' | 'google' | 'microsoft') => {
    onSSOClick?.(provider)
    toast.info(`${provider === 'saml' ? 'Enterprise SSO' : provider} sign-in can be configured by your admin.`)
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Button
        type="button"
        variant="secondary"
        className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
        onClick={() => handleSSO('saml')}
        aria-label="Sign in with SAML or Okta (enterprise)"
      >
        <Building2 className="h-4 w-4 shrink-0" aria-hidden />
        <span className="truncate">SAML / Okta (enterprise)</span>
      </Button>
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="secondary"
          className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
          onClick={() => handleSSO('google')}
          aria-label="Sign in with Google"
        >
          <Mail className="h-4 w-4 shrink-0" aria-hidden />
          <span className="truncate">Google</span>
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
          onClick={() => handleSSO('microsoft')}
          aria-label="Sign in with Microsoft"
        >
          <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
          <span className="truncate">Microsoft</span>
        </Button>
      </div>
    </div>
  )
}
