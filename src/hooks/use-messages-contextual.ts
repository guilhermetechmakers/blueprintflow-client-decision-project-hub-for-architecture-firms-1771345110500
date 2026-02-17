import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ContextualThread, ContextualMessage, ThreadContextType } from '@/types'
import type { MessagesContextSearchFilters } from '@/api/messages-contextual-communication'
import {
  fetchThreads,
  fetchThread,
  fetchThreadMessages,
  sendMessage,
  markThreadRead,
  createThread,
  searchMessages,
} from '@/api/messages-contextual-communication'

const QUERY_KEY = 'messages-contextual'

const MOCK_THREADS: ContextualThread[] = [
  {
    id: 't1',
    projectId: '1',
    contextType: 'decision',
    contextId: 'd1',
    contextTitle: 'Kitchen finish options',
    subject: 'Countertop selection',
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    lastMessagePreview: 'Can we see a sample of Option B?',
    unreadCount: 2,
    participantCount: 3,
    status: 'active',
  },
  {
    id: 't2',
    projectId: '1',
    contextType: 'document',
    contextId: 'doc1',
    contextTitle: 'Floor plan A-101',
    subject: 'Revisions for north wing',
    lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
    lastMessagePreview: 'Attached the updated PDF.',
    unreadCount: 0,
    participantCount: 2,
    status: 'active',
  },
  {
    id: 't3',
    projectId: '1',
    contextType: 'task',
    contextId: 'task1',
    contextTitle: 'Submit permit application',
    subject: 'Deadline reminder',
    lastMessageAt: new Date(Date.now() - 172800000).toISOString(),
    lastMessagePreview: 'All set for Friday.',
    unreadCount: 0,
    participantCount: 2,
    status: 'active',
  },
]

const MOCK_MESSAGES: Record<string, ContextualMessage[]> = {
  t1: [
    {
      id: 'm1',
      threadId: 't1',
      authorId: 'u1',
      authorName: 'Jane Smith',
      body: 'Here are the three countertop options we discussed. Option B (quartz) is the recommended upgrade.',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      attachments: [],
      mentions: [],
    },
    {
      id: 'm2',
      threadId: 't1',
      authorId: 'u2',
      authorName: 'Client',
      body: 'Can we see a sample of Option B?',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      attachments: [],
      mentions: ['u1'],
    },
  ],
}

function filterThreads(
  threads: ContextualThread[],
  projectId: string,
  filters?: MessagesContextSearchFilters
): ContextualThread[] {
  let result = threads.filter((t) => t.projectId === projectId)
  if (!filters) return result
  if (filters.keyword) {
    const q = filters.keyword.toLowerCase()
    result = result.filter(
      (t) =>
        t.subject.toLowerCase().includes(q) ||
        t.contextTitle.toLowerCase().includes(q) ||
        (t.lastMessagePreview?.toLowerCase().includes(q) ?? false)
    )
  }
  if (filters.contextType)
    result = result.filter((t) => t.contextType === filters.contextType)
  if (filters.contextId) result = result.filter((t) => t.contextId === filters.contextId)
  return result
}

export function useContextualThreads(
  projectId: string | undefined,
  filters?: MessagesContextSearchFilters
) {
  const query = useQuery({
    queryKey: [QUERY_KEY, 'threads', projectId, filters],
    queryFn: async (): Promise<ContextualThread[]> => {
      if (!projectId) return []
      try {
        return await fetchThreads(projectId, filters)
      } catch {
        return filterThreads(MOCK_THREADS, projectId, filters)
      }
    },
    enabled: !!projectId,
  })
  const threads = query.data ?? []
  return { ...query, threads }
}

export function useContextualThread(threadId: string | null | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, 'thread', threadId],
    queryFn: async (): Promise<ContextualThread | null> => {
      if (!threadId) return null
      try {
        return await fetchThread(threadId)
      } catch {
        return MOCK_THREADS.find((t) => t.id === threadId) ?? null
      }
    },
    enabled: !!threadId,
  })
}

export function useThreadMessages(threadId: string | null | undefined) {
  const query = useQuery({
    queryKey: [QUERY_KEY, 'messages', threadId],
    queryFn: async (): Promise<ContextualMessage[]> => {
      if (!threadId) return []
      try {
        return await fetchThreadMessages(threadId)
      } catch {
        return MOCK_MESSAGES[threadId] ?? []
      }
    },
    enabled: !!threadId,
  })
  const messages = query.data ?? []
  return { ...query, messages }
}

export function useSendContextualMessage(threadId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: {
      body: string
      attachmentUrls?: string[]
      mentions?: string[]
      relatedItemId?: string
      relatedItemType?: ThreadContextType
    }) => sendMessage(threadId!, body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEY, 'messages', threadId] })
      client.invalidateQueries({ queryKey: [QUERY_KEY, 'threads'] })
    },
  })
}

export function useMarkThreadRead() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (threadId: string) => markThreadRead(threadId),
    onSuccess: (_, threadId) => {
      client.invalidateQueries({ queryKey: [QUERY_KEY, 'thread', threadId] })
      client.invalidateQueries({ queryKey: [QUERY_KEY, 'threads'] })
    },
  })
}

export function useCreateContextualThread(projectId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: {
      contextType: ThreadContextType
      contextId: string
      contextTitle: string
      subject: string
    }) => createThread(projectId!, body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEY, 'threads', projectId] })
    },
  })
}

export function useSearchContextualMessages(
  projectId: string | undefined,
  filters: MessagesContextSearchFilters
) {
  return useQuery({
    queryKey: [QUERY_KEY, 'search', projectId, filters],
    queryFn: async () => {
      if (!projectId) return { threads: [], messageHighlights: undefined }
      try {
        return await searchMessages(projectId, filters)
      } catch {
        const threads = filterThreads(MOCK_THREADS, projectId, filters)
        return { threads, messageHighlights: undefined }
      }
    },
    enabled: !!projectId,
  })
}
