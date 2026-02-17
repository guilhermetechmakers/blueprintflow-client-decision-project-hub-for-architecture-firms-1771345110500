import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type {
  ProjectListRole,
  ProjectListStatusFilter,
  DashboardProjectListFilters,
} from '@/hooks/use-dashboard-project-list'
import { User, Archive, Clock, X } from 'lucide-react'

export interface QuickFiltersProps {
  filters: DashboardProjectListFilters | undefined
  onFiltersChange: (filters: DashboardProjectListFilters | undefined) => void
  className?: string
}

const ROLES: { value: ProjectListRole; label: string; icon: typeof User }[] = [
  { value: 'owner', label: 'Owner', icon: User },
  { value: 'member', label: 'Member', icon: User },
  { value: 'client', label: 'Client', icon: User },
]

const STATUSES: { value: ProjectListStatusFilter; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
]

export function QuickFilters({
  filters,
  onFiltersChange,
  className,
}: QuickFiltersProps) {
  const setFilter = <K extends keyof DashboardProjectListFilters>(
    key: K,
    value: DashboardProjectListFilters[K]
  ) => {
    const next = { ...filters }
    if (value === undefined || value === false) {
      delete next[key]
    } else {
      next[key] = value
    }
    onFiltersChange(Object.keys(next).length ? next : undefined)
  }

  const hasAny = Boolean(
    filters?.role || filters?.status || filters?.dueSoon
  )

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2',
        className
      )}
      role="group"
      aria-label="Filter projects"
    >
      <span className="text-small text-muted-foreground font-medium mr-1">
        Role:
      </span>
      {ROLES.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={filters?.role === value ? 'accent' : 'secondary'}
          size="sm"
          className="h-8 transition-all hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => setFilter('role', filters?.role === value ? undefined : value)}
          aria-pressed={filters?.role === value}
        >
          <Icon className="size-3.5" />
          {label}
        </Button>
      ))}
      <span className="text-small text-muted-foreground font-medium mx-2">
        Status:
      </span>
      {STATUSES.map(({ value, label }) => (
        <Button
          key={value}
          variant={filters?.status === value ? 'accent' : 'secondary'}
          size="sm"
          className="h-8 transition-all hover:scale-[1.02] active:scale-[0.98]"
          onClick={() =>
            setFilter('status', filters?.status === value ? undefined : value)
          }
          aria-pressed={filters?.status === value}
        >
          {value === 'archived' && <Archive className="size-3.5 mr-1" />}
          {label}
        </Button>
      ))}
      <Button
        variant={filters?.dueSoon ? 'accent' : 'secondary'}
        size="sm"
        className="h-8 transition-all hover:scale-[1.02] active:scale-[0.98]"
        onClick={() => setFilter('dueSoon', !filters?.dueSoon)}
        aria-pressed={filters?.dueSoon}
      >
        <Clock className="size-3.5" />
        Due soon
      </Button>
      {hasAny && (
        <Button
          variant="tertiary"
          size="sm"
          className="h-8 text-muted-foreground"
          onClick={() => onFiltersChange(undefined)}
          aria-label="Clear filters"
        >
          <X className="size-3.5" />
          Clear
        </Button>
      )}
    </div>
  )
}
