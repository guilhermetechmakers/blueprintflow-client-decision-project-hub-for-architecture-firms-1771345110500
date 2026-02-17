import { Search, X, FileCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Decision } from '@/types'
import type { DecisionListFilters, DecisionStatusFilter } from '@/api/decision-log'
import { DecisionCard } from './DecisionCard'

export interface DecisionListProps {
  decisions: Decision[]
  isLoading: boolean
  filters: DecisionListFilters | undefined
  onFiltersChange: (filters: DecisionListFilters | undefined) => void
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedId: string | null
  onSelectDecision: (id: string) => void
  onApproveClick: (decision: Decision) => void
  className?: string
}

const STATUS_OPTIONS: { value: DecisionStatusFilter; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'changes_requested', label: 'Requested changes' },
]

const PHASE_OPTIONS = [
  'Schematic Design',
  'Design Development',
  'Construction Documents',
  'Bidding',
  'Construction',
]

export function DecisionList({
  decisions,
  isLoading,
  filters,
  onFiltersChange,
  searchQuery,
  onSearchChange,
  selectedId,
  onSelectDecision,
  onApproveClick,
  className,
}: DecisionListProps) {
  const setFilter = <K extends keyof DecisionListFilters>(
    key: K,
    value: DecisionListFilters[K]
  ) => {
    const next = { ...filters }
    if (value === undefined || value === '') {
      delete next[key]
    } else {
      next[key] = value
    }
    onFiltersChange(Object.keys(next).length ? next : undefined)
  }

  const assigneeOptions = Array.from(
    new Map(
      decisions
        .filter((d) => d.assigneeId && d.assigneeName)
        .map((d) => [d.assigneeId!, d.assigneeName!])
    ).entries()
  ).map(([id, name]) => ({ id, name }))

  const hasFilters = Boolean(
    filters?.status || filters?.phase || filters?.assigneeId
  )

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search decisions..."
            className="pl-9 h-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search decisions"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter decisions">
          <span className="text-small text-muted-foreground font-medium">Status:</span>
          {STATUS_OPTIONS.map(({ value, label }) => (
            <Button
              key={value}
              variant={filters?.status === value ? 'accent' : 'secondary'}
              size="sm"
              className="h-8 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              onClick={() =>
                setFilter('status', filters?.status === value ? undefined : value)
              }
              aria-pressed={filters?.status === value}
            >
              <FileCheck className="size-3.5" />
              {label}
            </Button>
          ))}
          <span className="text-small text-muted-foreground font-medium mx-1">Phase:</span>
          <select
            className="h-8 rounded-md border border-input bg-background px-3 text-small font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0"
            value={filters?.phase ?? ''}
            onChange={(e) => setFilter('phase', e.target.value || undefined)}
            aria-label="Filter by phase"
          >
            <option value="">All phases</option>
            {PHASE_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <span className="text-small text-muted-foreground font-medium mx-1">Assignee:</span>
          <select
            className="h-8 rounded-md border border-input bg-background px-3 text-small font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0"
            value={filters?.assigneeId ?? ''}
            onChange={(e) => setFilter('assigneeId', e.target.value || undefined)}
            aria-label="Filter by assignee"
          >
            <option value="">All assignees</option>
            {assigneeOptions.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          {hasFilters && (
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
      </div>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2" aria-busy="true">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-4 shadow-card animate-pulse"
            >
              <div className="h-5 w-3/4 rounded bg-muted mb-2" />
              <div className="h-3 w-full rounded bg-muted mb-3" />
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded-full bg-muted" />
                <div className="h-6 w-20 rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 list-none p-0 m-0">
          {decisions.map((decision, index) => (
            <li
              key={decision.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <DecisionCard
                decision={decision}
                isSelected={selectedId === decision.id}
                onSelect={() => onSelectDecision(decision.id)}
                onApproveClick={() => onApproveClick(decision)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
