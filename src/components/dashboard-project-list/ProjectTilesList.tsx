import { Link } from 'react-router-dom'
import { FolderKanban, FileCheck, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

export interface ProjectTilesListProps {
  projects: Project[] | undefined
  isLoading: boolean
  className?: string
}

function statusVariant(
  status: Project['status']
): 'default' | 'secondary' | 'warning' | 'accent' | 'outline' {
  switch (status) {
    case 'active':
      return 'accent'
    case 'completed':
      return 'secondary'
    case 'archived':
      return 'outline'
    case 'on_hold':
      return 'warning'
    default:
      return 'default'
  }
}

function PhaseTimeline({ phase }: { phase?: string }) {
  if (!phase) return null
  return (
    <div className="flex items-center gap-1.5 text-small text-muted-foreground">
      <Calendar className="size-3.5 shrink-0" aria-hidden />
      <span>{phase}</span>
    </div>
  )
}

function PercentComplete({ value }: { value?: number }) {
  if (value === undefined) return null
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <span className="text-small font-medium text-foreground w-8">{value}%</span>
    </div>
  )
}

export function ProjectTilesList({
  projects,
  isLoading,
  className,
}: ProjectTilesListProps) {
  if (isLoading) {
    return (
      <div
        className={cn('grid gap-4 md:grid-cols-2 xl:grid-cols-3', className)}
        aria-busy="true"
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex-row items-start justify-between gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-2 w-full rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!projects?.length) {
    return (
      <div
        className={cn(
          'rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center animate-fade-in',
          className
        )}
      >
        <FolderKanban className="size-12 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-body font-medium text-foreground">No projects match your filters</p>
        <p className="text-small text-muted-foreground mt-1">
          Try changing filters or create a new project.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn('grid gap-4 md:grid-cols-2 xl:grid-cols-3', className)}
      role="list"
    >
      {projects.map((project, index) => (
        <Link
          key={project.id}
          to={`/dashboard/projects/${project.id}/overview`}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <Card
            className="h-full transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02] hover:border-primary/20 active:scale-[0.99]"
            role="listitem"
          >
            <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
              <div className="flex items-start gap-2 min-w-0">
                <FolderKanban className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-body font-semibold truncate">{project.name}</p>
                  {project.clientName && (
                    <p className="text-small text-muted-foreground truncate">
                      {project.clientName}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant={statusVariant(project.status)} className="shrink-0">
                {project.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <PhaseTimeline phase={project.phase} />
              <PercentComplete value={project.percentComplete} />
              {project.pendingApprovals !== undefined && project.pendingApprovals > 0 && (
                <div className="flex items-center gap-1.5 text-small text-warning font-medium">
                  <FileCheck className="size-3.5 shrink-0" aria-hidden />
                  {project.pendingApprovals} pending approval
                  {project.pendingApprovals !== 1 ? 's' : ''}
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
