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
import type { ProjectTask } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  dueDate: z.string().optional(),
  decisionId: z.string().optional(),
  milestoneId: z.string().optional(),
})

export type CreateTaskFormValues = z.infer<typeof schema>

export interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CreateTaskFormValues) => void
  isSubmitting: boolean
  initialValues?: ProjectTask | null
}

export function CreateTaskModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialValues,
}: CreateTaskModalProps) {
  const isEdit = Boolean(initialValues?.id)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? '',
      status: initialValues?.status ?? 'todo',
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
          <DialogTitle>{isEdit ? 'Edit task' : 'New task'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the action item details.'
              : 'Create an action item linked to a decision or milestone.'}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              placeholder="e.g. Review kitchen drawings"
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
            <Label htmlFor="task-description">Description (optional)</Label>
            <Input
              id="task-description"
              placeholder="Additional context"
              {...register('description')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-status">Status</Label>
              <select
                id="task-status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('status')}
              >
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-dueDate">Due date (optional)</Label>
              <Input id="task-dueDate" type="date" {...register('dueDate')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-decisionId">Decision ID (optional)</Label>
              <Input
                id="task-decisionId"
                placeholder="UUID"
                {...register('decisionId')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-milestoneId">Milestone ID (optional)</Label>
              <Input
                id="task-milestoneId"
                placeholder="UUID"
                {...register('milestoneId')}
              />
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
              {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
