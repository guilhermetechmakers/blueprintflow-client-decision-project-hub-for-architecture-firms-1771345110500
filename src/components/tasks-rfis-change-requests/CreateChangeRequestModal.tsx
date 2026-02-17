import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ChangeRequest } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z
    .enum(['draft', 'submitted', 'under_review', 'approved', 'rejected'])
    .optional(),
  impactScope: z.string().optional(),
  costImpact: z.coerce.number().optional(),
  scheduleImpact: z.string().optional(),
  decisionId: z.string().optional(),
  milestoneId: z.string().optional(),
})

export type CreateChangeRequestFormValues = z.infer<typeof schema>

export interface CreateChangeRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CreateChangeRequestFormValues) => void
  isSubmitting: boolean
  initialValues?: ChangeRequest | null
}

export function CreateChangeRequestModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialValues,
}: CreateChangeRequestModalProps) {
  const isEdit = Boolean(initialValues?.id)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateChangeRequestFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? '',
      status: initialValues?.status ?? 'draft',
      impactScope: initialValues?.impactScope ?? '',
      costImpact: initialValues?.costImpact ?? undefined,
      scheduleImpact: initialValues?.scheduleImpact ?? '',
      decisionId: initialValues?.decisionId ?? '',
      milestoneId: initialValues?.milestoneId ?? '',
    },
  })

  const onOpenChangeWithReset = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeWithReset}>
      <DialogContent className="max-w-md" showClose>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit change request' : 'New change request'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the formal change request.'
              : 'Create a formal change request linked to a decision or milestone.'}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="cr-title">Title</Label>
            <Input
              id="cr-title"
              placeholder="e.g. Add powder room to scope"
              {...register('title')}
              className={errors.title ? 'border-destructive' : ''}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-small text-destructive" role="alert">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cr-description">Description (optional)</Label>
            <Input
              id="cr-description"
              placeholder="Summary of the change"
              {...register('description')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cr-status">Status</Label>
            <select
              id="cr-status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register('status')}
            >
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cr-impactScope">Impact scope (optional)</Label>
              <Input
                id="cr-impactScope"
                placeholder="e.g. MEP, finishes"
                {...register('impactScope')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cr-costImpact">Cost impact (optional)</Label>
              <Input
                id="cr-costImpact"
                type="number"
                step="0.01"
                placeholder="0"
                {...register('costImpact')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cr-scheduleImpact">Schedule impact (optional)</Label>
            <Input
              id="cr-scheduleImpact"
              placeholder="e.g. 2 weeks"
              {...register('scheduleImpact')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cr-decisionId">Decision ID (optional)</Label>
              <Input id="cr-decisionId" placeholder="UUID" {...register('decisionId')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cr-milestoneId">Milestone ID (optional)</Label>
              <Input id="cr-milestoneId" placeholder="UUID" {...register('milestoneId')} />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChangeWithReset(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create change request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
