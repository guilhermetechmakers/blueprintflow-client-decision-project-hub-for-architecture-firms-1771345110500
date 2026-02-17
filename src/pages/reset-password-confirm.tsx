import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { resetPassword } from '@/api/auth'
import { cn } from '@/lib/utils'

const passwordSchema = z
  .string()
  .min(8, 'At least 8 characters')
  .regex(/[A-Za-z]/, 'At least one letter')
  .regex(/[0-9]/, 'At least one number')

const schema = z.object({
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export function ResetPasswordConfirm() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [success, setSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error('Invalid or missing reset link. Request a new one.')
      return
    }
    try {
      await resetPassword(token, data.newPassword)
      localStorage.setItem('token', 'demo')
      setSuccess(true)
      toast.success('Password updated. Signing you in…')
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to reset password'
      toast.error(message)
    }
  }

  if (!token) {
    return (
      <Card className="border-0 shadow-none bg-transparent w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-h1">Invalid link</CardTitle>
          <CardDescription>
            This password reset link is invalid or has expired. Please request a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link to="/password-reset">Request new reset link</Link>
          </Button>
          <p className="text-center text-small text-muted-foreground mt-4">
            <Link to="/login" className="text-primary hover:underline">Back to sign in</Link>
          </p>
        </CardContent>
      </Card>
    )
  }

  if (success) {
    return (
      <Card className="border-0 shadow-none bg-transparent w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-h1 text-center">Password updated</CardTitle>
          <CardDescription className="text-center">
            Redirecting you to the dashboard…
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-small text-muted-foreground">
            <Link to="/dashboard" className="text-primary hover:underline">Go to dashboard</Link>
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-none bg-transparent w-full max-w-md animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-h1">Set new password</CardTitle>
        <CardDescription>
          Choose a strong password. Use at least 8 characters with letters and numbers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className={cn(errors.newPassword && 'border-destructive focus-visible:ring-destructive')}
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className="text-small text-destructive" role="alert">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className={cn(errors.confirmPassword && 'border-destructive focus-visible:ring-destructive')}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-small text-destructive" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating…' : 'Update password'}
          </Button>
        </form>
        <p className="text-center text-small text-muted-foreground mt-4">
          <Link to="/login" className="text-primary hover:underline">Back to sign in</Link>
        </p>
      </CardContent>
    </Card>
  )
}
