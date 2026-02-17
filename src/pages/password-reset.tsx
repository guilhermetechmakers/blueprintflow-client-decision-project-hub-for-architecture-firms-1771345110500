import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { requestPasswordReset } from '@/api/auth'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
})

type FormData = z.infer<typeof schema>

export function PasswordReset() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await requestPasswordReset(data.email)
      setSent(true)
      toast.success('Check your email for the reset link')
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to send reset link'
      toast.error(message)
    }
  }

  if (sent) {
    return (
      <Card className="border-0 shadow-none bg-transparent w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="size-12 rounded-full bg-accent/10 flex items-center justify-center" aria-hidden>
              <Mail className="size-6 text-accent" />
            </div>
          </div>
          <CardTitle className="text-h1 text-center">Check your email</CardTitle>
          <CardDescription className="text-center">
            We sent a password reset link to <strong className="text-foreground">{getValues('email')}</strong>. Links expire in 1 hour.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="secondary"
            className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
            onClick={() => setSent(false)}
          >
            Send to a different email
          </Button>
          <p className="text-center text-small text-muted-foreground">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Back to sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-none bg-transparent w-full max-w-md animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-h1">Reset password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send a reset link. Links expire in 1 hour.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password-reset-email">Email</Label>
            <Input
              id="password-reset-email"
              type="email"
              placeholder="you@firm.com"
              autoComplete="email"
              className={cn(errors.email && 'border-destructive focus-visible:ring-destructive')}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-small text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
        <p className="text-center text-small text-muted-foreground mt-4">
          <Link
            to="/login"
            className="text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
