import { Link } from 'react-router-dom'
import { useSidebar } from '@/contexts/sidebar-context'
import { Search, Bell, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'

export function DashboardTopbar() {
  const { width: sidebarWidth } = useSidebar()
  const { user } = useAuth()

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-card px-6"
      style={{ marginLeft: sidebarWidth }}
    >
      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search projects..." className="pl-9 h-9" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="accent" size="sm" asChild>
          <Link to="/dashboard/projects/new">
            <Plus className="size-4" />
            New project
          </Link>
        </Button>
        <Button variant="tertiary" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="tertiary" size="icon" className="rounded-full">
              <span className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
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
