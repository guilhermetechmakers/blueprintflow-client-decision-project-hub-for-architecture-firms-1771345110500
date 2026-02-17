import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckSquare,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Flag,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ProjectTask } from '@/types'
import type { TaskListFilters, ProjectTaskStatusFilter } from '@/api/tasks-rfis-change-requests'

const STATUS_OPTIONS: { value: ProjectTaskStatusFilter; label: string }[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
]

export interface TaskTableProps {
  projectId: string
  tasks: ProjectTask[]
  isLoading: boolean
  filters: TaskListFilters | undefined
  onFiltersChange: (f: TaskListFilters | undefined) => void
  onEdit: (task: ProjectTask) => void
  onDelete: (task: ProjectTask) => void
}

type SortKey = 'title' | 'status' | 'dueDate' | 'decisionTitle' | 'updated_at'

export function TaskTable({
  projectId,
  tasks,
  isLoading,
  filters,
  onFiltersChange,
  onEdit,
  onDelete,
}: TaskTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('updated_at')
  const [sortAsc, setSortAsc] = useState(false)

  const setFilter = <K extends keyof TaskListFilters>(key: K, value: TaskListFilters[K]) => {
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

  const sortedTasks = useMemo(() => {
    const arr = [...tasks]
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
  }, [tasks, sortKey, sortAsc])

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
                  <th className="text-left p-3 font-medium">Due</th>
                  <th className="text-left p-3 font-medium">Linked to</th>
                  <th className="w-24 p-3" aria-hidden />
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-3"><Skeleton className="h-5 w-40" /></td>
                    <td className="p-3"><Skeleton className="h-6 w-20" /></td>
                    <td className="p-3"><Skeleton className="h-5 w-24" /></td>
                    <td className="p-3"><Skeleton className="h-5 w-32" /></td>
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
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter tasks">
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
            <CheckSquare className="size-3.5" />
            {label}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-body" role="grid" aria-label="Tasks">
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
                      onClick={() => toggleSort('dueDate')}
                    >
                      Due date
                      <SortIcon column="dueDate" />
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
                {sortedTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-border/50 transition-colors hover:bg-muted/30"
                  >
                    <td className="p-3">
                      <span className="font-medium text-foreground">{task.title}</span>
                      {task.description && (
                        <p className="text-small text-muted-foreground mt-0.5 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={task.status === 'done' ? 'secondary' : 'default'}
                        className={cn(
                          task.status === 'in_progress' && 'bg-primary/80',
                          'transition-all duration-200'
                        )}
                      >
                        {task.status === 'todo' && 'To do'}
                        {task.status === 'in_progress' && 'In progress'}
                        {task.status === 'done' && 'Done'}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {task.decisionId && (
                          <Link
                            to={`/dashboard/projects/${projectId}/decisions`}
                            className="inline-flex items-center gap-1 text-small text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                          >
                            <FileCheck className="size-3.5" />
                            {task.decisionTitle ?? 'Decision'}
                          </Link>
                        )}
                        {task.milestoneId && (
                          <Link
                            to={`/dashboard/projects/${projectId}/timeline`}
                            className="inline-flex items-center gap-1 text-small text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                          >
                            <Flag className="size-3.5" />
                            {task.milestoneTitle ?? 'Milestone'}
                          </Link>
                        )}
                        {!task.decisionId && !task.milestoneId && '—'}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="tertiary"
                          size="icon"
                          className="size-8"
                          onClick={() => onEdit(task)}
                          aria-label={`Edit ${task.title}`}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="tertiary"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => onDelete(task)}
                          aria-label={`Delete ${task.title}`}
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
