import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  name: z.string().min(1, 'Project name required'),
  clientName: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function ProjectNew() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800))
    navigate(`/dashboard/projects/1/overview`)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-h1">New project</h1>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>Start from scratch or use a template later.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project name</Label>
              <Input id="name" placeholder="e.g. Riverside Residence" {...register('name')} />
              {errors.name && (
                <p className="text-small text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client name (optional)</Label>
              <Input id="clientName" placeholder="e.g. Acme Corp" {...register('clientName')} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating…' : 'Create project'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
