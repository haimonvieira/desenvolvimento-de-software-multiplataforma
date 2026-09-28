CREATE TABLE "user" (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  email_verified boolean NOT NULL DEFAULT false,
  image text,
  is_anonymous boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE session (
  id text PRIMARY KEY,
  expires_at timestamptz NOT NULL,
  token text NOT NULL UNIQUE,
  ip_address text,
  user_agent text,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX session_user_id_idx ON session (user_id);

CREATE TABLE account (
  id text PRIMARY KEY,
  account_id text NOT NULL,
  provider_id text NOT NULL,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  access_token text,
  refresh_token text,
  id_token text,
  access_token_expires_at timestamptz,
  refresh_token_expires_at timestamptz,
  scope text,
  password text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider_id, account_id)
);
CREATE INDEX account_user_id_idx ON account (user_id);

CREATE TABLE verification (
  id text PRIMARY KEY,
  identifier text NOT NULL,
  value text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX verification_identifier_idx ON verification (identifier);

CREATE TABLE rate_limit (
  id text PRIMARY KEY,
  key text NOT NULL UNIQUE,
  count integer NOT NULL,
  last_request bigint NOT NULL
);

CREATE TABLE passkey (
  id text PRIMARY KEY,
  name text,
  public_key text NOT NULL,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  credential_id text NOT NULL UNIQUE,
  counter integer NOT NULL,
  device_type text NOT NULL,
  backed_up boolean NOT NULL,
  transports text,
  created_at timestamptz NOT NULL DEFAULT now(),
  aaguid text
);
CREATE INDEX passkey_user_id_idx ON passkey (user_id);

-- A profile exists only after its anonymous Better Auth user owns a passkey.
CREATE TABLE study_profile (
  id text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE FUNCTION create_study_profile_for_first_passkey()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM "user" WHERE id = NEW.user_id AND is_anonymous = true) THEN
    INSERT INTO study_profile (id) VALUES (NEW.user_id) ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER passkey_creates_study_profile
AFTER INSERT ON passkey
FOR EACH ROW EXECUTE FUNCTION create_study_profile_for_first_passkey();

CREATE TABLE study_progress (
  id text PRIMARY KEY,
  profile_id text NOT NULL REFERENCES study_profile(id) ON DELETE CASCADE,
  material_path text NOT NULL,
  material_commit_sha text NOT NULL,
  status text NOT NULL CHECK (status IN ('new', 'studying', 'done')),
  updated_at timestamptz NOT NULL,
  deleted_at timestamptz,
  UNIQUE (profile_id, material_path, material_commit_sha)
);
CREATE INDEX study_progress_profile_id_idx ON study_progress (profile_id);

CREATE TABLE favorite (
  id text PRIMARY KEY,
  profile_id text NOT NULL REFERENCES study_profile(id) ON DELETE CASCADE,
  material_path text NOT NULL,
  material_commit_sha text NOT NULL,
  value boolean NOT NULL,
  updated_at timestamptz NOT NULL,
  deleted_at timestamptz,
  UNIQUE (profile_id, material_path, material_commit_sha)
);
CREATE INDEX favorite_profile_id_idx ON favorite (profile_id);

CREATE TABLE note (
  id text PRIMARY KEY,
  profile_id text NOT NULL REFERENCES study_profile(id) ON DELETE CASCADE,
  material_path text NOT NULL,
  material_commit_sha text NOT NULL,
  text text NOT NULL,
  updated_at timestamptz NOT NULL,
  deleted_at timestamptz
);
CREATE INDEX note_profile_id_idx ON note (profile_id);

CREATE TABLE flashcard (
  id text PRIMARY KEY,
  profile_id text NOT NULL REFERENCES study_profile(id) ON DELETE CASCADE,
  material_path text NOT NULL,
  material_commit_sha text NOT NULL,
  front text NOT NULL,
  back text NOT NULL,
  updated_at timestamptz NOT NULL,
  deleted_at timestamptz
);
CREATE INDEX flashcard_profile_id_idx ON flashcard (profile_id);

CREATE TABLE sync_cursor (
  profile_id text NOT NULL REFERENCES study_profile(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  cursor text NOT NULL,
  updated_at timestamptz NOT NULL,
  PRIMARY KEY (profile_id, device_id)
);
