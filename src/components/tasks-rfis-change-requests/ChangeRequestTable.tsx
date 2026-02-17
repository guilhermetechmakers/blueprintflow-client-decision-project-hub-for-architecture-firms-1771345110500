import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  ChevronUp,
  FileCheck,
  Flag,
  FileEdit,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ChangeRequest } from '@/types'
import type {
  ChangeRequestListFilters,
  ChangeRequestStatusFilter,
} from '@/api/tasks-rfis-change-requests'

const STATUS_OPTIONS: { value: ChangeRequestStatusFilter; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export interface ChangeRequestTableProps {
  projectId: string
  changeRequests: ChangeRequest[]
  isLoading: boolean
  filters: ChangeRequestListFilters | undefined
  onFiltersChange: (f: ChangeRequestListFilters | undefined) => void
  onEdit: (cr: ChangeRequest) => void
  onDelete: (cr: ChangeRequest) => void
}

type SortKey = 'title' | 'status' | 'costImpact' | 'decisionTitle' | 'updated_at'

export function ChangeRequestTable({
  projectId,
  changeRequests,
  isLoading,
  filters,
  onFiltersChange,
  onEdit,
  onDelete,
}: ChangeRequestTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('updated_at')
  const [sortAsc, setSortAsc] = useState(false)

  const setFilter = <K extends keyof ChangeRequestListFilters>(
    key: K,
    value: ChangeRequestListFilters[K]
  ) => {
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

  const sortedList = useMemo(() => {
    const arr = [...changeRequests]
    arr.sort((a, b) => {
      let va: string | number | undefined
      let vb: string | number | undefined
      switch (sortKey) {
        case 'title':
          va = a.title
          vb = b.title
          break
        case 'status':
          va = a.status
          vb = b.status
          break
        case 'costImpact':
          va = a.costImpact ?? 0
          vb = b.costImpact ?? 0
          break
        case 'decisionTitle':
          va = a.decisionTitle
          vb = b.decisionTitle
          break
        default:
          va = a.updated_at
          vb = b.updated_at
      }
      const cmp =
        typeof va === 'number' && typeof vb === 'number'
          ? va - vb
          : String(va ?? '').localeCompare(String(vb ?? ''), undefined, { numeric: true })
      return sortAsc ? cmp : -cmp
    })
    return arr
  }, [changeRequests, sortKey, sortAsc])

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
                  <th className="text-left p-3 font-medium">Impact</th>
                  <th className="text-left p-3 font-medium">Linked to</th>
                  <th className="w-24 p-3" aria-hidden />
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-3"><Skeleton className="h-5 w-44" /></td>
                    <td className="p-3"><Skeleton className="h-6 w-24" /></td>
                    <td className="p-3"><Skeleton className="h-5 w-20" /></td>
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
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter change requests">
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
            <FileEdit className="size-3.5" />
            {label}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-body" role="grid" aria-label="Change requests">
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
                  <th className="text-left p-3 font-semibold">
                    <button
                      type="button"
                      className="inline-flex items-center hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      onClick={() => toggleSort('costImpact')}
                    >
                      Cost impact
                      <SortIcon column="costImpact" />
                    </button>
                  </th>
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
                {sortedList.map((cr) => (
                  <tr
                    key={cr.id}
                    className="border-b border-border/50 transition-colors hover:bg-muted/30"
                  >
                    <td className="p-3">
                      <span className="font-medium text-foreground">{cr.title}</span>
                      {cr.description && (
                        <p className="text-small text-muted-foreground mt-0.5 line-clamp-1">
                          {cr.description}
                        </p>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          cr.status === 'approved'
                            ? 'default'
                            : cr.status === 'rejected'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className="transition-all duration-200"
                      >
                        {cr.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {cr.costImpact != null ? `$${Number(cr.costImpact).toLocaleString()}` : '—'}
                      {cr.scheduleImpact && (
                        <span className="block text-small">{cr.scheduleImpact}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {cr.decisionId && (
                          <Link
                            to={`/dashboard/projects/${projectId}/decisions`}
                            className="inline-flex items-center gap-1 text-small text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                          >
                            <FileCheck className="size-3.5" />
                            {cr.decisionTitle ?? 'Decision'}
                          </Link>
                        )}
                        {cr.milestoneId && (
                          <Link
                            to={`/dashboard/projects/${projectId}/timeline`}
                            className="inline-flex items-center gap-1 text-small text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                          >
                            <Flag className="size-3.5" />
                            {cr.milestoneTitle ?? 'Milestone'}
                          </Link>
                        )}
                        {!cr.decisionId && !cr.milestoneId && '—'}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="tertiary"
                          size="icon"
                          className="size-8"
                          onClick={() => onEdit(cr)}
                          aria-label={`Edit ${cr.title}`}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="tertiary"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => onDelete(cr)}
                          aria-label={`Delete ${cr.title}`}
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
