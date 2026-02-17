import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoginForm } from '@/components/login-signup/LoginForm'
import { SocialLoginButtons } from '@/components/login-signup/SSO/SocialLoginButtons'
import { SignupFormModal } from '@/components/login-signup/SignupFormModal'
import { MagicLinkInviteFlow } from '@/components/login-signup/MagicLinkInviteFlow'
import { AuthLinks } from '@/components/login-signup/AuthLinks'
import { cn } from '@/lib/utils'

function LoginSignupPage() {
  const [signupOpen, setSignupOpen] = useState(false)
  const [showInvite, setShowInvite] = useState(false)

  useEffect(() => {
    const prevTitle = document.title
    const metaDesc = document.querySelector('meta[name="description"]')
    const prevContent = metaDesc?.getAttribute('content') ?? ''
    document.title = 'Sign in or Sign up | BlueprintFlow'
    if (metaDesc) metaDesc.setAttribute('content', 'Sign in to BlueprintFlow or create an account. Use email, SSO, or an invite token.')
    return () => {
      document.title = prevTitle
      if (metaDesc) metaDesc.setAttribute('content', prevContent)
    }
  }, [])

  return (
    <>
      <Card className="border-0 shadow-none bg-transparent w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-h1">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials, use SSO, or paste an invite token.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <LoginForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <span className="relative flex justify-center text-small text-muted-foreground bg-background px-2">
              or continue with
            </span>
          </div>

          <SocialLoginButtons />

          {!showInvite ? (
            <div className="space-y-3">
              <Button
                type="button"
                variant="tertiary"
                className="w-full text-small"
                onClick={() => setShowInvite(true)}
              >
                I have an invite token
              </Button>
            </div>
          ) : (
            <div className={cn('rounded-lg border border-border bg-muted/30 p-3 space-y-2')}>
              <MagicLinkInviteFlow />
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                className="w-full text-small text-muted-foreground"
                onClick={() => setShowInvite(false)}
              >
                Hide invite token
              </Button>
            </div>
          )}

          <div className="pt-2 space-y-4">
            <AuthLinks />
            <p className="text-center text-small text-muted-foreground">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                onClick={() => setSignupOpen(true)}
              >
                Sign up
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      <SignupFormModal open={signupOpen} onOpenChange={setSignupOpen} />
    </>
  )
}

export default LoginSignupPage
