import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  MeetingWithAgenda,
  AgendaTopic,
  MeetingRsvp,
  MeetingActionItem,
  MeetingNote,
} from '@/types'
import {
  fetchMeetingsAgendasList,
  fetchMeeting,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  fetchAgendaTopics,
  upsertAgendaTopic,
  deleteAgendaTopic,
  fetchMeetingRsvps,
  setRsvp,
  getMeetingIcsUrl,
  fetchMeetingNotes,
  saveMeetingNote,
  updateMeetingNote,
  fetchActionItems,
  createActionItem,
  updateActionItem,
  deleteActionItem,
} from '@/api/meetings-agendas'

const QUERY_KEY = 'meetings-agendas'

const MOCK_MEETINGS: MeetingWithAgenda[] = [
  {
    id: 'm1',
    user_id: 'u1',
    title: 'Schematic design review',
    description: 'Review SD set and client feedback.',
    status: 'scheduled',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    startAt: new Date(Date.now() + 86400000).toISOString(),
    endAt: new Date(Date.now() + 86400000 + 3600000).toISOString(),
    location: 'Conference Room A',
    timezone: 'America/New_York',
    topics: [
      {
        id: 't1',
        meetingId: 'm1',
        title: 'Floor plan review',
        durationMinutes: 20,
        orderIndex: 0,
        ownerName: 'Jane Smith',
        linkedDecisionIds: ['1'],
        linkedDocumentIds: [],
      },
      {
        id: 't2',
        meetingId: 'm1',
        title: 'Budget and timeline',
        durationMinutes: 25,
        orderIndex: 1,
        ownerName: 'John Doe',
        linkedDecisionIds: [],
        linkedDocumentIds: [],
      },
    ],
    attendeeIds: ['u1', 'u2'],
  },
]

const MOCK_RSVPS: MeetingRsvp[] = [
  { id: 'r1', meetingId: 'm1', userId: 'u1', userName: 'Jane Smith', status: 'going', respondedAt: new Date().toISOString() },
  { id: 'r2', meetingId: 'm1', userId: 'u2', userName: 'Client', status: 'going', respondedAt: new Date().toISOString() },
]

const MOCK_NOTES: MeetingNote[] = [
  { id: 'n1', meetingId: 'm1', content: 'Client approved Option A for kitchen finish.', authorId: 'u1', authorName: 'Jane Smith', updated_at: new Date().toISOString() },
]

const MOCK_ACTION_ITEMS: MeetingActionItem[] = [
  { id: 'a1', meetingId: 'm1', title: 'Send revised SD set', assigneeName: 'Jane Smith', dueDate: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10), status: 'open', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'a2', meetingId: 'm1', title: 'Update budget spreadsheet', assigneeName: 'John Doe', dueDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10), status: 'in_progress', linkedTaskId: 'task-1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

export function useMeetingsAgendasList() {
  const query = useQuery({
    queryKey: [QUERY_KEY, 'list'],
    queryFn: async (): Promise<MeetingWithAgenda[]> => {
      try {
        return await fetchMeetingsAgendasList()
      } catch {
        return MOCK_MEETINGS
      }
    },
  })
  const meetings = query.data ?? []
  return { ...query, meetings }
}

export function useMeeting(meetingId: string | null | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, meetingId],
    queryFn: async (): Promise<MeetingWithAgenda | null> => {
      if (!meetingId) return null
      try {
        return await fetchMeeting(meetingId)
      } catch {
        return MOCK_MEETINGS.find((m) => m.id === meetingId) ?? null
      }
    },
    enabled: !!meetingId,
  })
}

export function useCreateMeeting() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: Parameters<typeof createMeeting>[0]) => createMeeting(body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEY, 'list'] })
    },
  })
}

export function useUpdateMeeting() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ meetingId, body }: { meetingId: string; body: Parameters<typeof updateMeeting>[1] }) =>
      updateMeeting(meetingId, body),
    onSuccess: (_, { meetingId }) => {
      client.invalidateQueries({ queryKey: [QUERY_KEY] })
      client.invalidateQueries({ queryKey: [QUERY_KEY, meetingId] })
    },
  })
}

export function useDeleteMeeting() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (meetingId: string) => deleteMeeting(meetingId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useAgendaTopics(meetingId: string | null | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, meetingId, 'topics'],
    queryFn: async (): Promise<AgendaTopic[]> => {
      if (!meetingId) return []
      try {
        return await fetchAgendaTopics(meetingId)
      } catch {
        return MOCK_MEETINGS.find((m) => m.id === meetingId)?.topics ?? []
      }
    },
    enabled: !!meetingId,
  })
}

export function useUpsertAgendaTopic(meetingId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: Parameters<typeof upsertAgendaTopic>[1]) =>
      upsertAgendaTopic(meetingId!, body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEY, meetingId] })
    },
  })
}

export function useDeleteAgendaTopic(meetingId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (topicId: string) => deleteAgendaTopic(meetingId!, topicId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEY, meetingId] })
    },
  })
}

export function useMeetingRsvps(meetingId: string | null | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, meetingId, 'rsvps'],
    queryFn: async (): Promise<MeetingRsvp[]> => {
      if (!meetingId) return []
      try {
        return await fetchMeetingRsvps(meetingId)
      } catch {
        return meetingId === 'm1' ? MOCK_RSVPS : []
      }
    },
    enabled: !!meetingId,
  })
}

export function useSetRsvp(meetingId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (status: MeetingRsvp['status']) => setRsvp(meetingId!, status),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEY, meetingId, 'rsvps'] })
    },
  })
}

export function useMeetingIcsUrl(meetingId: string | null | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, meetingId, 'ics'],
    queryFn: async (): Promise<string | null> => {
      if (!meetingId) return null
      try {
        const { url } = await getMeetingIcsUrl(meetingId)
        return url
      } catch {
        return null
      }
    },
    enabled: !!meetingId,
  })
}

export function useMeetingNotes(meetingId: string | null | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, meetingId, 'notes'],
    queryFn: async (): Promise<MeetingNote[]> => {
      if (!meetingId) return []
      try {
        return await fetchMeetingNotes(meetingId)
      } catch {
        return meetingId === 'm1' ? MOCK_NOTES : []
      }
    },
    enabled: !!meetingId,
  })
}

export function useSaveMeetingNote(meetingId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: { content: string }) => saveMeetingNote(meetingId!, body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEY, meetingId, 'notes'] })
    },
  })
}

export function useUpdateMeetingNote(meetingId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ noteId, content }: { noteId: string; content: string }) =>
      updateMeetingNote(meetingId!, noteId, { content }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEY, meetingId, 'notes'] })
    },
  })
}

export function useActionItems(meetingId: string | null | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, meetingId, 'action-items'],
    queryFn: async (): Promise<MeetingActionItem[]> => {
      if (!meetingId) return []
      try {
        return await fetchActionItems(meetingId)
      } catch {
        return meetingId === 'm1' ? MOCK_ACTION_ITEMS : []
      }
    },
    enabled: !!meetingId,
  })
}

export function useCreateActionItem(meetingId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: Parameters<typeof createActionItem>[1]) =>
      createActionItem(meetingId!, body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEY, meetingId, 'action-items'] })
    },
  })
}

export function useUpdateActionItem(meetingId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({
      actionItemId,
      body,
    }: {
      actionItemId: string
      body: Parameters<typeof updateActionItem>[2]
    }) => updateActionItem(meetingId!, actionItemId, body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEY, meetingId, 'action-items'] })
    },
  })
}

export function useDeleteActionItem(meetingId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (actionItemId: string) => deleteActionItem(meetingId!, actionItemId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEY, meetingId, 'action-items'] })
    },
  })
}
