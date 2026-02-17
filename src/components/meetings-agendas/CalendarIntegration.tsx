import { CalendarPlus, Users, Check, Minus, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { MeetingRsvp } from '@/types'

export interface CalendarIntegrationProps {
  meetingId: string
  meetingTitle: string
  startAt?: string
  endAt?: string
  location?: string
  rsvps: MeetingRsvp[]
  icsUrl: string | null
  isLoadingRsvps: boolean
  isLoadingIcs: boolean
  onAddToCalendar?: () => void
  onRsvp?: (status: MeetingRsvp['status']) => void
  currentUserRsvp?: MeetingRsvp['status']
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export function CalendarIntegration({
  meetingId: _meetingId,
  meetingTitle: _meetingTitle,
  startAt,
  endAt,
  location,
  rsvps,
  icsUrl,
  isLoadingRsvps,
  isLoadingIcs,
  onAddToCalendar,
  onRsvp,
  currentUserRsvp,
}: CalendarIntegrationProps) {
  const going = rsvps.filter((r) => r.status === 'going').length
  const maybe = rsvps.filter((r) => r.status === 'maybe').length
  const declined = rsvps.filter((r) => r.status === 'declined').length

  const handleDownloadIcs = () => {
    if (icsUrl) {
      window.open(icsUrl, '_blank')
      return
    }
    onAddToCalendar?.()
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-h3 font-semibold flex items-center gap-2">
          <CalendarPlus className="size-5 text-primary" />
          Calendar & RSVPs
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {startAt && (
          <div className="text-body text-foreground">
            <p className="font-medium">When</p>
            <p className="text-muted-foreground mt-0.5">
              {formatDate(startAt)}
              {endAt && ` – ${formatDate(endAt)}`}
            </p>
          </div>
        )}
        {location && (
          <div className="text-body text-foreground">
            <p className="font-medium">Where</p>
            <p className="text-muted-foreground mt-0.5">{location}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {isLoadingIcs ? (
            <Skeleton className="h-10 w-40 rounded-md" />
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              onClick={handleDownloadIcs}
            >
              <CalendarPlus className="size-4" />
              Add to calendar (ICS)
            </Button>
          )}
        </div>

        {onRsvp && (
          <div className="pt-2 border-t border-border">
            <p className="text-small font-medium text-foreground mb-2">Your response</p>
            <div className="flex flex-wrap gap-2">
              {(['going', 'maybe', 'declined'] as const).map((status) => (
                <Button
                  key={status}
                  variant={currentUserRsvp === status ? 'primary' : 'secondary'}
                  size="sm"
                  className="capitalize transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => onRsvp(status)}
                >
                  {status === 'going' && <Check className="size-4" />}
                  {status === 'maybe' && <Minus className="size-4" />}
                  {status === 'declined' && <X className="size-4" />}
                  {status}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-border">
          <p className="text-small font-medium text-foreground mb-2 flex items-center gap-2">
            <Users className="size-4" />
            RSVPs
          </p>
          {isLoadingRsvps ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          ) : rsvps.length === 0 ? (
            <p className="text-small text-muted-foreground">No RSVPs yet. Use the buttons above to respond.</p>
          ) : (
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="success" className="font-normal">
                {going} going
              </Badge>
              {maybe > 0 && (
                <Badge variant="secondary" className="font-normal">
                  {maybe} maybe
                </Badge>
              )}
              {declined > 0 && (
                <Badge variant="outline" className="font-normal">
                  {declined} declined
                </Badge>
              )}
            </div>
          )}
          <ul className="space-y-1.5" role="list">
            {rsvps.map((r) => (
              <li
                key={r.id}
                className={cn(
                  'flex items-center justify-between text-small rounded-md px-2 py-1.5 transition-colors',
                  'bg-muted/50'
                )}
              >
                <span className="font-medium text-foreground">{r.userName}</span>
                <Badge
                  variant={r.status === 'going' ? 'success' : r.status === 'maybe' ? 'secondary' : 'outline'}
                  className="capitalize text-xs"
                >
                  {r.status}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
