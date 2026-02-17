import { Link, useParams } from 'react-router-dom'
import { FileCheck, FileText, MessageSquare, CheckSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useProject } from '@/hooks/use-projects'

const quickLinks = [
  { to: 'decisions', label: 'Decisions', icon: FileCheck },
  { to: 'documents', label: 'Documents', icon: FileText },
  { to: 'messages', label: 'Messages', icon: MessageSquare },
  { to: 'tasks', label: 'Tasks', icon: CheckSquare },
]

export function ProjectOverview() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: project } = useProject(projectId)

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-h1 mb-1">{project?.name ?? 'Project overview'}</h1>
        {project?.clientName && (
          <p className="text-body text-muted-foreground">{project.clientName}</p>
        )}
      </div>

      <section>
        <h2 className="text-h3 font-semibold mb-4">Quick access</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map(({ to, label, icon: Icon }) => (
            <Button
              key={to}
              variant="secondary"
              className="h-auto flex flex-col items-start gap-2 p-4 text-left"
              asChild
            >
              <Link to={`/dashboard/projects/${projectId}/${to}`}>
                <Icon className="size-5 text-primary" />
                <span>{label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h3 font-semibold mb-4">Recent activity</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-body text-muted-foreground text-center py-8">
              Activity for this project will appear here.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
