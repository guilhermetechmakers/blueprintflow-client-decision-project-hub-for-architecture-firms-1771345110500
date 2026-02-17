import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProject } from '@/hooks/use-projects'

export function ProjectSettings() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: project } = useProject(projectId)

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <h1 className="text-h1">Project settings</h1>
      <p className="text-body text-muted-foreground">
        Team, permissions, and templates for {project?.name ?? 'this project'}.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Team & permissions</CardTitle>
          <CardDescription>Manage who has access and their roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary">Invite member</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project details</CardTitle>
          <CardDescription>Name and client.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project name</Label>
            <Input id="name" defaultValue={project?.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client">Client name</Label>
            <Input id="client" defaultValue={project?.clientName} />
          </div>
          <Button>Save</Button>
        </CardContent>
      </Card>
    </div>
  )
}
