import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, FileCheck, Flag, HelpCircle, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Rfi } from '@/types'
import type { RfiListFilters, RfiStatusFilter } from '@/api/tasks-rfis-change-requests'

const STATUS_OPTIONS: { value: RfiStatusFilter; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'answered', label: 'Answered' },
  { value: 'closed', label: 'Closed' },
]

export interface RfiTableProps {
  projectId: string
  rfis: Rfi[]
  isLoading: boolean
  filters: RfiListFilters | undefined
  onFiltersChange: (f: RfiListFilters | undefined) => void
  onEdit: (rfi: Rfi) => void
  onDelete: (rfi: Rfi) => void
}

type SortKey = 'title' | 'status' | 'dueDate' | 'decisionTitle' | 'updated_at'

export function RfiTable({
  projectId,
  rfis,
  isLoading,
  filters,
  onFiltersChange,
  onEdit,
  onDelete,
}: RfiTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('updated_at')
  const [sortAsc, setSortAsc] = useState(false)

  const setFilter = <K extends keyof RfiListFilters>(key: K, value: RfiListFilters[K]) => {
    const next = { ...filters }
    if (value === undefined || value === '') {
      delete next[key]
    } else {
      next[key] = value
    }
    onFiltersChange(Object.keys(next).length ? next : undefined)
  }

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((a) => !a)
    else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  const sortedRfis = useMemo(() => {
    const arr = [...rfis]
    arr.sort((a, b) => {
      let va: string | undefined
      let vb: string | undefined
      switch (sortKey) {
        case 'title':
          va = a.title
          vb = b.title
          break
        case 'status':
          va = a.status
          vb = b.status
          break
        case 'dueDate':
          va = a.dueDate
          vb = b.dueDate
          break
        case 'decisionTitle':
          va = a.decisionTitle
          vb = b.decisionTitle
          break
        default:
          va = a.updated_at
          vb = b.updated_at
      }
      const cmp = (va ?? '').localeCompare(vb ?? '', undefined, { numeric: true })
      return sortAsc ? cmp : -cmp
    })
    return arr
  }, [rfis, sortKey, sortAsc])

  const SortIcon = ({ column }: { column: SortKey }) =>
    sortKey === column ? (
      sortAsc ? (
        <ChevronUp className="size-4 inline ml-0.5" aria-hidden />
      ) : (
        <ChevronDown className="size-4 inline ml-0.5" aria-hidden />
      )
    ) : null

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-body">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium">Title</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Question</th>
                  <th className="text-left p-3 font-medium">Linked to</th>
                  <th className="w-24 p-3" aria-hidden />
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-3"><Skeleton className="h-5 w-36" /></td>
                    <td className="p-3"><Skeleton className="h-6 w-16" /></td>
                    <td className="p-3"><Skeleton className="h-5 w-48" /></td>
                    <td className="p-3"><Skeleton className="h-5 w-28" /></td>
                    <td className="p-3" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter RFIs">
        <span className="text-small text-muted-foreground font-medium">Status:</span>
        {STATUS_OPTIONS.map(({ value, label }) => (
          <Button
            key={value}
            variant={filters?.status === value ? 'accent' : 'secondary'}
            size="sm"
            className="h-8 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => setFilter('status', filters?.status === value ? undefined : value)}
            aria-pressed={filters?.status === value}
          >
            <HelpCircle className="size-3.5" />
            {label}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-body" role="grid" aria-label="RFIs">
              <thead className="sticky top-0 z-10 bg-card border-b border-border">
                <tr>
                  <th className="text-left p-3 font-semibold">
                    <button
                      type="button"
                      className="inline-flex items-center hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      onClick={() => toggleSort('title')}
                    >
                      Title
                      <SortIcon column="title" />
                    </button>
                  </th>
                  <th className="text-left p-3 font-semibold">
                    <button
                      type="button"
                      className="inline-flex items-center hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      onClick={() => toggleSort('status')}
                    >
                      Status
                      <SortIcon column="status" />
                    </button>
                  </th>
                  <th className="text-left p-3 font-semibold min-w-[200px]">Question</th>
                  <th className="text-left p-3 font-semibold">
                    <button
                      type="button"
                      className="inline-flex items-center hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      onClick={() => toggleSort('decisionTitle')}
                    >
                      Linked to
                      <SortIcon column="decisionTitle" />
                    </button>
                  </th>
                  <th className="w-24 p-3 text-right font-semibold" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedRfis.map((rfi) => (
                  <tr
                    key={rfi.id}
                    className="border-b border-border/50 transition-colors hover:bg-muted/30"
                  >
                    <td className="p-3">
                      <span className="font-medium text-foreground">{rfi.title}</span>
                      {rfi.dueDate && (
                        <p className="text-small text-muted-foreground mt-0.5">
                          Due {new Date(rfi.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={rfi.status === 'closed' ? 'secondary' : 'default'}
                        className={cn(
                          rfi.status === 'open' && 'bg-warning/90 text-primary-foreground',
                          'transition-all duration-200'
                        )}
                      >
                        {rfi.status === 'open' && 'Open'}
                        {rfi.status === 'answered' && 'Answered'}
                        {rfi.status === 'closed' && 'Closed'}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      <span className="line-clamp-2">{rfi.question}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {rfi.decisionId && (
                          <Link
                            to={`/dashboard/projects/${projectId}/decisions`}
                            className="inline-flex items-center gap-1 text-small text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                          >
                            <FileCheck className="size-3.5" />
                            {rfi.decisionTitle ?? 'Decision'}
                          </Link>
                        )}
                        {rfi.milestoneId && (
                          <Link
                            to={`/dashboard/projects/${projectId}/timeline`}
                            className="inline-flex items-center gap-1 text-small text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                          >
                            <Flag className="size-3.5" />
                            {rfi.milestoneTitle ?? 'Milestone'}
                          </Link>
                        )}
                        {!rfi.decisionId && !rfi.milestoneId && '—'}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="tertiary"
                          size="icon"
                          className="size-8"
                          onClick={() => onEdit(rfi)}
                          aria-label={`Edit ${rfi.title}`}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="tertiary"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => onDelete(rfi)}
                          aria-label={`Delete ${rfi.title}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
