-- project_tasks: action items linked to decisions and timeline milestones
CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  assignee_id UUID,
  due_date DATE,
  decision_id UUID,
  milestone_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_tasks_read_own" ON project_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "project_tasks_insert_own" ON project_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "project_tasks_update_own" ON project_tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "project_tasks_delete_own" ON project_tasks
  FOR DELETE USING (auth.uid() = user_id);

-- rfis: requests for information
CREATE TABLE IF NOT EXISTS rfis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'answered', 'closed')),
  question TEXT NOT NULL,
  response TEXT,
  asked_by_id UUID,
  answered_by_id UUID,
  answered_at TIMESTAMP WITH TIME ZONE,
  decision_id UUID,
  milestone_id UUID,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE rfis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rfis_read_own" ON rfis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "rfis_insert_own" ON rfis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "rfis_update_own" ON rfis
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "rfis_delete_own" ON rfis
  FOR DELETE USING (auth.uid() = user_id);

-- change_requests: formal change requests
CREATE TABLE IF NOT EXISTS change_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
  impact_scope TEXT,
  cost_impact NUMERIC(12, 2),
  schedule_impact TEXT,
  submitted_by_id UUID,
  submitted_at TIMESTAMP WITH TIME ZONE,
  decision_id UUID,
  milestone_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE change_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "change_requests_read_own" ON change_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "change_requests_insert_own" ON change_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "change_requests_update_own" ON change_requests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "change_requests_delete_own" ON change_requests
  FOR DELETE USING (auth.uid() = user_id);
