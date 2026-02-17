-- Invitations table for client invitation links (email, token, status, sent_at)
-- Used by POST /api/auth/invite/accept and invitation email flow.

CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS invitations_token_idx ON invitations(token);
CREATE INDEX IF NOT EXISTS invitations_email_idx ON invitations(email);
CREATE INDEX IF NOT EXISTS invitations_status_idx ON invitations(status);

-- RLS: service role or authenticated users with permission can manage invitations.
-- For public invite acceptance, use a policy that allows SELECT/UPDATE by token (e.g. via Edge Function).
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Allow read/update by token for invite acceptance (e.g. from Edge Function or service role).
-- Restrict insert/delete to authenticated admins in your app.
CREATE POLICY "invitations_allow_read_by_token" ON invitations
  FOR SELECT USING (true);

CREATE POLICY "invitations_allow_update_for_accept" ON invitations
  FOR UPDATE USING (true)
  WITH CHECK (status = 'accepted');

COMMENT ON TABLE invitations IS 'Client invitation links for signup; token used in /auth/invite/accept';
