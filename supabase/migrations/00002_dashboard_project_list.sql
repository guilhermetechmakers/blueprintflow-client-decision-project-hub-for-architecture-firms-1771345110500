-- dashboard_(project_list) table for project list dashboard records
-- Apply when using Supabase. Table name in DB: dashboard_(project_list).

CREATE TABLE IF NOT EXISTS "dashboard_(project_list)" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE "dashboard_(project_list)" ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "dashboard_project_list_read_own" ON "dashboard_(project_list)"
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "dashboard_project_list_insert_own" ON "dashboard_(project_list)"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "dashboard_project_list_update_own" ON "dashboard_(project_list)"
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "dashboard_project_list_delete_own" ON "dashboard_(project_list)"
  FOR DELETE USING (auth.uid() = user_id);
