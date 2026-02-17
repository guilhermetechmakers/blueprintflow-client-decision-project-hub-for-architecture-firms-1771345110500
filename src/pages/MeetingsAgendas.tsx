import { useState, useEffect } from 'react'
import { CalendarDays, Plus, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AgendaBuilder,
  CalendarIntegration,
  MeetingNotes,
  ActionItemList,
} from '@/components/meetings-agendas'
import {
  useMeetingsAgendasList,
  useMeeting,
  useCreateMeeting,
  useAgendaTopics,
  useUpsertAgendaTopic,
  useDeleteAgendaTopic,
  useMeetingRsvps,
  useSetRsvp,
  useMeetingIcsUrl,
  useMeetingNotes,
  useSaveMeetingNote,
  useActionItems,
  useCreateActionItem,
  useUpdateActionItem,
  useDeleteActionItem,
} from '@/hooks/use-meetings-agendas'
import { toast } from 'sonner'

const PAGE_TITLE = 'Meetings & Agendas — BlueprintFlow'
const PAGE_DESCRIPTION =
  'Create meeting agendas, invite attendees, track notes and action items linked to decisions and documents.'

export default function MeetingsAgendasPage() {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)

  const { meetings, isLoading: listLoading, isError: listError, refetch: refetchList } = useMeetingsAgendasList()
  const { data: meeting, isLoading: meetingLoading } = useMeeting(selectedMeetingId)
  const createMeetingMutation = useCreateMeeting()

  const { data: topics = [], isLoading: topicsLoading } = useAgendaTopics(selectedMeetingId)
  const upsertTopicMutation = useUpsertAgendaTopic(selectedMeetingId ?? undefined)
  const deleteTopicMutation = useDeleteAgendaTopic(selectedMeetingId ?? undefined)

  const { data: rsvps = [], isLoading: rsvpsLoading } = useMeetingRsvps(selectedMeetingId)
  const setRsvpMutation = useSetRsvp(selectedMeetingId ?? undefined)
  const { data: icsUrl = null, isLoading: icsLoading } = useMeetingIcsUrl(selectedMeetingId)

  const { data: notes = [], isLoading: notesLoading } = useMeetingNotes(selectedMeetingId)
  const saveNoteMutation = useSaveMeetingNote(selectedMeetingId ?? undefined)

  const { data: actionItems = [], isLoading: actionItemsLoading } = useActionItems(selectedMeetingId)
  const createActionMutation = useCreateActionItem(selectedMeetingId ?? undefined)
  const updateActionMutation = useUpdateActionItem(selectedMeetingId ?? undefined)
  const deleteActionMutation = useDeleteActionItem(selectedMeetingId ?? undefined)

  useEffect(() => {
    const prevTitle = document.title
    const prevMeta = document.querySelector('meta[name="description"]')?.getAttribute('content') ?? null
    document.title = PAGE_TITLE
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', PAGE_DESCRIPTION)
    return () => {
      document.title = prevTitle
      if (prevMeta !== null) meta?.setAttribute('content', prevMeta)
      else meta?.remove()
    }
  }, [])

  const handleCreateMeeting = () => {
    createMeetingMutation.mutate(
      { title: 'New meeting', description: '', status: 'draft' },
      {
        onSuccess: (data) => {
          setSelectedMeetingId(data.id)
          toast.success('Meeting created')
        },
        onError: () => toast.error('Failed to create meeting'),
      }
    )
  }

  const handleAddTopic = (payload: {
    title: string
    durationMinutes: number
    ownerName?: string
    linkedDecisionIds?: string[]
    linkedDocumentIds?: string[]
  }) => {
    if (!selectedMeetingId) return
    upsertTopicMutation.mutate(
      {
        ...payload,
        orderIndex: topics.length,
      },
      {
        onSuccess: () => toast.success('Topic added'),
        onError: () => toast.error('Failed to add topic'),
      }
    )
  }

  const handleRemoveTopic = (topicId: string) => {
    deleteTopicMutation.mutate(topicId, {
      onSuccess: () => toast.success('Topic removed'),
      onError: () => toast.error('Failed to remove topic'),
    })
  }

  const handleRsvp = (status: 'going' | 'maybe' | 'declined') => {
    setRsvpMutation.mutate(status, {
      onSuccess: () => toast.success('Response saved'),
      onError: () => toast.error('Failed to save response'),
    })
  }

  const handleSaveNote = (content: string) => {
    saveNoteMutation.mutate(
      { content },
      {
        onSuccess: () => toast.success('Note saved'),
        onError: () => toast.error('Failed to save note'),
      }
    )
  }

  const handleCreateAction = (item: {
    title: string
    description?: string
    assigneeName?: string
    dueDate?: string
    linkedTaskId?: string
  }) => {
    createActionMutation.mutate(
      {
        ...item,
        assigneeName: item.assigneeName,
      },
      {
        onSuccess: () => toast.success('Action item added'),
        onError: () => toast.error('Failed to add action item'),
      }
    )
  }

  const handleUpdateAction = (
    id: string,
    updates: Partial<{ status: 'open' | 'in_progress' | 'done' }>
  ) => {
    updateActionMutation.mutate(
      { actionItemId: id, body: updates },
      {
        onSuccess: () => toast.success('Updated'),
        onError: () => toast.error('Failed to update'),
      }
    )
  }

  const handleDeleteAction = (id: string) => {
    deleteActionMutation.mutate(id, {
      onSuccess: () => toast.success('Action item removed'),
      onError: () => toast.error('Failed to remove'),
    })
  }

  const currentUserRsvp = rsvps.find((r) => r.userId === 'u1')?.status

  if (listError) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-h1 font-semibold">Meetings & Agendas</h1>
        <Card className="overflow-hidden border-destructive/30">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="size-12 text-destructive mb-4" aria-hidden />
            <p className="text-body text-foreground text-center mb-2">
              Unable to load meetings. Please check your connection and try again.
            </p>
            <Button
              className="mt-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => refetchList()}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (listLoading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-64 skeleton-shimmer" />
        <Skeleton className="h-24 w-full rounded-lg skeleton-shimmer" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48 rounded-lg skeleton-shimmer" />
          <Skeleton className="h-48 rounded-lg skeleton-shimmer" />
        </div>
      </div>
    )
  }

  if (!selectedMeetingId) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-h1 font-semibold">Meetings & Agendas</h1>
          <Button
            className="w-full sm:w-auto transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleCreateMeeting}
            disabled={createMeetingMutation.isPending}
          >
            {createMeetingMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            New meeting
          </Button>
        </div>
        <p className="text-body text-muted-foreground">
          Create agendas, invite attendees, track notes and action items linked to decisions and documents.
        </p>

        {meetings.length === 0 ? (
          <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <CalendarDays className="size-12 text-muted-foreground mb-4" />
              <p className="text-body text-muted-foreground text-center mb-2">
                No meetings yet. Create an agenda and send calendar invites.
              </p>
              <p className="text-small text-muted-foreground text-center mb-4">
                Add topics, time allocation, linked decisions/documents, and convert notes into action items.
              </p>
              <Button
                className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                onClick={handleCreateMeeting}
                disabled={createMeetingMutation.isPending}
              >
                {createMeetingMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                Create meeting
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {meetings.map((m) => (
              <li key={m.id}>
                <Card
                  className="cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-card-hover"
                  onClick={() => setSelectedMeetingId(m.id)}
                >
                  <CardContent className="p-4">
                    <h3 className="text-h3 font-semibold text-foreground">{m.title}</h3>
                    {m.description && (
                      <p className="text-small text-muted-foreground mt-1 line-clamp-2">
                        {m.description}
                      </p>
                    )}
                    <p className="text-small text-muted-foreground mt-2 capitalize">
                      {m.status}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (meetingLoading && !meeting) {
    return (
      <div className="p-6 animate-fade-in">
        <Skeleton className="h-8 w-48 mb-4 skeleton-shimmer" />
        <Skeleton className="h-64 w-full rounded-lg skeleton-shimmer" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="icon"
            className="shrink-0 transition-all duration-200 hover:scale-[1.02]"
            onClick={() => setSelectedMeetingId(null)}
            aria-label="Back to meetings list"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-h1 font-semibold">{meeting?.title ?? 'Meeting'}</h1>
            {meeting?.description && (
              <p className="text-body text-muted-foreground mt-0.5">{meeting.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <AgendaBuilder
            meetingId={selectedMeetingId}
            topics={topics}
            isLoading={topicsLoading}
            onAddTopic={handleAddTopic}
            onRemoveTopic={handleRemoveTopic}
            canEdit
          />
          <MeetingNotes
            meetingId={selectedMeetingId}
            notes={notes}
            isLoading={notesLoading}
            onSaveNote={handleSaveNote}
            onCreateActionItem={() => handleCreateAction({ title: 'New action item' })}
            isSaving={saveNoteMutation.isPending}
            canEdit
          />
          <ActionItemList
            meetingId={selectedMeetingId}
            actionItems={actionItems}
            isLoading={actionItemsLoading}
            onAdd={handleCreateAction}
            onUpdate={handleUpdateAction}
            onDelete={handleDeleteAction}
            canEdit
          />
        </div>
        <div className="space-y-6">
          <CalendarIntegration
            meetingId={selectedMeetingId}
            meetingTitle={meeting?.title ?? ''}
            startAt={meeting?.startAt}
            endAt={meeting?.endAt}
            location={meeting?.location}
            rsvps={rsvps}
            icsUrl={icsUrl}
            isLoadingRsvps={rsvpsLoading}
            isLoadingIcs={icsLoading}
            onRsvp={handleRsvp}
            currentUserRsvp={currentUserRsvp}
          />
        </div>
      </div>
    </div>
  )
}
