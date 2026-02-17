import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageSquare, FileCheck, Upload, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActivityFeedItem } from '@/hooks/use-activity-feed'

export interface ActivityFeedProps {
  items: ActivityFeedItem[] | undefined
  isLoading: boolean
  className?: string
}

function formatRelativeTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffM = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffMs / 86400000)
  if (diffM < 60) return `${diffM}m ago`
  if (diffH < 24) return `${diffH}h ago`
  if (diffD < 7) return `${diffD}d ago`
  return d.toLocaleDateString()
}

function iconForItem(item: ActivityFeedItem) {
  if (item.subtype === 'approval') return FileCheck
  if (item.subtype === 'upload') return Upload
  if (item.subtype === 'comment') return MessageSquare
  return MessageSquare
}

export function ActivityFeed({
  items,
  isLoading,
  className,
}: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card className={cn('animate-fade-in', className)}>
        <CardHeader>
          <CardTitle className="text-h3">Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const empty = !items?.length

  return (
    <Card className={cn('animate-fade-in', className)}>
      <CardHeader>
        <CardTitle className="text-h3">Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        {empty ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <Inbox className="size-10 mb-2 opacity-50" aria-hidden />
            <p className="text-body">No recent activity</p>
            <p className="text-small mt-1">Comments, approvals, and uploads will appear here.</p>
          </div>
        ) : (
          <ul className="space-y-3" role="list">
            {items.map((item, index) => {
              const Icon = iconForItem(item)
              return (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-md p-2 -mx-2 transition-colors hover:bg-muted/50"
                  style={{
                    animationDelay: `${index * 40}ms`,
                  }}
                >
                  <span
                    className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
                    aria-hidden
                  >
                    <Icon className="size-4 text-primary" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-body font-medium text-foreground truncate">
                      {item.title}
                    </p>
                    <p className="text-small text-muted-foreground">
                      {item.projectName && (
                        <span className="truncate">{item.projectName} · </span>
                      )}
                      {formatRelativeTime(item.timestamp)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
