import { useState } from 'react'
import {
  ThumbsUp,
  FileText,
  ExternalLink,
  Image as ImageIcon,
  MessageSquare,
  Check,
  Send,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Decision } from '@/types'
import { VersioningPanel } from './VersioningPanel'
import { useApproveDecision, useRequestChangesDecision, useAddDecisionComment } from '@/hooks/use-decisions'
import { toast } from 'sonner'

export interface DecisionDetailPaneProps {
  decision: Decision | null
  isLoading: boolean
  projectId: string | undefined
  onExportPdf: (decisionId: string) => void
  onClose?: () => void
  className?: string
}

export function DecisionDetailPane({
  decision,
  isLoading,
  projectId: _projectId,
  onExportPdf,
  onClose: _onClose,
  className,
}: DecisionDetailPaneProps) {
  const [commentText, setCommentText] = useState('')
  const [showRequestChanges, setShowRequestChanges] = useState(false)
  const [requestChangesComment, setRequestChangesComment] = useState('')

  const approveMutation = useApproveDecision()
  const requestChangesMutation = useRequestChangesDecision()
  const addCommentMutation = useAddDecisionComment(decision?.id)

  const handleApprove = (optionId: string) => {
    if (!decision) return
    approveMutation.mutate(
      { decisionId: decision.id, optionId },
      {
        onSuccess: () => toast.success('Decision approved'),
        onError: () => toast.error('Failed to approve'),
      }
    )
  }

  const handleRequestChanges = () => {
    if (!decision || !requestChangesComment.trim()) return
    requestChangesMutation.mutate(
      { decisionId: decision.id, comment: requestChangesComment },
      {
        onSuccess: () => {
          toast.success('Changes requested')
          setShowRequestChanges(false)
          setRequestChangesComment('')
        },
        onError: () => toast.error('Failed to submit'),
      }
    )
  }

  const handleAddComment = () => {
    if (!decision || !commentText.trim()) return
    addCommentMutation.mutate(commentText, {
      onSuccess: () => {
        toast.success('Comment added')
        setCommentText('')
      },
      onError: () => toast.error('Failed to add comment'),
    })
  }

  if (isLoading) {
    return (
      <aside
        className={cn(
          'flex flex-col border-l border-border bg-card overflow-hidden animate-fade-in',
          className
        )}
      >
        <div className="p-4 border-b border-border">
          <Skeleton className="h-7 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="p-4 space-y-4 flex-1 overflow-auto">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </aside>
    )
  }

  if (!decision) {
    return (
      <aside
        className={cn(
          'flex flex-col items-center justify-center p-8 border-l border-border bg-muted/20 text-center animate-fade-in',
          className
        )}
      >
        <FileText className="size-12 text-muted-foreground mb-4" />
        <p className="text-body text-muted-foreground">
          Select a decision to view details, compare options, and approve or request changes.
        </p>
      </aside>
    )
  }

  const isPending = decision.status === 'pending' || decision.status === 'changes_requested'

  return (
    <aside
      className={cn(
        'flex flex-col border-l border-border bg-card min-w-0 overflow-hidden animate-fade-in',
        className
      )}
      aria-label="Decision details"
    >
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-h3 font-semibold truncate">{decision.title}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge
                variant={
                  decision.status === 'approved'
                    ? 'success'
                    : decision.status === 'pending'
                      ? 'warning'
                      : 'accent'
                }
              >
                {decision.status.replace('_', ' ')}
              </Badge>
              {decision.phase && (
                <span className="text-small text-muted-foreground">{decision.phase}</span>
              )}
              {decision.assigneeName && (
                <span className="text-small text-muted-foreground">
                  Assignee: {decision.assigneeName}
                </span>
              )}
            </div>
          </div>
        </div>
        {decision.description && (
          <p className="text-body text-muted-foreground mt-2">{decision.description}</p>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Option comparison cards */}
        <section aria-labelledby="options-heading">
          <h3 id="options-heading" className="text-h3 font-semibold mb-3">
            Options
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {decision.options.map((opt) => (
              <Card
                key={opt.id}
                className={cn(
                  'overflow-hidden transition-all duration-200 hover:shadow-card-hover',
                  decision.recommendedOptionId === opt.id &&
                    'ring-2 ring-accent border-accent/30'
                )}
              >
                {opt.imageUrl && (
                  <div className="aspect-video bg-muted shrink-0 overflow-hidden">
                    <img
                      src={opt.imageUrl}
                      alt={opt.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                {!opt.imageUrl && opt.pdfUrl && (
                  <div className="aspect-video bg-muted flex items-center justify-center shrink-0">
                    <FileText className="size-10 text-muted-foreground" />
                    <a
                      href={opt.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-foreground/5 opacity-0 hover:opacity-100 transition-opacity text-primary text-small font-medium"
                    >
                      View PDF
                    </a>
                  </div>
                )}
                {!opt.imageUrl && !opt.pdfUrl && (
                  <div className="aspect-video bg-muted flex items-center justify-center shrink-0">
                    <ImageIcon className="size-10 text-muted-foreground" />
                  </div>
                )}
                <CardHeader className="flex flex-row items-start justify-between gap-2 pb-1">
                  <CardTitle className="text-body font-semibold">{opt.title}</CardTitle>
                  {decision.recommendedOptionId === opt.id && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 text-accent px-2 py-0.5 text-small font-medium">
                      <ThumbsUp className="size-3" />
                      Recommended
                    </span>
                  )}
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {opt.description && (
                    <p className="text-small text-muted-foreground">{opt.description}</p>
                  )}
                  {opt.costDelta != null && (
                    <p className="text-small font-medium">
                      Cost delta:{' '}
                      <span className={opt.costDelta > 0 ? 'text-warning' : 'text-success'}>
                        {opt.costDelta > 0 ? '+' : ''}${opt.costDelta.toLocaleString()}
                      </span>
                    </p>
                  )}
                  {opt.specLink && (
                    <a
                      href={opt.specLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-small text-primary hover:underline"
                    >
                      <ExternalLink className="size-3" />
                      Spec / link
                    </a>
                  )}
                  {isPending && (
                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleApprove(opt.id)}
                      disabled={approveMutation.isPending}
                    >
                      {approveMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      Approve this option
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recommendation */}
        {decision.recommendationText && (
          <section>
            <h3 className="text-h3 font-semibold mb-2">Recommendation</h3>
            <Card className="bg-muted/30 border-accent/20">
              <CardContent className="pt-4">
                <p className="text-body">{decision.recommendationText}</p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Discussion thread */}
        <section aria-labelledby="discussion-heading">
          <h3 id="discussion-heading" className="text-h3 font-semibold mb-2 flex items-center gap-2">
            <MessageSquare className="size-4" />
            Discussion
          </h3>
          <div className="space-y-3">
            {(decision.comments ?? []).map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-border bg-card p-3 animate-fade-in"
              >
                <p className="text-small font-medium text-foreground">{c.authorName}</p>
                <p className="text-small text-muted-foreground mt-0.5">{c.body}</p>
                <p className="text-small text-muted-foreground/80 mt-1">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
            {isPending && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  className="flex-1"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                  disabled={addCommentMutation.isPending}
                  aria-label="Comment text"
                />
                <Button
                  size="icon"
                  onClick={handleAddComment}
                  disabled={!commentText.trim() || addCommentMutation.isPending}
                  aria-label="Send comment"
                >
                  {addCommentMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Request changes */}
        {isPending && (
          <section>
            {!showRequestChanges ? (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShowRequestChanges(true)}
              >
                Request changes
              </Button>
            ) : (
              <Card className="border-warning/30">
                <CardContent className="pt-4 space-y-2">
                  <label htmlFor="request-changes-comment" className="text-small font-medium">
                    Describe requested changes
                  </label>
                  <Input
                    id="request-changes-comment"
                    placeholder="What should be changed?"
                    value={requestChangesComment}
                    onChange={(e) => setRequestChangesComment(e.target.value)}
                    disabled={requestChangesMutation.isPending}
                    className="mt-1"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setShowRequestChanges(false)
                        setRequestChangesComment('')
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleRequestChanges}
                      disabled={!requestChangesComment.trim() || requestChangesMutation.isPending}
                    >
                      {requestChangesMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : null}
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        )}

        {/* Version history */}
        <VersioningPanel
          decisionId={decision.id}
          onExportPdf={onExportPdf}
        />
      </div>
    </aside>
  )
}
