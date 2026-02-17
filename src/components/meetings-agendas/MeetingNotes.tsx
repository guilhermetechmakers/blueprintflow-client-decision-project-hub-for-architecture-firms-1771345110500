import { useState } from 'react'
import { FileText, Send, Plus, Loader2, FileCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { MeetingNote } from '@/types'

export interface MeetingNotesProps {
  meetingId: string
  notes: MeetingNote[]
  isLoading: boolean
  onSaveNote?: (content: string) => void
  onCreateActionItem?: (fromNote?: string) => void
  onRequestApproval?: (context?: { noteId?: string; excerpt?: string }) => void
  isSaving?: boolean
  canEdit?: boolean
}

function formatNoteTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export function MeetingNotes({
  meetingId: _meetingId,
  notes,
  isLoading,
  onSaveNote,
  onCreateActionItem,
  onRequestApproval,
  isSaving = false,
  canEdit = true,
}: MeetingNotesProps) {
  const [newContent, setNewContent] = useState('')

  const handleSubmit = () => {
    if (!newContent.trim() || !onSaveNote) return
    onSaveNote(newContent.trim())
    setNewContent('')
  }

  const handleAddActionFromSelection = () => {
    const selection = typeof document !== 'undefined' ? document.getSelection()?.toString() : null
    onCreateActionItem?.(selection || undefined)
  }

  const handleRequestApproval = () => {
    const selection = typeof document !== 'undefined' ? document.getSelection()?.toString() : null
    onRequestApproval?.({ excerpt: selection || newContent.slice(0, 200) })
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <Skeleton className="h-6 w-40 skeleton-shimmer" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-24 w-full rounded-lg skeleton-shimmer" />
          <Skeleton className="h-20 w-full rounded-lg skeleton-shimmer" />
          <Skeleton className="h-20 w-full rounded-lg skeleton-shimmer" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="border-b border-border">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-h3 font-semibold flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            Meeting notes
          </CardTitle>
          {canEdit && (onCreateActionItem || onRequestApproval) && (
            <div className="flex flex-wrap gap-2">
              {onCreateActionItem && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleAddActionFromSelection}
                >
                  <Plus className="size-4" />
                  Create action item
                </Button>
              )}
              {onRequestApproval && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-accent/50 text-accent hover:bg-accent/10 focus-visible:ring-2 focus-visible:ring-accent"
                  onClick={handleRequestApproval}
                  aria-label="Request approval and link to decision or document"
                >
                  <FileCheck className="size-4" />
                  Request approval
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {canEdit && onSaveNote && (
          <div className="space-y-2 animate-fade-in">
            <Textarea
              placeholder="Add a note… (live collaborative notes)"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="min-h-[100px] resize-y focus-visible:ring-2 focus-visible:ring-accent"
              disabled={isSaving}
            />
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!newContent.trim() || isSaving}
              className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Save note
            </Button>
          </div>
        )}

        <ul className="space-y-3" role="list">
          {notes
            .slice()
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .map((note, index) => (
              <li
                key={note.id}
                className={cn(
                  'rounded-lg border border-border bg-card p-3 transition-all duration-200 hover:shadow-card-hover animate-fade-in'
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <p className="text-body text-foreground whitespace-pre-wrap">{note.content}</p>
                <p className="text-small text-muted-foreground mt-2">
                  {note.authorName} · {formatNoteTime(note.updated_at)}
                </p>
              </li>
            ))}
        </ul>

        {!isLoading && notes.length === 0 && !newContent && (
          <div className="rounded-lg border border-dashed border-border py-12 px-4 text-center animate-fade-in">
            <FileText className="size-10 text-muted-foreground mx-auto mb-3" aria-hidden />
            <p className="text-body font-medium text-foreground mb-1">No notes yet</p>
            <p className="text-small text-muted-foreground max-w-sm mx-auto">
              Add the first note above to start live collaborative notes. Create action items from selected text or via the button.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
