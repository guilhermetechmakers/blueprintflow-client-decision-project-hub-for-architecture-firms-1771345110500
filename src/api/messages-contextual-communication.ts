import { api } from '@/lib/api'
import type {
  ContextualThread,
  ContextualMessage,
  ThreadContextType,
} from '@/types'

export type MessagesContextSearchFilters = {
  keyword?: string
  contextType?: ThreadContextType
  contextId?: string
}

export async function fetchThreads(
  projectId: string,
  filters?: MessagesContextSearchFilters
): Promise<ContextualThread[]> {
  const params = new URLSearchParams({ projectId })
  if (filters?.keyword) params.set('q', filters.keyword)
  if (filters?.contextType) params.set('contextType', filters.contextType)
  if (filters?.contextId) params.set('contextId', filters.contextId)
  const qs = params.toString()
  return api.get<ContextualThread[]>(
    `/messages-contextual-communication/threads${qs ? `?${qs}` : ''}`
  )
}

export async function fetchThread(threadId: string): Promise<ContextualThread | null> {
  try {
    return await api.get<ContextualThread>(
      `/messages-contextual-communication/threads/${threadId}`
    )
  } catch {
    return null
  }
}

export async function fetchThreadMessages(threadId: string): Promise<ContextualMessage[]> {
  try {
    return await api.get<ContextualMessage[]>(
      `/messages-contextual-communication/threads/${threadId}/messages`
    )
  } catch {
    return []
  }
}

export async function sendMessage(
  threadId: string,
  body: {
    body: string
    attachmentUrls?: string[]
    mentions?: string[]
    relatedItemId?: string
    relatedItemType?: ThreadContextType
  }
): Promise<ContextualMessage> {
  return api.post<ContextualMessage>(
    `/messages-contextual-communication/threads/${threadId}/messages`,
    body
  )
}

export async function markThreadRead(threadId: string): Promise<void> {
  return api.patch(`/messages-contextual-communication/threads/${threadId}/read`)
}

export async function createThread(
  projectId: string,
  body: {
    contextType: ThreadContextType
    contextId: string
    contextTitle: string
    subject: string
  }
): Promise<ContextualThread> {
  return api.post<ContextualThread>('/messages-contextual-communication/threads', {
    projectId,
    ...body,
  })
}

export type MessagesSearchResult = {
  threads: ContextualThread[]
  messageHighlights?: Record<string, string[]>
}

export async function searchMessages(
  projectId: string,
  filters: MessagesContextSearchFilters
): Promise<MessagesSearchResult> {
  const params = new URLSearchParams({ projectId })
  if (filters.keyword) params.set('q', filters.keyword)
  if (filters.contextType) params.set('contextType', filters.contextType)
  if (filters.contextId) params.set('contextId', filters.contextId)
  const qs = params.toString()
  return api.get<MessagesSearchResult>(
    `/messages-contextual-communication/search${qs ? `?${qs}` : ''}`
  )
}
