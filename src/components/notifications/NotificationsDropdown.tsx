import { Link } from 'react-router-dom'
import { Bell, Settings, FileCheck, Upload, MessageSquare, Mail, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNotifications, useMarkAllNotificationsRead } from '@/hooks/use-notifications'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { NotificationType } from '@/types'

const NOTIFICATION_LIMIT = 10

function formatTime(iso: string): string {
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

function iconForType(type: NotificationType) {
  switch (type) {
    case 'approval':
      return FileCheck
    case 'upload':
      return Upload
    case 'comment':
    case 'mention':
      return MessageSquare
    case 'weekly_summary':
      return Mail
    default:
      return Bell
  }
}

export function NotificationsDropdown() {
  const { data: notifications, isLoading } = useNotifications({
    limit: NOTIFICATION_LIMIT,
  })
  const markAllRead = useMarkAllNotificationsRead()
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="tertiary"
          size="icon"
          className="size-10 rounded-full relative"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white"
              aria-hidden
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] p-0" sideOffset={8}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-body font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="tertiary"
              size="sm"
              className="text-small text-muted-foreground h-7"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-[320px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="size-9 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : !notifications?.length ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground">
              <Bell className="size-10 mb-2 opacity-50" aria-hidden />
              <p className="text-body">No notifications yet</p>
              <p className="text-small mt-1">Comments, approvals, and updates will appear here.</p>
            </div>
          ) : (
            <ul className="py-1" role="list">
              {notifications.map((item) => {
                const Icon = iconForType(item.type)
                return (
                  <li key={item.id}>
                    <Link
                      to={item.link ?? '#'}
                      className={cn(
                        'flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50 focus:bg-muted/50 focus:outline-none',
                        !item.read && 'bg-primary/5'
                      )}
                    >
                      <span
                        className={cn(
                          'size-9 rounded-full flex items-center justify-center shrink-0',
                          item.read ? 'bg-muted' : 'bg-primary/10 text-primary'
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={cn(
                          'text-body truncate',
                          !item.read ? 'font-medium text-foreground' : 'text-muted-foreground'
                        )}>
                          {item.title}
                        </p>
                        {item.projectName && (
                          <p className="text-small text-muted-foreground truncate">
                            {item.projectName} · {formatTime(item.createdAt)}
                          </p>
                        )}
                        {!item.projectName && (
                          <p className="text-small text-muted-foreground">
                            {formatTime(item.createdAt)}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground shrink-0 self-center" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        <div className="border-t border-border px-2 py-2">
          <Link
            to="/dashboard/settings#notifications"
            className="flex items-center gap-2 rounded-md px-2 py-2 text-small font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <Settings className="size-4" />
            Notification settings
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
