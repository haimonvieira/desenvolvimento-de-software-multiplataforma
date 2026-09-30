--> statement-breakpoint
CREATE FUNCTION create_upload_batch(
  p_id text,
  p_base_commit_sha text,
  p_owner_admin_id text,
  p_total_bytes integer,
  p_expires_at timestamptz,
  p_files jsonb
)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  file jsonb;
BEGIN
  INSERT INTO upload_batch (id, base_commit_sha, owner_admin_id, status, total_bytes, expires_at)
  VALUES (p_id, p_base_commit_sha, p_owner_admin_id, 'draft', p_total_bytes, p_expires_at);
  FOR file IN SELECT value FROM jsonb_array_elements(p_files) LOOP
    INSERT INTO staged_upload_file (batch_id, destination, mime_type, size, blob_sha)
    VALUES (p_id, file->>'destination', file->>'mimeType', (file->>'size')::integer, NULL);
  END LOOP;
END;
$$;
