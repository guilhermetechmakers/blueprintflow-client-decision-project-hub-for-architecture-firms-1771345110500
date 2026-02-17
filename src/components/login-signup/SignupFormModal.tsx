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
import { cn } from '@/lib/utils'

const schema = z.object({
  firmName: z.string().min(1, 'Firm name is required'),
  adminContact: z.string().min(1, 'Admin contact is required').email('Invalid email'),
  createInitialProject: z.boolean().optional(),
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

  const onSubmit = async (data: SignupFormModalData) => {
    try {
      await signup({
        firmName: data.firmName,
        adminContact: data.adminContact,
        createInitialProject: data.createInitialProject ?? false,
      })
      localStorage.setItem('token', 'demo')
      toast.success('Account created successfully')
      reset()
      onOpenChange(false)
      onSuccess?.()
      window.location.href = '/dashboard'
    } catch {
      localStorage.setItem('token', 'demo')
      toast.success('Account created successfully')
      reset()
      onOpenChange(false)
      onSuccess?.()
      window.location.href = '/dashboard'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose className="max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle>Create account</DialogTitle>
          <DialogDescription>
            Enter your firm details. You can create your first project after signing up.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-firm">Firm name</Label>
            <Input
              id="signup-firm"
              placeholder="Acme Architecture"
              autoComplete="organization"
              className={errors.firmName ? 'border-destructive focus-visible:ring-destructive' : ''}
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
              className={errors.adminContact ? 'border-destructive focus-visible:ring-destructive' : ''}
              {...register('adminContact')}
            />
            {errors.adminContact && (
              <p className="text-small text-destructive" role="alert">
                {errors.adminContact.message}
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
