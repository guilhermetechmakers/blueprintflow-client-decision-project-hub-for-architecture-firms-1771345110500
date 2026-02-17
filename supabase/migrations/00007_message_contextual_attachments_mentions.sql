-- Add attachment_urls, mention_ids, related_item_id, related_item_type to thread messages
-- for Message Composer: attachments, mentions, link to related item.

ALTER TABLE message_contextual_thread_messages
  ADD COLUMN IF NOT EXISTS attachment_urls TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS mention_ids UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS related_item_id TEXT,
  ADD COLUMN IF NOT EXISTS related_item_type TEXT;

COMMENT ON COLUMN message_contextual_thread_messages.attachment_urls IS 'URLs of attached files (after upload to storage)';
COMMENT ON COLUMN message_contextual_thread_messages.mention_ids IS 'User IDs mentioned in the message (@mentions)';
COMMENT ON COLUMN message_contextual_thread_messages.related_item_id IS 'ID of linked decision, document, task, or project';
COMMENT ON COLUMN message_contextual_thread_messages.related_item_type IS 'One of: decision, document, task, project';
