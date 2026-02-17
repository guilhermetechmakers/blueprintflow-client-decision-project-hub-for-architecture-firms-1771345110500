-- messages_(contextual_communication) table for contextual messaging records
-- Apply when using Supabase. Table name in DB: messages_(contextual_communication).

CREATE TABLE IF NOT EXISTS "messages_(contextual_communication)" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE "messages_(contextual_communication)" ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "messages_contextual_communication_read_own" ON "messages_(contextual_communication)"
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "messages_contextual_communication_insert_own" ON "messages_(contextual_communication)"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "messages_contextual_communication_update_own" ON "messages_(contextual_communication)"
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "messages_contextual_communication_delete_own" ON "messages_(contextual_communication)"
  FOR DELETE USING (auth.uid() = user_id);
