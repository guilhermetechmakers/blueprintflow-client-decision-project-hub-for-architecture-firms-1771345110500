import { useState } from 'react'
import { CheckSquare, Calendar, User, Link2, Plus, Trash2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { MeetingActionItem } from '@/types'

export interface ActionItemListProps {
  meetingId: string
  actionItems: MeetingActionItem[]
  isLoading: boolean
  onAdd?: (item: { title: string; description?: string; assigneeName?: string; dueDate?: string; linkedTaskId?: string }) => void
  onUpdate?: (id: string, updates: Partial<MeetingActionItem>) => void
  onDelete?: (id: string) => void
  canEdit?: boolean
  projectTaskLinkBase?: string
}

function formatDueDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { dateStyle: 'medium' })
  } catch {
    return iso
  }
}

export function ActionItemList({
  meetingId: _meetingId,
  actionItems,
  isLoading,
  onAdd,
  onUpdate,
  onDelete,
  canEdit = true,
  projectTaskLinkBase,
}: ActionItemListProps) {
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newAssignee, setNewAssignee] = useState('')
  const [newDue, setNewDue] = useState('')
  const [newLinkedTaskId, setNewLinkedTaskId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleAdd = async () => {
    if (!newTitle.trim() || !onAdd) return
    setSubmitting(true)
    try {
      onAdd({
        title: newTitle.trim(),
        description: newDesc.trim() || undefined,
        assigneeName: newAssignee.trim() || undefined,
        dueDate: newDue || undefined,
        linkedTaskId: newLinkedTaskId.trim() || undefined,
      })
      setNewTitle('')
      setNewDesc('')
      setNewAssignee('')
      setNewDue('')
      setNewLinkedTaskId('')
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  const open = actionItems.filter((a) => a.status !== 'done')
  const done = actionItems.filter((a) => a.status === 'done')

  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="border-b border-border">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-h3 font-semibold flex items-center gap-2">
            <CheckSquare className="size-5 text-primary" />
            Action items
            <Badge variant="secondary" className="font-normal">
              {open.length} open · {done.length} done
            </Badge>
          </CardTitle>
          {canEdit && onAdd && (
            <Button
              size="sm"
              className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => setShowForm(true)}
            >
              <Plus className="size-4" />
              Add action
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {canEdit && showForm && (
          <div
            className="rounded-lg border border-border bg-muted/30 p-4 space-y-3 animate-fade-in"
            aria-label="New action item form"
          >
            <div className="space-y-2">
              <Label htmlFor="action-title">Title</Label>
              <Input
                id="action-title"
                placeholder="e.g. Send revised drawings"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action-desc">Description (optional)</Label>
              <Input
                id="action-desc"
                placeholder="Details"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="action-assignee">Assign to</Label>
                <Input
                  id="action-assignee"
                  placeholder="Name"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="action-due">Due date</Label>
                <Input
                  id="action-due"
                  type="date"
                  value={newDue}
                  onChange={(e) => setNewDue(e.target.value)}
                  className="focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="action-linked-task">Link to project task (task ID)</Label>
              <Input
                id="action-linked-task"
                placeholder="e.g. task-123"
                value={newLinkedTaskId}
                onChange={(e) => setNewLinkedTaskId(e.target.value)}
                className="focus-visible:ring-2 focus-visible:ring-accent"
              />
              <p className="text-small text-muted-foreground">
                Link this action item back to a project task for tracking.
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} disabled={!newTitle.trim() || submitting}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                Add
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {[...open, ...done].map((item, index) => (
            <div
              key={item.id}
              className={cn(
                'rounded-lg border border-border p-3 transition-all duration-200 hover:shadow-card-hover animate-fade-in',
                item.status === 'done' && 'opacity-75 bg-muted/30'
              )}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="flex items-start gap-3">
                {canEdit && onUpdate && (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate(item.id, {
                        status: item.status === 'done' ? 'open' : 'done',
                      })
                    }
                    className="mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                    aria-label={item.status === 'done' ? 'Reopen' : 'Mark done'}
                  >
                    <CheckSquare
                      className={cn('size-5', item.status === 'done' && 'text-success')}
                    />
                  </button>
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'font-medium text-foreground',
                      item.status === 'done' && 'line-through text-muted-foreground'
                    )}
                  >
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-small text-muted-foreground mt-0.5">{item.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-3 text-small text-muted-foreground">
                    {item.assigneeName && (
                      <span className="inline-flex items-center gap-1">
                        <User className="size-3.5" />
                        {item.assigneeName}
                      </span>
                    )}
                    {item.dueDate && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {formatDueDate(item.dueDate)}
                      </span>
                    )}
                    {(item.linkedTaskId || item.linkedDecisionId || item.linkedDocumentId) && (
                      <span className="inline-flex items-center gap-1">
                        <Link2 className="size-3.5" />
                        Linked to task/decision/document
                      </span>
                    )}
                  </div>
                  {projectTaskLinkBase && item.linkedTaskId && (
                    <a
                      href={`${projectTaskLinkBase}/${item.linkedTaskId}`}
                      className="text-small text-primary hover:underline mt-1 inline-block"
                    >
                      View project task →
                    </a>
                  )}
                </div>
                {canEdit && onDelete && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="shrink-0 opacity-70 hover:opacity-100"
                    onClick={() => onDelete(item.id)}
                    aria-label={`Delete action ${item.title}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {!isLoading && actionItems.length === 0 && (
          <div className="rounded-lg border border-dashed border-border py-12 px-4 text-center animate-fade-in">
            <CheckSquare className="size-10 text-muted-foreground mx-auto mb-3" aria-hidden />
            <p className="text-body font-medium text-foreground mb-1">No action items yet</p>
            <p className="text-small text-muted-foreground mb-4 max-w-sm mx-auto">
              Create action items from meeting notes or add one below. Assign owners, set due dates, and link back to project tasks.
            </p>
            {canEdit && onAdd && (
              <Button
                variant="secondary"
                size="sm"
                className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => setShowForm(true)}
              >
                <Plus className="size-4" />
                Add first action
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
