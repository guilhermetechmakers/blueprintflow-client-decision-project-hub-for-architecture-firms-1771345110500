import { useState } from 'react'
import { Plus, Trash2, Clock, User, FileCheck, FileText, GripVertical } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { AgendaTopic } from '@/types'

export interface AgendaBuilderProps {
  meetingId: string
  topics: AgendaTopic[]
  isLoading: boolean
  onAddTopic?: (topic: { title: string; durationMinutes: number; ownerName?: string; linkedDecisionIds?: string[]; linkedDocumentIds?: string[] }) => void
  onRemoveTopic?: (topicId: string) => void
  onUpdateTopic?: (topicId: string, updates: Partial<AgendaTopic>) => void
  decisions?: { id: string; title: string }[]
  documents?: { id: string; title: string }[]
  canEdit?: boolean
}

export function AgendaBuilder({
  meetingId: _meetingId,
  topics,
  isLoading,
  onAddTopic,
  onRemoveTopic,
  onUpdateTopic: _onUpdateTopic,
  decisions: _decisions = [],
  documents: _documents = [],
  canEdit = true,
}: AgendaBuilderProps) {
  const [newTitle, setNewTitle] = useState('')
  const [newDuration, setNewDuration] = useState(15)
  const [newOwner, setNewOwner] = useState('')
  const [newLinkedDecisions, setNewLinkedDecisions] = useState('')
  const [newLinkedDocuments, setNewLinkedDocuments] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const parseIds = (s: string): string[] =>
    s
      .trim()
      .split(/[\s,]+/)
      .map((id) => id.trim())
      .filter(Boolean)

  const handleAdd = () => {
    if (!newTitle.trim() || !canEdit || !onAddTopic) return
    onAddTopic({
      title: newTitle.trim(),
      durationMinutes: newDuration,
      ownerName: newOwner.trim() || undefined,
      linkedDecisionIds: parseIds(newLinkedDecisions),
      linkedDocumentIds: parseIds(newLinkedDocuments),
    })
    setNewTitle('')
    setNewDuration(15)
    setNewOwner('')
    setNewLinkedDecisions('')
    setNewLinkedDocuments('')
  }

  const totalMinutes = topics.reduce((acc, t) => acc + t.durationMinutes, 0)

  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <Skeleton className="h-6 w-48 skeleton-shimmer" />
          <Skeleton className="h-4 w-64 mt-2 skeleton-shimmer" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg skeleton-shimmer" />
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
            Agenda
            <Badge variant="secondary" className="font-normal">
              {topics.length} topic{topics.length !== 1 ? 's' : ''} · {totalMinutes} min
            </Badge>
          </CardTitle>
          {canEdit && onAddTopic && (
            <Button
              size="sm"
              className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => setExpandedId(expandedId ? null : 'new')}
            >
              <Plus className="size-4" />
              Add topic
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {canEdit && expandedId === 'new' && (
          <div
            className="rounded-lg border border-border bg-muted/30 p-4 space-y-3 animate-fade-in"
            aria-label="New agenda topic form"
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="agenda-topic-title">Topic</Label>
                <Input
                  id="agenda-topic-title"
                  placeholder="e.g. Floor plan review"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agenda-topic-duration">Time (min)</Label>
                <Input
                  id="agenda-topic-duration"
                  type="number"
                  min={5}
                  max={120}
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value) || 15)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="agenda-topic-owner">Owner</Label>
              <Input
                id="agenda-topic-owner"
                placeholder="Owner name"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="agenda-topic-decisions">Link to decisions (IDs, comma-separated)</Label>
                <Input
                  id="agenda-topic-decisions"
                  placeholder="e.g. dec-1, dec-2"
                  value={newLinkedDecisions}
                  onChange={(e) => setNewLinkedDecisions(e.target.value)}
                  className="focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agenda-topic-documents">Link to documents (IDs, comma-separated)</Label>
                <Input
                  id="agenda-topic-documents"
                  placeholder="e.g. doc-1, doc-2"
                  value={newLinkedDocuments}
                  onChange={(e) => setNewLinkedDocuments(e.target.value)}
                  className="focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} disabled={!newTitle.trim()}>
                Add topic
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setExpandedId(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <ul className="space-y-2" role="list">
          {topics
            .slice()
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((topic, index) => (
              <li
                key={topic.id}
                className={cn(
                  'rounded-lg border border-border bg-card p-3 transition-all duration-200 hover:shadow-card-hover',
                  'animate-fade-in'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1.5 text-muted-foreground cursor-grab" aria-hidden>
                    <GripVertical className="size-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground">{topic.title}</span>
                      <span className="inline-flex items-center gap-1 text-small text-muted-foreground">
                        <Clock className="size-3.5" />
                        {topic.durationMinutes} min
                      </span>
                    </div>
                    {(topic.ownerName || topic.linkedDecisionIds?.length || topic.linkedDocumentIds?.length) ? (
                      <div className="mt-1.5 flex flex-wrap gap-2 text-small text-muted-foreground">
                        {topic.ownerName && (
                          <span className="inline-flex items-center gap-1">
                            <User className="size-3.5" />
                            {topic.ownerName}
                          </span>
                        )}
                        {topic.linkedDecisionIds?.length ? (
                          <span className="inline-flex items-center gap-1">
                            <FileCheck className="size-3.5" />
                            {topic.linkedDecisionIds.length} decision(s)
                          </span>
                        ) : null}
                        {topic.linkedDocumentIds?.length ? (
                          <span className="inline-flex items-center gap-1">
                            <FileText className="size-3.5" />
                            {topic.linkedDocumentIds.length} document(s)
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  {canEdit && onRemoveTopic && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                      onClick={() => onRemoveTopic(topic.id)}
                      aria-label={`Remove topic ${topic.title}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </li>
            ))}
        </ul>

        {!isLoading && topics.length === 0 && (
          <div className="rounded-lg border border-dashed border-border py-8 text-center text-small text-muted-foreground animate-fade-in">
            <p>No agenda topics yet.</p>
            {canEdit && onAddTopic && (
              <Button
                variant="secondary"
                size="sm"
                className="mt-3 transition-all duration-200 hover:scale-[1.02]"
                onClick={() => setExpandedId('new')}
              >
                <Plus className="size-4" />
                Add first topic
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
