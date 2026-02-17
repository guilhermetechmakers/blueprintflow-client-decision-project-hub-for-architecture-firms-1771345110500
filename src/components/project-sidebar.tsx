import { Link, useParams, useLocation } from 'react-router-dom'
import {
  LayoutGrid,
  Calendar,
  FileCheck,
  FileText,
  MessageSquare,
  MessageCircle,
  CalendarDays,
  CheckSquare,
  BarChart3,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProject } from '@/hooks/use-projects'

const navItems = [
  { to: 'overview', label: 'Overview', icon: LayoutGrid },
  { to: 'timeline', label: 'Timeline', icon: Calendar },
  { to: 'decisions', label: 'Decisions', icon: FileCheck },
  { to: 'documents', label: 'Documents', icon: FileText },
  { to: 'messages', label: 'Messages', icon: MessageSquare },
  { to: 'messages-contextual-communication', label: 'Contextual messages', icon: MessageCircle },
  { to: 'meetings', label: 'Meetings', icon: CalendarDays },
  { to: 'tasks', label: 'Tasks', icon: CheckSquare },
  { to: 'reports', label: 'Reports', icon: BarChart3 },
  { to: 'settings', label: 'Settings', icon: Settings },
]

export function ProjectSidebar() {
  const { projectId } = useParams<{ projectId: string }>()
  const location = useLocation()
  const { data: project } = useProject(projectId)
  const base = `/dashboard/projects/${projectId}`

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-card min-h-0 flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-h3 font-semibold truncate" title={project?.name}>
          {project?.name ?? 'Project'}
        </h2>
        {project?.clientName && (
          <p className="text-small text-muted-foreground truncate">{project.clientName}</p>
        )}
      </div>
      <nav className="flex-1 p-2 space-y-0.5 overflow-auto">
        {navItems.map(({ to, label, icon: Icon }) => {
          const path = `${base}/${to}`
          const active =
            location.pathname === path || location.pathname.startsWith(path + '/')
          return (
            <Link
              key={to}
              to={path}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-body font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
