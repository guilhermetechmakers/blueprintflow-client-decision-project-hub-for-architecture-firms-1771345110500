import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useProject } from '@/hooks/use-projects'

const MOCK_PHASES = [
  {
    id: '1',
    name: 'Schematic Design',
    startDate: '2025-01-01',
    endDate: '2025-02-28',
    milestones: [
      { id: 'm1', title: 'Concept approval', dueDate: '2025-01-15', status: 'done' as const },
      { id: 'm2', title: 'SD set complete', dueDate: '2025-02-28', status: 'in_progress' as const },
    ],
  },
  {
    id: '2',
    name: 'Design Development',
    startDate: '2025-03-01',
    endDate: '2025-04-30',
    milestones: [
      { id: 'm3', title: 'DD kickoff', dueDate: '2025-03-01', status: 'pending' as const },
      { id: 'm4', title: 'DD set complete', dueDate: '2025-04-30', status: 'pending' as const },
    ],
  },
]

export function ProjectTimeline() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: project } = useProject(projectId)

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-h1">Timeline</h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Gantt</Button>
          <Button variant="secondary" size="sm">Compact</Button>
        </div>
      </div>

      <p className="text-body text-muted-foreground">
        Phases and milestones for {project?.name ?? 'this project'}.
      </p>

      <div className="space-y-6">
        {MOCK_PHASES.map((phase) => (
          <Card key={phase.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-h3">{phase.name}</CardTitle>
              <span className="text-small text-muted-foreground">
                {phase.startDate} – {phase.endDate}
              </span>
            </CardHeader>
            <CardContent className="space-y-3">
              {phase.milestones.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-md border border-border p-3"
                >
                  <span className="font-medium">{m.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-small text-muted-foreground">{m.dueDate}</span>
                    <Badge
                      variant={
                        m.status === 'done'
                          ? 'success'
                          : m.status === 'in_progress'
                            ? 'accent'
                            : 'secondary'
                      }
                    >
                      {m.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
