import { useParams } from 'react-router-dom'
import { CalendarDays, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useProject } from '@/hooks/use-projects'

export function Meetings() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: project } = useProject(projectId)

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-h1">Meetings & agendas</h1>
        <Button>
          <Plus className="size-4" />
          New meeting
        </Button>
      </div>

      <p className="text-body text-muted-foreground">
        Agendas, notes, and action items for {project?.name ?? 'this project'}.
      </p>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <CalendarDays className="size-12 text-muted-foreground mb-4" />
          <p className="text-body text-muted-foreground text-center mb-4">
            No meetings scheduled. Create an agenda and send calendar invites.
          </p>
          <Button>
            <Plus className="size-4" />
            Create meeting
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
