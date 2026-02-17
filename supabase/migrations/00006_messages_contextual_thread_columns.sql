-- Add optional columns to contextual thread table for grouping by context (decision, document, task, project).
-- title/description remain; new columns support Thread List "grouped by context" and labels.

ALTER TABLE "messages_(contextual_communication)"
  ADD COLUMN IF NOT EXISTS project_id UUID,
  ADD COLUMN IF NOT EXISTS context_type TEXT,
  ADD COLUMN IF NOT EXISTS context_id TEXT,
  ADD COLUMN IF NOT EXISTS context_title TEXT,
  ADD COLUMN IF NOT EXISTS subject TEXT;

COMMENT ON COLUMN "messages_(contextual_communication)".context_type IS 'One of: decision, document, task, project';
COMMENT ON COLUMN "messages_(contextual_communication)".context_title IS 'Display label e.g. decision X, drawing Y';
COMMENT ON COLUMN "messages_(contextual_communication)".subject IS 'Thread subject line';
