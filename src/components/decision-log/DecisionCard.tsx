import { ThumbsUp, Check, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Decision } from '@/types'

export interface DecisionCardProps {
  decision: Decision
  isSelected: boolean
  onSelect: () => void
  onApproveClick: () => void
}

function statusVariant(
  status: Decision['status']
): 'default' | 'secondary' | 'success' | 'warning' | 'accent' {
  switch (status) {
    case 'approved':
      return 'success'
    case 'pending':
      return 'warning'
    case 'changes_requested':
      return 'accent'
    case 'draft':
      return 'secondary'
    default:
      return 'default'
  }
}

export function DecisionCard({
  decision,
  isSelected,
  onSelect,
  onApproveClick,
}: DecisionCardProps) {
  const statusV = statusVariant(decision.status)
  const showApprovalCta =
    decision.status === 'pending' || decision.status === 'changes_requested'

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:scale-[1.01] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none',
        isSelected && 'ring-2 ring-primary border-primary/50 shadow-card-hover'
      )}
      aria-pressed={isSelected}
      aria-label={`View decision: ${decision.title}`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-body font-semibold truncate pr-2">{decision.title}</h3>
          {decision.phase && (
            <p className="text-small text-muted-foreground mt-0.5">{decision.phase}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant={statusV} className="uppercase tracking-wide">
            {decision.status.replace('_', ' ')}
          </Badge>
          <ChevronRight
            className={cn(
              'size-4 text-muted-foreground transition-transform',
              isSelected && 'translate-x-0.5'
            )}
            aria-hidden
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {decision.description && (
          <p className="text-small text-muted-foreground line-clamp-2">
            {decision.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {decision.options.map((opt) => (
            <span
              key={opt.id}
              className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-small"
            >
              {decision.recommendedOptionId === opt.id && (
                <ThumbsUp className="size-3 text-accent shrink-0" aria-hidden />
              )}
              <span className="truncate max-w-[120px]">{opt.title}</span>
              {opt.costDelta != null && opt.costDelta > 0 && (
                <span className="text-warning text-xs">+${opt.costDelta.toLocaleString()}</span>
              )}
            </span>
          ))}
        </div>
        {showApprovalCta && (
          <Button
            size="sm"
            className="w-full mt-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={(e) => {
              e.stopPropagation()
              onApproveClick()
            }}
          >
            <Check className="size-4" />
            Approve / Request changes
          </Button>
        )}
        {decision.status === 'approved' && decision.approvedBy && (
          <p className="text-small text-muted-foreground">
            Approved by {decision.approvedBy}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
