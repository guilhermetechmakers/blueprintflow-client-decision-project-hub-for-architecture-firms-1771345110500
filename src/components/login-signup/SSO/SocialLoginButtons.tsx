import { useState } from 'react'
import { toast } from 'sonner'
import { Building2, Mail, MessageCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSsoLoginUrl } from '@/api/auth'
import { cn } from '@/lib/utils'

export interface SocialLoginButtonsProps {
  onSSOClick?: (provider: 'saml' | 'google' | 'microsoft') => void
  className?: string
}

export function SocialLoginButtons({ onSSOClick, className }: SocialLoginButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'microsoft' | null>(null)

  const handleSSO = async (provider: 'saml' | 'google' | 'microsoft') => {
    onSSOClick?.(provider)
    if (provider === 'saml') {
      toast.info('Enterprise SSO can be configured by your admin.')
      return
    }
    setLoadingProvider(provider)
    try {
      const { url } = await getSsoLoginUrl(provider)
      if (url) {
        window.location.href = url
        return
      }
    } catch {
      toast.info(`${provider} sign-in can be configured by your admin.`)
    } finally {
      setLoadingProvider(null)
    }
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
          disabled={loadingProvider !== null}
          aria-label="Sign in with Google"
        >
          {loadingProvider === 'google' ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
          ) : (
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
          )}
          <span className="truncate">Google</span>
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
          onClick={() => handleSSO('microsoft')}
          disabled={loadingProvider !== null}
          aria-label="Sign in with Microsoft"
        >
          {loadingProvider === 'microsoft' ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
          ) : (
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
          )}
          <span className="truncate">Microsoft</span>
        </Button>
      </div>
    </div>
  )
}
