import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function EmailVerification() {
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-2">
          <div className="size-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Mail className="size-6 text-accent" />
          </div>
        </div>
        <CardTitle className="text-h1 text-center">Verify your email</CardTitle>
        <CardDescription className="text-center">
          We’ve sent a link to your email. Click it to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full" variant="secondary" disabled>
          Resend email
        </Button>
        <p className="text-center text-small text-muted-foreground">
          Already verified? <Link to="/login" className="text-primary hover:underline">Log in</Link>
        </p>
        <p className="text-center text-small text-muted-foreground">
          <Link to="/help" className="text-primary hover:underline">Contact support</Link>
        </p>
      </CardContent>
    </Card>
  )
}
