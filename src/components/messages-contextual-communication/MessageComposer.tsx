import { useRef, useState } from 'react'
import { Send, Paperclip, AtSign, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { ThreadContextType } from '@/types'

export interface MessageComposerProps {
  onSend: (body: {
    body: string
    attachmentUrls?: string[]
    mentions?: string[]
    relatedItemId?: string
    relatedItemType?: ThreadContextType
  }) => void
  isSubmitting?: boolean
  placeholder?: string
  className?: string
}

export function MessageComposer({
  onSend,
  isSubmitting = false,
  placeholder = 'Write a message... Use @ to mention, add attachments, or link to a decision, document, or task.',
  className,
}: MessageComposerProps) {
  const [body, setBody] = useState('')
  const [relatedItemId, setRelatedItemId] = useState('')
  const [relatedItemType, setRelatedItemType] = useState<ThreadContextType | ''>('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    const trimmed = body.trim()
    if (!trimmed || isSubmitting) return
    const mentions = (trimmed.match(/@[\w-]+/g) ?? []).map((m) => m.slice(1))
    onSend({
      body: trimmed,
      mentions: mentions.length ? mentions : undefined,
      relatedItemId: relatedItemId.trim() || undefined,
      relatedItemType: relatedItemType || undefined,
    })
    setBody('')
    setRelatedItemId('')
    setRelatedItemType('')
    textareaRef.current?.focus()
  }

  return (
    <div className={cn('flex flex-col gap-2 border-t border-border bg-card p-3', className)}>
      <Textarea
        ref={textareaRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
          }
        }}
        placeholder={placeholder}
        rows={3}
        className="min-h-[80px] resize-y transition-colors focus-visible:ring-2 focus-visible:ring-accent"
        disabled={isSubmitting}
        aria-label="Message text"
      />
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="tertiary"
            size="icon"
            className="size-9 rounded-md transition-all duration-200 hover:scale-105"
            aria-label="Attach file"
          >
            <Paperclip className="size-4" />
          </Button>
          <Button
            type="button"
            variant="tertiary"
            size="icon"
            className="size-9 rounded-md transition-all duration-200 hover:scale-105"
            aria-label="Mention someone"
            title="Use @username in the message"
          >
            <AtSign className="size-4" />
          </Button>
          <span className="text-small text-muted-foreground flex items-center gap-1 px-1">
            <Link2 className="size-3" />
            Link to item:
          </span>
          <select
            value={relatedItemType}
            onChange={(e) => setRelatedItemType(e.target.value as ThreadContextType | '')}
            className={cn(
              'h-8 rounded border border-input bg-background px-2 text-small focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
            )}
            aria-label="Related item type"
          >
            <option value="">None</option>
            <option value="decision">Decision</option>
            <option value="document">Document</option>
            <option value="task">Task</option>
            <option value="project">Project</option>
          </select>
          {relatedItemType && (
            <input
              type="text"
              value={relatedItemId}
              onChange={(e) => setRelatedItemId(e.target.value)}
              placeholder="ID"
              className={cn(
                'h-8 w-24 rounded border border-input bg-background px-2 text-small focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
              )}
              aria-label="Related item ID"
            />
          )}
        </div>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!body.trim() || isSubmitting}
          className="ml-auto transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Send className="size-4" />
          {isSubmitting ? 'Sending…' : 'Send'}
        </Button>
      </div>
    </div>
  )
}
