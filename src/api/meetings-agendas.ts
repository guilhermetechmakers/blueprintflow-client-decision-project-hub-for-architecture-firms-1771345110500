import { api } from '@/lib/api'
import type {
  MeetingsAgendasRecord,
  MeetingWithAgenda,
  AgendaTopic,
  MeetingRsvp,
  MeetingActionItem,
  MeetingNote,
} from '@/types'

const BASE = '/meetings-agendas'

export async function fetchMeetingsAgendasList(): Promise<MeetingWithAgenda[]> {
  return api.get<MeetingWithAgenda[]>(BASE)
}

export async function fetchMeeting(meetingId: string): Promise<MeetingWithAgenda> {
  return api.get<MeetingWithAgenda>(`${BASE}/${meetingId}`)
}

export async function createMeeting(body: {
  title: string
  description?: string
  status?: string
  startAt?: string
  endAt?: string
  location?: string
  timezone?: string
}): Promise<MeetingsAgendasRecord> {
  return api.post<MeetingsAgendasRecord>(BASE, body)
}

export async function updateMeeting(
  meetingId: string,
  body: Partial<Pick<MeetingsAgendasRecord, 'title' | 'description' | 'status'>>
): Promise<MeetingsAgendasRecord> {
  return api.patch<MeetingsAgendasRecord>(`${BASE}/${meetingId}`, body)
}

export async function deleteMeeting(meetingId: string): Promise<void> {
  return api.delete(`${BASE}/${meetingId}`)
}

/** Agenda topics */
export async function fetchAgendaTopics(meetingId: string): Promise<AgendaTopic[]> {
  return api.get<AgendaTopic[]>(`${BASE}/${meetingId}/topics`)
}

export async function upsertAgendaTopic(
  meetingId: string,
  body: Partial<AgendaTopic> & { title: string; durationMinutes: number; orderIndex: number }
): Promise<AgendaTopic> {
  return api.post<AgendaTopic>(`${BASE}/${meetingId}/topics`, body)
}

export async function deleteAgendaTopic(meetingId: string, topicId: string): Promise<void> {
  return api.delete(`${BASE}/${meetingId}/topics/${topicId}`)
}

/** RSVPs */
export async function fetchMeetingRsvps(meetingId: string): Promise<MeetingRsvp[]> {
  return api.get<MeetingRsvp[]>(`${BASE}/${meetingId}/rsvps`)
}

export async function setRsvp(
  meetingId: string,
  status: MeetingRsvp['status']
): Promise<MeetingRsvp> {
  return api.post<MeetingRsvp>(`${BASE}/${meetingId}/rsvps`, { status })
}

/** Generate ICS file for add to calendar */
export async function getMeetingIcsUrl(meetingId: string): Promise<{ url: string }> {
  return api.get<{ url: string }>(`${BASE}/${meetingId}/ics`)
}

/** Meeting notes */
export async function fetchMeetingNotes(meetingId: string): Promise<MeetingNote[]> {
  return api.get<MeetingNote[]>(`${BASE}/${meetingId}/notes`)
}

export async function saveMeetingNote(
  meetingId: string,
  body: { content: string }
): Promise<MeetingNote> {
  return api.post<MeetingNote>(`${BASE}/${meetingId}/notes`, body)
}

export async function updateMeetingNote(
  meetingId: string,
  noteId: string,
  body: { content: string }
): Promise<MeetingNote> {
  return api.patch<MeetingNote>(`${BASE}/${meetingId}/notes/${noteId}`, body)
}

/** Action items */
export async function fetchActionItems(meetingId: string): Promise<MeetingActionItem[]> {
  return api.get<MeetingActionItem[]>(`${BASE}/${meetingId}/action-items`)
}

export async function createActionItem(
  meetingId: string,
  body: {
    title: string
    description?: string
    assigneeId?: string
    assigneeName?: string
    dueDate?: string
    linkedTaskId?: string
    linkedDecisionId?: string
    linkedDocumentId?: string
  }
): Promise<MeetingActionItem> {
  return api.post<MeetingActionItem>(`${BASE}/${meetingId}/action-items`, body)
}

export async function updateActionItem(
  meetingId: string,
  actionItemId: string,
  body: Partial<Pick<MeetingActionItem, 'title' | 'description' | 'assigneeId' | 'dueDate' | 'status' | 'linkedTaskId' | 'linkedDecisionId' | 'linkedDocumentId'>>
): Promise<MeetingActionItem> {
  return api.patch<MeetingActionItem>(
    `${BASE}/${meetingId}/action-items/${actionItemId}`,
    body
  )
}

export async function deleteActionItem(
  meetingId: string,
  actionItemId: string
): Promise<void> {
  return api.delete(`${BASE}/${meetingId}/action-items/${actionItemId}`)
}
