import { Link, useLocation } from 'react-router-dom'
import { useSidebar } from '@/contexts/sidebar-context'
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const mainNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { to: '/dashboard/project-list', label: 'Project list', icon: ListTodo },
]

const bottomNav = [
  { to: '/dashboard/profile', label: 'Profile', icon: User },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/help', label: 'Help', icon: HelpCircle },
]

export function AppSidebar() {
  const { collapsed, toggle } = useSidebar()
  const location = useLocation()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300 flex flex-col',
        collapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      <div className="flex h-14 items-center border-b border-border px-3">
        {!collapsed && (
          <Link to="/dashboard" className="font-semibold text-primary text-h3">
            BlueprintFlow
          </Link>
        )}
      </div>
      <nav className="flex-1 flex flex-col gap-1 p-2">
        {mainNav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2.5 text-body font-medium transition-colors hover:bg-accent/10 hover:text-accent',
              location.pathname === to || location.pathname.startsWith(to + '/')
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground'
            )}
          >
            <Icon className="size-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border p-2 space-y-1">
        {bottomNav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2.5 text-body text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent',
              location.pathname === to ? 'bg-accent/10 text-accent' : ''
            )}
          >
            <Icon className="size-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
        <Button
          variant="tertiary"
          size="icon"
          className="w-full mt-2"
          onClick={toggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>
    </aside>
  )
}
