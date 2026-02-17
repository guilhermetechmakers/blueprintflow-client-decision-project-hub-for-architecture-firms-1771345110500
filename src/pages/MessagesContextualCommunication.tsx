import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  ThreadList,
  ThreadView,
  SearchInMessages,
} from '@/components/messages-contextual-communication'
import {
  useContextualThreads,
  useContextualThread,
  useThreadMessages,
  useSendContextualMessage,
  useMarkThreadRead,
} from '@/hooks/use-messages-contextual'
import { useProject } from '@/hooks/use-projects'
import { toast } from 'sonner'
import type { ThreadContextType } from '@/types'

const PAGE_TITLE = 'Contextual messages — BlueprintFlow'

export default function MessagesContextualCommunication() {
  const { projectId } = useParams<{ projectId: string }>()
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [keyword, setKeyword] = useState('')
  const [contextFilter, setContextFilter] = useState<ThreadContextType | 'all'>('all')

  const filters =
    keyword.trim() || contextFilter !== 'all'
      ? {
          keyword: keyword.trim() || undefined,
          contextType: contextFilter === 'all' ? undefined : contextFilter,
        }
      : undefined

  const { data: project } = useProject(projectId)
  const { threads, isLoading: isLoadingThreads } = useContextualThreads(projectId, filters)
  const { data: selectedThread, isLoading: isLoadingThread } = useContextualThread(selectedThreadId)
  const { messages, isLoading: isLoadingMessages } = useThreadMessages(selectedThreadId)
  const sendMutation = useSendContextualMessage(selectedThreadId ?? undefined)
  const markReadMutation = useMarkThreadRead()

  useEffect(() => {
    const prev = document.title
    document.title = PAGE_TITLE
    return () => {
      document.title = prev
    }
  }, [])

  useEffect(() => {
    if (selectedThreadId && markReadMutation.mutate) {
      markReadMutation.mutate(selectedThreadId)
    }
  }, [selectedThreadId])

  const handleSendMessage = (body: {
    body: string
    attachmentUrls?: string[]
    mentions?: string[]
    relatedItemId?: string
    relatedItemType?: ThreadContextType
  }) => {
    sendMutation.mutate(body, {
      onSuccess: () => toast.success('Message sent'),
      onError: () => toast.error('Failed to send message'),
    })
  }

  const handleCreateTask = (_threadId: string) => {
    toast.info('Create task from thread — open task creation with context from this thread.')
  }

  const handleRequestApproval = (_threadId: string) => {
    toast.info('Request approval — notify approvers for this thread.')
  }

  if (!projectId) {
    return (
      <div className="p-6 animate-fade-in">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="size-12 text-muted-foreground mb-4" />
            <p className="text-body text-muted-foreground text-center">
              Select a project to view contextual messages.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-0 animate-fade-in p-6">
      <header className="shrink-0 mb-4">
        <h1 className="text-h1 font-semibold">Contextual messages</h1>
        <p className="text-body text-muted-foreground mt-1">
          Threaded discussions tied to decisions, documents, or tasks for {project?.name ?? 'this project'}.
        </p>
      </header>

      <div className="flex flex-col gap-4 mb-4">
        <SearchInMessages
          keyword={keyword}
          onKeywordChange={setKeyword}
          contextType={contextFilter}
          onContextTypeChange={setContextFilter}
          placeholder="Search by keyword..."
        />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 min-h-0">
        <aside className="flex flex-col min-h-0 border border-border rounded-lg bg-card overflow-hidden">
          <div className="p-2 border-b border-border shrink-0">
            <p className="text-small font-medium text-muted-foreground px-2">
              Threads by context
            </p>
          </div>
          <div className="flex-1 overflow-auto p-2 min-h-0">
            <ThreadList
              threads={threads}
              isLoading={isLoadingThreads}
              selectedThreadId={selectedThreadId}
              onSelectThread={setSelectedThreadId}
            />
          </div>
        </aside>

        <div className="min-h-0 flex flex-col">
          <ThreadView
            thread={selectedThread ?? null}
            messages={messages}
            isLoadingThread={!!selectedThreadId && isLoadingThread}
            isLoadingMessages={isLoadingMessages}
            onSendMessage={handleSendMessage}
            isSending={sendMutation.isPending}
            onCreateTask={handleCreateTask}
            onRequestApproval={handleRequestApproval}
          />
        </div>
      </div>

      {!isLoadingThreads && threads.length === 0 && (
        <Card className="mt-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="size-12 text-muted-foreground mb-4" />
            <p className="text-body font-medium text-center">No threads yet</p>
            <p className="text-small text-muted-foreground text-center mt-1">
              Start a conversation from a decision, document, or task to see threads here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
