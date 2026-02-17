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
import { Plus, Trash2, Upload, FileText, Link as LinkIcon, Loader2 } from 'lucide-react'

const optionSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  costDelta: z.coerce.number().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  pdfUrl: z.string().url().optional().or(z.literal('')),
  specLink: z.string().url().optional().or(z.literal('')),
})

const schema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  phase: z.string().optional(),
  assigneeId: z.string().optional(),
  template: z.string().optional(),
  options: z.array(optionSchema).min(1, 'Add at least one option'),
  recommendedOptionIndex: z.coerce.number().min(0).optional(),
  recommendationText: z.string().optional(),
})

export type CreateDecisionFormValues = z.infer<typeof schema>

const TEMPLATES: { id: string; label: string; title: string; description: string }[] = [
  { id: 'material', label: 'Material selection', title: 'Material selection', description: 'Choose material and finish.' },
  { id: 'finish', label: 'Finish options', title: 'Finish options', description: 'Select finish and color.' },
  { id: 'fixture', label: 'Fixture selection', title: 'Fixture selection', description: 'Choose fixtures and fittings.' },
  { id: 'custom', label: 'Blank', title: '', description: '' },
]

export interface CreateDecisionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CreateDecisionFormValues) => void
  isSubmitting: boolean
  projectId: string | undefined
}

export function CreateDecisionModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  projectId: _projectId,
}: CreateDecisionModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateDecisionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      phase: '',
      assigneeId: '',
      options: [{ title: '', description: '', costDelta: undefined }],
      recommendedOptionIndex: 0,
      recommendationText: '',
      template: 'custom',
    },
  })

  const options = watch('options')
  const templateId = watch('template')
  const recommendedOptionIndex = watch('recommendedOptionIndex') ?? 0

  const applyTemplate = (template: (typeof TEMPLATES)[number]) => {
    if (template.id === 'custom') {
      setValue('title', '')
      setValue('description', '')
    } else {
      setValue('title', template.title)
      setValue('description', template.description)
    }
    setValue('template', template.id)
  }

  const addOption = () => {
    setValue('options', [...options, { title: '', description: '', costDelta: undefined }])
  }

  const removeOption = (index: number) => {
    if (options.length <= 1) return
    const next = options.filter((_, i) => i !== index)
    setValue('options', next)
    if (recommendedOptionIndex >= next.length) {
      setValue('recommendedOptionIndex', Math.max(0, next.length - 1))
    }
  }

  const onFormSubmit = (values: CreateDecisionFormValues) => {
    onSubmit(values)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create decision</DialogTitle>
          <DialogDescription>
            Add a new decision with options for the client to review and approve.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Template */}
          <div className="space-y-2">
            <Label>Template</Label>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t) => (
                <Button
                  key={t.id}
                  type="button"
                  variant={templateId === t.id ? 'accent' : 'secondary'}
                  size="sm"
                  className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => applyTemplate(t)}
                >
                  {t.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="create-decision-title">Title</Label>
              <Input
                id="create-decision-title"
                placeholder="e.g. Kitchen finish options"
                {...register('title')}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-small text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-decision-phase">Phase</Label>
              <Input
                id="create-decision-phase"
                placeholder="e.g. Design Development"
                {...register('phase')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-decision-description">Description</Label>
            <Input
              id="create-decision-description"
              placeholder="Short description of the decision"
              {...register('description')}
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button type="button" variant="secondary" size="sm" onClick={addOption}>
                <Plus className="size-4" />
                Add option
              </Button>
            </div>
            {errors.options?.root && (
              <p className="text-small text-destructive">{errors.options.root.message}</p>
            )}
            <div className="space-y-4 rounded-lg border border-border p-4 bg-muted/20">
              {options.map((_, index) => (
                <div
                  key={index}
                  className="space-y-2 rounded-lg border border-border bg-card p-3 animate-fade-in"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-small font-medium">Option {index + 1}</span>
                    <div className="flex items-center gap-1">
                      <Label className="text-small text-muted-foreground mr-1">
                        Recommended
                      </Label>
                      <input
                        type="radio"
                        name="recommendedOptionIndex"
                        value={index}
                        checked={recommendedOptionIndex === index}
                        onChange={() => setValue('recommendedOptionIndex', index)}
                        className="h-4 w-4 accent-primary"
                        aria-label={`Set option ${index + 1} as recommended`}
                      />
                      <Button
                        type="button"
                        variant="tertiary"
                        size="icon"
                        className="size-8 text-muted-foreground"
                        onClick={() => removeOption(index)}
                        disabled={options.length <= 1}
                        aria-label={`Remove option ${index + 1}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      placeholder="Option title"
                      {...register(`options.${index}.title`)}
                      className={errors.options?.[index]?.title ? 'border-destructive' : ''}
                    />
                    <Input
                      type="number"
                      placeholder="Cost delta ($)"
                      {...register(`options.${index}.costDelta`)}
                    />
                  </div>
                  <Input
                    placeholder="Short description"
                    {...register(`options.${index}.description`)}
                    className="text-small"
                  />
                  <div className="flex flex-wrap gap-2">
                    <div className="relative flex-1 min-w-[140px]">
                      <Upload className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <Input
                        placeholder="Image URL"
                        className="pl-8 text-small"
                        {...register(`options.${index}.imageUrl`)}
                      />
                    </div>
                    <div className="relative flex-1 min-w-[140px]">
                      <FileText className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <Input
                        placeholder="PDF URL"
                        className="pl-8 text-small"
                        {...register(`options.${index}.pdfUrl`)}
                      />
                    </div>
                    <div className="relative flex-1 min-w-[140px]">
                      <LinkIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <Input
                        placeholder="Spec link"
                        className="pl-8 text-small"
                        {...register(`options.${index}.specLink`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-decision-recommendation">Recommendation (optional)</Label>
            <Input
              id="create-decision-recommendation"
              placeholder="Why you recommend the selected option"
              {...register('recommendationText')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Create decision
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
