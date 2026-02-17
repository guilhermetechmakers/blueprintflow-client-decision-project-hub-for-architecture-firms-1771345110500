import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { signup } from '@/api/auth'
import { PasswordStrengthIndicator } from '@/components/login-signup/PasswordStrengthIndicator'
import { cn } from '@/lib/utils'

const passwordSchema = z
  .string()
  .min(8, 'At least 8 characters')
  .regex(/[A-Za-z]/, 'At least one letter')
  .regex(/[0-9]/, 'At least one number')

const schema = z
  .object({
    firmName: z.string().min(1, 'Firm name is required'),
    adminContact: z.string().min(1, 'Admin contact is required').email('Invalid email'),
    password: passwordSchema,
    confirmPassword: z.string(),
    createInitialProject: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignupFormModalData = z.infer<typeof schema>

export interface SignupFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function SignupFormModal({ open, onOpenChange, onSuccess }: SignupFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<SignupFormModalData>({
    resolver: zodResolver(schema),
    defaultValues: { createInitialProject: true },
  })
  const createInitialProject = watch('createInitialProject')
  const password = watch('password', '')

  const onSubmit = async (data: SignupFormModalData) => {
    try {
      await signup({
        firmName: data.firmName,
        adminContact: data.adminContact,
        password: data.password,
        createInitialProject: data.createInitialProject ?? false,
      })
      localStorage.setItem('token', 'demo')
      toast.success('Account created successfully')
      reset()
      onOpenChange(false)
      onSuccess?.()
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Something went wrong. Please try again.'
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose className="max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle>Create account</DialogTitle>
          <DialogDescription>
            Enter your firm details and a secure password. You can create your first project after signing up.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-firm">Firm name</Label>
            <Input
              id="signup-firm"
              placeholder="Acme Architecture"
              autoComplete="organization"
              className={cn(errors.firmName && 'border-destructive focus-visible:ring-destructive')}
              {...register('firmName')}
            />
            {errors.firmName && (
              <p className="text-small text-destructive" role="alert">
                {errors.firmName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-admin">Admin contact (email)</Label>
            <Input
              id="signup-admin"
              type="email"
              placeholder="admin@firm.com"
              autoComplete="email"
              className={cn(errors.adminContact && 'border-destructive focus-visible:ring-destructive')}
              {...register('adminContact')}
            />
            {errors.adminContact && (
              <p className="text-small text-destructive" role="alert">
                {errors.adminContact.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              className={cn(errors.password && 'border-destructive focus-visible:ring-destructive')}
              {...register('password')}
            />
            <PasswordStrengthIndicator password={password} className="mt-1" />
            {errors.password && (
              <p className="text-small text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-confirm-password">Confirm password</Label>
            <Input
              id="signup-confirm-password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              className={cn(errors.confirmPassword && 'border-destructive focus-visible:ring-destructive')}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-small text-destructive" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="signup-initial-project"
              aria-describedby="initial-project-description"
              checked={createInitialProject}
              onChange={(e) => setValue('createInitialProject', e.target.checked)}
            />
            <Label
              id="initial-project-description"
              htmlFor="signup-initial-project"
              className={cn('text-small font-normal cursor-pointer text-muted-foreground')}
            >
              Create initial project after signup
            </Label>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
            >
              {isSubmitting ? 'Creating…' : 'Sign up'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
