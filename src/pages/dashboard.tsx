import { Link } from 'react-router-dom'
import { FolderKanban, FileCheck, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjects } from '@/hooks/use-projects'

export function Dashboard() {
  const { data: projects, isLoading } = useProjects()

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-h1">Dashboard</h1>
        <Button asChild>
          <Link to="/dashboard/projects/new">New project</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <section>
            <h2 className="text-h3 font-semibold mb-4">Recent projects</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects?.map((project) => (
                <Link key={project.id} to={`/dashboard/projects/${project.id}/overview`}>
                  <Card className="h-full transition-all duration-200 hover:shadow-card-hover hover:scale-[1.01]">
                    <CardHeader className="flex flex-row items-start justify-between gap-2">
                      <FolderKanban className="size-5 text-primary shrink-0 mt-0.5" />
                      <Badge
                        variant={
                          project.status === 'active'
                            ? 'accent'
                            : project.status === 'completed'
                              ? 'secondary'
                              : 'warning'
                        }
                      >
                        {project.status}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-body font-semibold mb-1">
                        {project.name}
                      </CardTitle>
                      {project.clientName && (
                        <p className="text-small text-muted-foreground mb-2">
                          {project.clientName}
                        </p>
                      )}
                      {project.pendingApprovals !== undefined && project.pendingApprovals > 0 && (
                        <div className="flex items-center gap-1.5 text-small text-warning">
                          <FileCheck className="size-3.5" />
                          {project.pendingApprovals} pending approval{project.pendingApprovals !== 1 ? 's' : ''}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-h3 font-semibold mb-4">Activity</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Clock className="size-10 mb-2 opacity-50" />
                  <p className="text-body">Recent activity will appear here.</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  )
}
