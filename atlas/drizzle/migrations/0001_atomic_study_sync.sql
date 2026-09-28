ALTER TABLE "study_progress" DROP CONSTRAINT "study_progress_pkey";
--> statement-breakpoint
ALTER TABLE "favorite" DROP CONSTRAINT "favorite_pkey";
--> statement-breakpoint
ALTER TABLE "note" DROP CONSTRAINT "note_pkey";
--> statement-breakpoint
ALTER TABLE "flashcard" DROP CONSTRAINT "flashcard_pkey";
--> statement-breakpoint
ALTER TABLE "study_progress" ADD CONSTRAINT "study_progress_profile_id_id_pk" PRIMARY KEY("profile_id", "id");
--> statement-breakpoint
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_profile_id_id_pk" PRIMARY KEY("profile_id", "id");
--> statement-breakpoint
ALTER TABLE "note" ADD CONSTRAINT "note_profile_id_id_pk" PRIMARY KEY("profile_id", "id");
--> statement-breakpoint
ALTER TABLE "flashcard" ADD CONSTRAINT "flashcard_profile_id_id_pk" PRIMARY KEY("profile_id", "id");
--> statement-breakpoint
CREATE TABLE "sync_operation" (
  "sequence" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "profile_id" text NOT NULL REFERENCES "study_profile"("id") ON DELETE cascade,
  "operation_id" text NOT NULL,
  "device_id" text NOT NULL,
  "change" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "sync_operation_profile_operation_uidx" ON "sync_operation" ("profile_id", "operation_id");
--> statement-breakpoint
CREATE TABLE "note_conflict" (
  "id" text NOT NULL,
  "profile_id" text NOT NULL REFERENCES "study_profile"("id") ON DELETE cascade,
  "note_id" text NOT NULL,
  "versions" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "note_conflict_profile_id_id_pk" PRIMARY KEY("profile_id", "id")
);
--> statement-breakpoint
CREATE INDEX "note_conflict_profile_id_idx" ON "note_conflict" ("profile_id");
--> statement-breakpoint
CREATE FUNCTION sync_study(p_profile_id text, p_request jsonb)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE
  op jsonb;
  change jsonb;
  op_sequence bigint;
  request_cursor bigint := COALESCE((p_request->>'cursor')::bigint, 0);
  entity_id text;
  changed_at timestamptz;
  existing_note note%ROWTYPE;
  incoming_note jsonb;
  conflict_id text;
  next_cursor bigint;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM study_profile WHERE id = p_profile_id) THEN
    RAISE EXCEPTION 'profile not found' USING ERRCODE = '42501';
  END IF;

  FOR op IN SELECT value FROM jsonb_array_elements(COALESCE(p_request->'outbox', '[]'::jsonb)) LOOP
    change := op->'change';
    INSERT INTO sync_operation (profile_id, operation_id, device_id, change)
    VALUES (p_profile_id, op->>'id', p_request->>'deviceId', change::text)
    ON CONFLICT (profile_id, operation_id) DO NOTHING
    RETURNING sequence INTO op_sequence;
    IF op_sequence IS NULL THEN CONTINUE; END IF;

    IF change->>'type' = 'progress.set' THEN
      entity_id := (change->'material'->>'commitSha') || ':' || (change->'material'->>'path');
      changed_at := (change->>'at')::timestamptz;
      INSERT INTO study_progress (id, profile_id, material_path, material_commit_sha, status, updated_at)
      VALUES (entity_id, p_profile_id, change->'material'->>'path', change->'material'->>'commitSha', change->>'status', changed_at)
      ON CONFLICT (profile_id, id) DO UPDATE SET
        material_path = EXCLUDED.material_path, material_commit_sha = EXCLUDED.material_commit_sha,
        status = EXCLUDED.status, updated_at = EXCLUDED.updated_at, deleted_at = NULL
      WHERE study_progress.updated_at < EXCLUDED.updated_at;
    ELSIF change->>'type' = 'favorite.set' THEN
      entity_id := (change->'material'->>'commitSha') || ':' || (change->'material'->>'path');
      changed_at := (change->>'at')::timestamptz;
      INSERT INTO favorite (id, profile_id, material_path, material_commit_sha, value, updated_at)
      VALUES (entity_id, p_profile_id, change->'material'->>'path', change->'material'->>'commitSha', (change->>'value')::boolean, changed_at)
      ON CONFLICT (profile_id, id) DO UPDATE SET
        material_path = EXCLUDED.material_path, material_commit_sha = EXCLUDED.material_commit_sha,
        value = EXCLUDED.value, updated_at = EXCLUDED.updated_at, deleted_at = NULL
      WHERE favorite.updated_at < EXCLUDED.updated_at;
    ELSIF change->>'type' = 'flashcard.save' THEN
      changed_at := (change->'flashcard'->>'updatedAt')::timestamptz;
      INSERT INTO flashcard (id, profile_id, material_path, material_commit_sha, front, back, updated_at, deleted_at)
      VALUES (change->'flashcard'->>'id', p_profile_id, change->'flashcard'->'material'->>'path', change->'flashcard'->'material'->>'commitSha', change->'flashcard'->>'front', change->'flashcard'->>'back', changed_at, (change->'flashcard'->>'deletedAt')::timestamptz)
      ON CONFLICT (profile_id, id) DO UPDATE SET
        material_path = EXCLUDED.material_path, material_commit_sha = EXCLUDED.material_commit_sha,
        front = EXCLUDED.front, back = EXCLUDED.back, updated_at = EXCLUDED.updated_at, deleted_at = EXCLUDED.deleted_at
      WHERE flashcard.updated_at < EXCLUDED.updated_at;
    ELSIF change->>'type' = 'note.save' THEN
      entity_id := change->'note'->>'id';
      changed_at := (change->'note'->>'updatedAt')::timestamptz;
      SELECT * INTO existing_note FROM note WHERE profile_id = p_profile_id AND id = entity_id;
      incoming_note := jsonb_build_object(
        'id', entity_id, 'material', change->'note'->'material', 'text', change->'note'->>'text',
        'updatedAt', change->'note'->>'updatedAt', 'deletedAt', change->'note'->'deletedAt'
      );
      IF FOUND AND existing_note.text IS DISTINCT FROM change->'note'->>'text' AND EXISTS (
        SELECT 1 FROM sync_operation AS seen
        WHERE seen.profile_id = p_profile_id AND seen.sequence > request_cursor AND seen.device_id <> p_request->>'deviceId'
          AND seen.change::jsonb->>'type' = 'note.save' AND seen.change::jsonb->'note'->>'id' = entity_id
      ) THEN
        conflict_id := md5(entity_id || LEAST(existing_note.updated_at::text, changed_at::text) || GREATEST(existing_note.updated_at::text, changed_at::text));
        INSERT INTO note_conflict (id, profile_id, note_id, versions)
        VALUES (conflict_id, p_profile_id, entity_id, jsonb_build_array(
          jsonb_build_object('id', existing_note.id, 'material', jsonb_build_object('path', existing_note.material_path, 'commitSha', existing_note.material_commit_sha), 'text', existing_note.text, 'updatedAt', to_char(existing_note.updated_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'), 'deletedAt', CASE WHEN existing_note.deleted_at IS NULL THEN NULL ELSE to_jsonb(to_char(existing_note.deleted_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) END),
          incoming_note
        )::text)
        ON CONFLICT (profile_id, id) DO NOTHING;
      END IF;
      INSERT INTO note (id, profile_id, material_path, material_commit_sha, text, updated_at, deleted_at)
      VALUES (entity_id, p_profile_id, change->'note'->'material'->>'path', change->'note'->'material'->>'commitSha', change->'note'->>'text', changed_at, (change->'note'->>'deletedAt')::timestamptz)
      ON CONFLICT (profile_id, id) DO UPDATE SET
        material_path = EXCLUDED.material_path, material_commit_sha = EXCLUDED.material_commit_sha,
        text = EXCLUDED.text, updated_at = EXCLUDED.updated_at, deleted_at = EXCLUDED.deleted_at
      WHERE note.updated_at < EXCLUDED.updated_at;
    ELSIF change->>'type' = 'item.delete' THEN
      changed_at := (change->>'at')::timestamptz;
      IF change->>'entity' = 'note' THEN
        UPDATE note SET updated_at = changed_at, deleted_at = changed_at
        WHERE profile_id = p_profile_id AND id = change->>'id' AND updated_at < changed_at;
      ELSE
        UPDATE flashcard SET updated_at = changed_at, deleted_at = changed_at
        WHERE profile_id = p_profile_id AND id = change->>'id' AND updated_at < changed_at;
      END IF;
    END IF;
    op_sequence := NULL;
  END LOOP;

  SELECT COALESCE(max(sequence), 0) INTO next_cursor FROM sync_operation WHERE profile_id = p_profile_id;
  INSERT INTO sync_cursor (profile_id, device_id, cursor, updated_at)
  VALUES (p_profile_id, p_request->>'deviceId', next_cursor::text, now())
  ON CONFLICT (profile_id, device_id) DO UPDATE SET cursor = EXCLUDED.cursor, updated_at = EXCLUDED.updated_at;

  RETURN jsonb_build_object(
    'cursor', next_cursor::text,
    'acknowledgedIds', COALESCE((SELECT jsonb_agg(value->>'id') FROM jsonb_array_elements(COALESCE(p_request->'outbox', '[]'::jsonb))), '[]'::jsonb),
    'conflicts', COALESCE((SELECT jsonb_agg(jsonb_build_object('id', id, 'noteId', note_id, 'versions', versions::jsonb) ORDER BY id) FROM note_conflict WHERE profile_id = p_profile_id), '[]'::jsonb),
    'snapshot', jsonb_build_object(
      'progress', COALESCE((SELECT jsonb_agg(jsonb_build_object('id', id, 'material', jsonb_build_object('path', material_path, 'commitSha', material_commit_sha), 'status', status, 'updatedAt', to_char(updated_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'), 'deletedAt', CASE WHEN deleted_at IS NULL THEN NULL ELSE to_jsonb(to_char(deleted_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) END) ORDER BY id) FROM study_progress WHERE profile_id = p_profile_id), '[]'::jsonb),
      'favorites', COALESCE((SELECT jsonb_agg(jsonb_build_object('id', id, 'material', jsonb_build_object('path', material_path, 'commitSha', material_commit_sha), 'value', value, 'updatedAt', to_char(updated_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'), 'deletedAt', CASE WHEN deleted_at IS NULL THEN NULL ELSE to_jsonb(to_char(deleted_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) END) ORDER BY id) FROM favorite WHERE profile_id = p_profile_id), '[]'::jsonb),
      'notes', COALESCE((SELECT jsonb_agg(jsonb_build_object('id', id, 'material', jsonb_build_object('path', material_path, 'commitSha', material_commit_sha), 'text', text, 'updatedAt', to_char(updated_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'), 'deletedAt', CASE WHEN deleted_at IS NULL THEN NULL ELSE to_jsonb(to_char(deleted_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) END) ORDER BY id) FROM note WHERE profile_id = p_profile_id), '[]'::jsonb),
      'flashcards', COALESCE((SELECT jsonb_agg(jsonb_build_object('id', id, 'material', jsonb_build_object('path', material_path, 'commitSha', material_commit_sha), 'front', front, 'back', back, 'updatedAt', to_char(updated_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'), 'deletedAt', CASE WHEN deleted_at IS NULL THEN NULL ELSE to_jsonb(to_char(deleted_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) END) ORDER BY id) FROM flashcard WHERE profile_id = p_profile_id), '[]'::jsonb),
      'outbox', '[]'::jsonb, 'conflicts', '[]'::jsonb, 'currentMaterial', NULL
    )
  );
END;
$$;
