import { FileCheck, FileText, CheckSquare, FolderKanban, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ContextualThread, ThreadContextType } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export interface ThreadListProps {
  threads: ContextualThread[]
  isLoading: boolean
  selectedThreadId: string | null
  onSelectThread: (id: string) => void
  className?: string
}

const CONTEXT_ICONS: Record<ThreadContextType, React.ComponentType<{ className?: string }>> = {
  decision: FileCheck,
  document: FileText,
  task: CheckSquare,
  project: FolderKanban,
}

function formatRelativeTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`
  return d.toLocaleDateString()
}

function groupThreadsByContext(threads: ContextualThread[]): Map<ThreadContextType, ContextualThread[]> {
  const map = new Map<ThreadContextType, ContextualThread[]>()
  const order: ThreadContextType[] = ['decision', 'document', 'task', 'project']
  order.forEach((t) => map.set(t, []))
  threads
    .slice()
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
    .forEach((t) => {
      const list = map.get(t.contextType)
      if (list) list.push(t)
    })
  return map
}

const CONTEXT_LABELS: Record<ThreadContextType, string> = {
  decision: 'Decisions',
  document: 'Documents',
  task: 'Tasks',
  project: 'Project',
}

export function ThreadList({
  threads,
  isLoading,
  selectedThreadId,
  onSelectThread,
  className,
}: ThreadListProps) {
  const grouped = groupThreadsByContext(threads)

  if (isLoading) {
    return (
      <div className={cn('flex flex-col gap-4 p-4', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col overflow-auto', className)}>
      {Array.from(grouped.entries()).map(([contextType, list]) => {
        if (list.length === 0) return null
        const Icon = CONTEXT_ICONS[contextType]
        const label = CONTEXT_LABELS[contextType]
        return (
          <div key={contextType} className="border-b border-border last:border-b-0">
            <div className="sticky top-0 z-10 flex items-center gap-2 bg-card px-3 py-2 text-small font-medium text-muted-foreground">
              <Icon className="size-4 shrink-0" />
              <span>{label}</span>
            </div>
            <ul className="p-2 space-y-0.5">
              {list.map((thread) => {
                const isSelected = selectedThreadId === thread.id
                const hasUnread = thread.unreadCount > 0
                return (
                  <li key={thread.id}>
                    <button
                      type="button"
                      onClick={() => onSelectThread(thread.id)}
                      className={cn(
                        'w-full text-left rounded-lg px-3 py-2.5 transition-all duration-200',
                        'hover:bg-accent/10 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        isSelected
                          ? 'bg-primary/10 text-primary shadow-sm'
                          : 'text-foreground',
                        hasUnread && 'font-medium'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-body truncate flex-1 min-w-0">
                          {thread.contextTitle}
                        </span>
                        {hasUnread && (
                          <Badge
                            variant="default"
                            className="shrink-0 h-5 min-w-[20px] flex items-center justify-center rounded-full px-1.5 text-small"
                          >
                            {thread.unreadCount > 99 ? '99+' : thread.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-small text-muted-foreground truncate mt-0.5">
                        {thread.subject}
                      </p>
                      <p className="text-small text-muted-foreground/80 mt-0.5 flex items-center gap-1">
                        <MessageSquare className="size-3 shrink-0" />
                        {formatRelativeTime(thread.lastMessageAt)}
                        {thread.lastMessagePreview && (
                          <span className="truncate"> · {thread.lastMessagePreview}</span>
                        )}
                      </p>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
