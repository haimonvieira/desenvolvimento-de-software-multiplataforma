ALTER TABLE "upload_batch" ADD COLUMN "published_commit_sha" text;
--> statement-breakpoint
ALTER TABLE "upload_batch" ADD COLUMN "published_commit_url" text;
--> statement-breakpoint
ALTER TABLE "upload_batch" ADD COLUMN "published_at" timestamp with time zone;
--> statement-breakpoint
CREATE FUNCTION rename_upload_batch_files(
  p_batch_id text,
  p_mapping jsonb
)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  item jsonb;
BEGIN
  FOR item IN SELECT value FROM jsonb_array_elements(p_mapping) LOOP
    UPDATE staged_upload_file
       SET destination = item->>'newDestination'
     WHERE batch_id = p_batch_id AND destination = item->>'destination';
    IF NOT FOUND THEN
      RAISE EXCEPTION 'staged destination % not found', item->>'destination';
    END IF;
  END LOOP;
END;
$$;
