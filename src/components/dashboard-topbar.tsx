import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useSidebar } from '@/contexts/sidebar-context'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { CreateProjectCTA } from '@/components/dashboard-project-list'
import { NotificationsDropdown } from '@/components/notifications/NotificationsDropdown'

const PROJECT_LIST_PATH = '/dashboard/project-list'

export function DashboardTopbar() {
  const { width: sidebarWidth } = useSidebar()
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isProjectList = location.pathname === PROJECT_LIST_PATH
  const globalSearch = isProjectList ? (searchParams.get('q') ?? '') : ''

  const handleSearchChange = (value: string) => {
    if (!isProjectList) return
    const next = new URLSearchParams(searchParams)
    if (value.trim()) next.set('q', value.trim())
    else next.delete('q')
    navigate({ pathname: location.pathname, search: next.toString() }, { replace: true })
  }

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-card px-6"
      style={{ marginLeft: sidebarWidth }}
    >
      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Search projects, clients..."
            className="pl-9 h-9 bg-muted/50 border-border focus:bg-card transition-colors"
            aria-label="Global search"
            value={isProjectList ? globalSearch : undefined}
            onChange={isProjectList ? (e) => handleSearchChange(e.target.value) : undefined}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <CreateProjectCTA variant="dropdown" className="shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all" />
        <NotificationsDropdown />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="tertiary"
              size="icon"
              className="size-10 rounded-full overflow-hidden"
              aria-label="User menu"
            >
              <span className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-body">
                {user?.name?.charAt(0) ?? 'U'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/login">Sign out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
