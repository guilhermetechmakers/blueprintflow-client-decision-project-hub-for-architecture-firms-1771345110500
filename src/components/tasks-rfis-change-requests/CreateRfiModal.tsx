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
import { Textarea } from '@/components/ui/textarea'
import type { Rfi } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  question: z.string().min(1, 'Question is required'),
  status: z.enum(['open', 'answered', 'closed']).optional(),
  dueDate: z.string().optional(),
  decisionId: z.string().optional(),
  milestoneId: z.string().optional(),
})

export type CreateRfiFormValues = z.infer<typeof schema>

export interface CreateRfiModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CreateRfiFormValues) => void
  isSubmitting: boolean
  initialValues?: Rfi | null
}

export function CreateRfiModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialValues,
}: CreateRfiModalProps) {
  const isEdit = Boolean(initialValues?.id)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateRfiFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? '',
      question: initialValues?.question ?? '',
      status: initialValues?.status ?? 'open',
      dueDate: initialValues?.dueDate?.slice(0, 10) ?? '',
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
          <DialogTitle>{isEdit ? 'Edit RFI' : 'New RFI'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the request for information.'
              : 'Create a request for information linked to a decision or milestone.'}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="rfi-title">Title</Label>
            <Input
              id="rfi-title"
              placeholder="e.g. Cladding attachment details"
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
            <Label htmlFor="rfi-question">Question</Label>
            <Textarea
              id="rfi-question"
              placeholder="What information do you need?"
              rows={3}
              {...register('question')}
              className={errors.question ? 'border-destructive' : ''}
              aria-invalid={!!errors.question}
            />
            {errors.question && (
              <p className="text-small text-destructive" role="alert">
                {errors.question.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="rfi-description">Description (optional)</Label>
            <Input id="rfi-description" placeholder="Context" {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rfi-status">Status</Label>
              <select
                id="rfi-status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('status')}
              >
                <option value="open">Open</option>
                <option value="answered">Answered</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rfi-dueDate">Due date (optional)</Label>
              <Input id="rfi-dueDate" type="date" {...register('dueDate')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rfi-decisionId">Decision ID (optional)</Label>
              <Input id="rfi-decisionId" placeholder="UUID" {...register('decisionId')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rfi-milestoneId">Milestone ID (optional)</Label>
              <Input id="rfi-milestoneId" placeholder="UUID" {...register('milestoneId')} />
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
              {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create RFI'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
