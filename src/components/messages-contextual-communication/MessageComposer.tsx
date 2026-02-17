import { useRef, useState } from 'react'
import { Send, Paperclip, AtSign, Link2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { ThreadContextType } from '@/types'

const RELATED_ITEM_OPTIONS: { value: ThreadContextType; label: string }[] = [
  { value: 'decision', label: 'Decision' },
  { value: 'document', label: 'Document' },
  { value: 'task', label: 'Task' },
  { value: 'project', label: 'Project' },
]

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
  placeholder = 'Write a message... Use @ to mention someone, add attachments, or link to a decision, document, or task.',
  className,
}: MessageComposerProps) {
  const [body, setBody] = useState('')
  const [relatedItemId, setRelatedItemId] = useState('')
  const [relatedItemType, setRelatedItemType] = useState<ThreadContextType | ''>('')
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([])
  const [pendingFileNames, setPendingFileNames] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    const trimmed = body.trim()
    if (!trimmed || isSubmitting) return
    const mentions = (trimmed.match(/@[\w-]+/g) ?? []).map((m) => m.slice(1))
    onSend({
      body: trimmed,
      attachmentUrls: attachmentUrls.length > 0 ? attachmentUrls : undefined,
      mentions: mentions.length ? mentions : undefined,
      relatedItemId: relatedItemId.trim() || undefined,
      relatedItemType: relatedItemType || undefined,
    })
    setBody('')
    setRelatedItemId('')
    setRelatedItemType('')
    setAttachmentUrls([])
    setPendingFileNames([])
    textareaRef.current?.focus()
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    const names = Array.from(files).map((f) => f.name)
    setPendingFileNames((prev) => [...prev, ...names])
    toast.info(
      names.length === 1
        ? `"${names[0]}" ready to attach (upload requires backend).`
        : `${names.length} files ready (upload requires backend).`
    )
    e.target.value = ''
  }

  const removePendingFile = (index: number) => {
    setPendingFileNames((prev) => prev.filter((_, i) => i !== index))
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
        className="min-h-[80px] resize-y transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        disabled={isSubmitting}
        aria-label="Message text"
      />
      {pendingFileNames.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {pendingFileNames.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-1 text-small"
            >
              <span className="truncate max-w-[120px]">{name}</span>
              <button
                type="button"
                onClick={() => removePendingFile(i)}
                className="rounded p-0.5 hover:bg-muted-foreground/20 transition-colors"
                aria-label={`Remove ${name}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 flex-wrap">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="sr-only"
            onChange={handleFileChange}
            aria-hidden
          />
          <Button
            type="button"
            variant="tertiary"
            size="icon"
            className="size-9 rounded-md transition-all duration-200 hover:scale-105"
            onClick={handleAttachClick}
            aria-label="Attach file"
            title="Attach files"
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
            Link to:
          </span>
          <select
            value={relatedItemType}
            onChange={(e) => setRelatedItemType(e.target.value as ThreadContextType | '')}
            className={cn(
              'h-9 rounded-md border border-input bg-background px-2 text-small focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
            aria-label="Related item type"
          >
            <option value="">None</option>
            {RELATED_ITEM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {relatedItemType && (
            <input
              type="text"
              value={relatedItemId}
              onChange={(e) => setRelatedItemId(e.target.value)}
              placeholder="Item ID"
              className={cn(
                'h-9 w-28 rounded-md border border-input bg-background px-2 text-small focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
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
