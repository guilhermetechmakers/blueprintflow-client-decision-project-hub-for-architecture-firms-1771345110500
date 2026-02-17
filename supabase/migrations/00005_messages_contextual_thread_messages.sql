-- Messages belonging to a contextual thread (thread = "messages_(contextual_communication)").
-- Enables storing individual messages for the threaded messaging UI.

CREATE TABLE IF NOT EXISTS message_contextual_thread_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES "messages_(contextual_communication)"(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_message_contextual_thread_messages_thread_id
  ON message_contextual_thread_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_message_contextual_thread_messages_created_at
  ON message_contextual_thread_messages(thread_id, created_at);

ALTER TABLE message_contextual_thread_messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages in threads they can read (same as thread owner for now)
CREATE POLICY "message_contextual_thread_messages_select"
  ON message_contextual_thread_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "messages_(contextual_communication)" t
      WHERE t.id = thread_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "message_contextual_thread_messages_insert"
  ON message_contextual_thread_messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM "messages_(contextual_communication)" t
      WHERE t.id = thread_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "message_contextual_thread_messages_update_own"
  ON message_contextual_thread_messages
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "message_contextual_thread_messages_delete_own"
  ON message_contextual_thread_messages
  FOR DELETE
  USING (auth.uid() = user_id);
