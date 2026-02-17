import { Link } from 'react-router-dom'
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
import { cn } from '@/lib/utils'

export interface TopBarProps {
  className?: string
  /** Optional search value for controlled mode */
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
}

export function TopBar({
  className,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search projects, clients...',
}: TopBarProps) {
  const { user } = useAuth()

  return (
    <header
      className={cn(
        'flex h-14 items-center gap-4 border-b border-border bg-card px-4 md:px-6',
        className
      )}
    >
      <div className="flex-1 flex items-center gap-4 min-w-0">
        <div className="relative w-full max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
            aria-hidden
          />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="pl-9 h-9 bg-muted/50 border-border focus:bg-card transition-colors"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            aria-label="Global search"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="accent"
          size="sm"
          className="shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          asChild
        >
          <Link to="/dashboard/projects/new">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Quick create</span>
          </Link>
        </Button>
        <Button
          variant="tertiary"
          size="icon"
          className="size-10 rounded-full"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Button>
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
