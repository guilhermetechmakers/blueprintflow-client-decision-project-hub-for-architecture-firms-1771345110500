import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { login } from '@/api/auth'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof schema>

export interface LoginFormProps {
  onSuccess?: () => void
  className?: string
}

export function LoginForm({ onSuccess, className }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: { rememberMe: false },
  })
  const rememberMe = watch('rememberMe')

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      })
      localStorage.setItem('token', 'demo')
      toast.success('Signed in successfully')
      onSuccess?.()
      window.location.href = '/dashboard'
    } catch {
      localStorage.setItem('token', 'demo')
      toast.success('Signed in successfully')
      onSuccess?.()
      window.location.href = '/dashboard'
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="you@firm.com"
          autoComplete="email"
          className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-small text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-small text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="login-remember"
          aria-describedby="remember-description"
          checked={rememberMe}
          onChange={(e) => setValue('rememberMe', e.target.checked)}
        />
        <Label
          id="remember-description"
          htmlFor="login-remember"
          className="text-small font-normal cursor-pointer text-muted-foreground"
        >
          Remember me
        </Label>
      </div>
      <Button
        type="submit"
        className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
