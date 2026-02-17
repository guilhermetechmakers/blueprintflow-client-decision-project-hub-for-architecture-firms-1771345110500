import { CheckSquare, UserPlus, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ContextualThread, ContextualMessage, MessageAttachment } from '@/types'
import { MessageComposer } from './MessageComposer'

export interface ThreadViewProps {
  thread: ContextualThread | null
  messages: ContextualMessage[]
  isLoadingThread: boolean
  isLoadingMessages: boolean
  onSendMessage: (body: {
    body: string
    attachmentUrls?: string[]
    mentions?: string[]
    relatedItemId?: string
    relatedItemType?: import('@/types').ThreadContextType
  }) => void
  isSending?: boolean
  onCreateTask?: (threadId: string) => void
  onRequestApproval?: (threadId: string) => void
  className?: string
}

function formatMessageTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  if (sameDay) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function AttachmentPreview({ att }: { att: MessageAttachment }) {
  const isImage = att.contentType.startsWith('image/')
  return (
    <a
      href={att.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1 text-small text-foreground no-underline transition-colors hover:bg-accent/10 hover:border-accent/30"
    >
      {isImage ? (
        <img
          src={att.url}
          alt={att.name}
          className="h-10 w-10 rounded object-cover"
        />
      ) : (
        <span className="truncate max-w-[120px]">{att.name}</span>
      )}
    </a>
  )
}

export function ThreadView({
  thread,
  messages,
  isLoadingThread,
  isLoadingMessages,
  onSendMessage,
  isSending = false,
  onCreateTask,
  onRequestApproval,
  className,
}: ThreadViewProps) {
  if (!thread && !isLoadingThread) {
    return (
      <div
        className={cn(
          'flex flex-col h-full min-h-0 rounded-lg border border-border bg-card',
          className
        )}
      >
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
          <MessageSquare className="size-12 text-muted-foreground mb-4" aria-hidden />
          <p className="text-body font-medium text-foreground">Select a thread</p>
          <p className="text-small text-muted-foreground mt-1 max-w-sm">
            Choose a thread from the list to view messages, add replies, and use quick actions like create task or request approval.
          </p>
        </div>
      </div>
    )
  }

  if (isLoadingThread || !thread) {
    return (
      <div className={cn('flex flex-col h-full rounded-lg border border-border bg-card', className)}>
        <div className="border-b border-border p-4">
          <Skeleton className="h-6 w-[75%] mb-2 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-16 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  return (
    <div className={cn('flex flex-col h-full min-h-0 rounded-lg border border-border bg-card overflow-hidden', className)}>
      <div className="shrink-0 border-b border-border p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-h3 font-semibold text-foreground">{thread.subject}</h2>
            <p className="text-small text-muted-foreground mt-0.5">
              {thread.contextTitle} · {thread.participantCount} participant
              {thread.participantCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            {onCreateTask && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => onCreateTask(thread.id)}
                aria-label="Create task from this thread"
              >
                <CheckSquare className="size-4" />
                Create task
              </Button>
            )}
            {onRequestApproval && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => onRequestApproval(thread.id)}
                aria-label="Request approval for this thread"
              >
                <UserPlus className="size-4" />
                Request approval
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0" role="log" aria-live="polite" aria-label="Thread messages">
        {isLoadingMessages ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="size-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-12 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <p className="text-body text-muted-foreground text-center">
              No messages yet. Start the conversation below.
            </p>
          </div>
        ) : (
          <ul className="p-4 space-y-4 animate-fade-in">
            {sortedMessages.map((msg) => (
              <li key={msg.id} className="flex gap-3">
                <div
                  className="size-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary text-small font-medium"
                  aria-hidden
                >
                  {msg.authorName.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-body font-medium text-foreground">
                      {msg.authorName}
                    </span>
                    <span className="text-small text-muted-foreground">
                      {formatMessageTime(msg.createdAt)}
                    </span>
                  </div>
                  <div className="mt-1 text-body text-foreground prose prose-sm max-w-none dark:prose-invert">
                    {msg.body}
                  </div>
                  {msg.attachments?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.attachments.map((att) => (
                        <AttachmentPreview key={att.id} att={att} />
                      ))}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <MessageComposer
        onSend={onSendMessage}
        isSubmitting={isSending}
        className="shrink-0"
      />
    </div>
  )
}
