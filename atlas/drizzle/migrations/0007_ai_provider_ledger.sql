-- The ledger gains the provider dimension. Adding providers multiplies the
-- usable quota, but it must not widen the aggregate ceiling — that ceiling is
-- the protection against a bug spending everything. So the ceiling stays where
-- it is and only the pool it sums changes: the sentinel provider '*' owns the
-- aggregate rows, a real provider owns its own.
--
-- Each provider also carries its own allowance, which is the whole point of
-- having more than one: `reserve_ai_budget` refuses a turn for exhausting its
-- provider's own day ceiling, supplied by the caller because the ledger does
-- not know which provider has how much. No new window kind is needed — a
-- provider's day spend is the sum of its own day rows across subjects, exactly
-- the shape of the aggregate.
--
-- The primary key has to change rather than just gain a column. With the old
-- key, a provider's day row and the aggregate day row for the same subject
-- would collide on (scope, subject_key, window_kind, window_start), so the two
-- pools could not coexist. The provider is part of the row's identity or there
-- is no second pool.
ALTER TABLE "ai_usage_window" ADD COLUMN "provider" text NOT NULL DEFAULT 'groq';
--> statement-breakpoint
-- Rows written before the dimension existed: the global rows were already the
-- aggregate, so they become the '*' rows; every other row belonged to the one
-- provider. A reservation settled after this migration therefore still finds
-- the exact window it charged.
UPDATE "ai_usage_window" SET "provider" = '*' WHERE "window_kind" = 'global';
--> statement-breakpoint
ALTER TABLE "ai_usage_window" ALTER COLUMN "provider" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "ai_usage_window" DROP CONSTRAINT "ai_usage_window_scope_subject_kind_start_pk";
--> statement-breakpoint
ALTER TABLE "ai_usage_window" ADD CONSTRAINT "ai_usage_window_scope_provider_subject_kind_start_pk" PRIMARY KEY("scope","provider","subject_key","window_kind","window_start");
--> statement-breakpoint
-- A reservation records the provider it charged so reconciliation and expiry
-- credit the right pool. The default keeps reservations written before this
-- migration working: they were all for the single provider.
ALTER TABLE "ai_reservation" ADD COLUMN "provider" text NOT NULL DEFAULT 'groq';
--> statement-breakpoint
DROP FUNCTION IF EXISTS reserve_ai_budget(text, text, text, jsonb, timestamp with time zone);
--> statement-breakpoint
CREATE FUNCTION reserve_ai_budget(
  p_scope text,
  p_provider text,
  p_subject_key text,
  p_reservation_id text,
  p_provider_turns_per_day integer,
  p_policy jsonb,
  p_now timestamp with time zone
)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE
  -- Windows are always UTC: the ledger must not shift with the database
  -- session timezone, and reconciliation has to recompute the same boundary.
  hour_start timestamptz := date_trunc('hour', p_now AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
  day_start timestamptz := date_trunc('day', p_now AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
  max_input integer := COALESCE((p_policy->>'maxInputTokens')::integer, 0);
  max_output integer := COALESCE((p_policy->>'maxOutputTokens')::integer, 0);
  max_tools integer := COALESCE((p_policy->>'maxToolCalls')::integer, 0);
  deadline_seconds integer := COALESCE((p_policy->>'deadlineSeconds')::integer, 0);
  per_hour integer := COALESCE((p_policy->>'requestsPerHour')::integer, 0);
  per_day integer := COALESCE((p_policy->>'requestsPerDay')::integer, 0);
  global_per_day integer := COALESCE((p_policy->>'globalTurnsPerDay')::integer, 0);
  -- The organization-level token ceiling (Groq free tier: 200.000 TPD). Every
  -- turn reserves its worst-case tokens, so the aggregate day row always knows
  -- the committed spend; a turn that would push it past the ceiling is denied
  -- before any provider call. 0/absent disables the ceiling (legacy policies).
  global_tokens_per_day bigint := COALESCE((p_policy->>'globalTokensPerDay')::bigint, 0);
  -- The provider's own day ceiling, supplied by the caller because the ledger
  -- has no registry of which provider has how much. 0/absent disables it, like
  -- every other ceiling.
  provider_per_day integer := COALESCE(p_provider_turns_per_day, 0);
  max_concurrent integer := COALESCE((p_policy->>'maxConcurrentTurns')::integer, 0);
  v_expires_at timestamptz := p_now + make_interval(secs => deadline_seconds::double precision);
  changed integer;
  in_flight integer;
  provider_day_used integer;
BEGIN
  IF p_scope NOT IN ('public', 'admin') THEN
    RAISE EXCEPTION 'invalid scope' USING ERRCODE = '22023';
  END IF;
  -- '*' is the aggregate's sentinel, not a provider. A real provider can never
  -- be it, or a bug could spend the aggregate's headroom as its own pool.
  IF p_provider = '' OR p_provider = '*' THEN
    RAISE EXCEPTION 'invalid provider' USING ERRCODE = '22023';
  END IF;
  IF p_subject_key = '' THEN
    RAISE EXCEPTION 'invalid subject' USING ERRCODE = '22023';
  END IF;
  IF COALESCE((p_policy->>'enabled')::boolean, false) IS NOT TRUE THEN
    RETURN jsonb_build_object('type', 'denied', 'reason', 'disabled',
      'resetsAt', to_char((day_start + interval '1 day') AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));
  END IF;

  -- Every increment below happens inside one subtransaction: a denial on any
  -- window rolls the earlier increments back, so a request either consumes its
  -- whole reservation or nothing. The provider's own windows and the aggregate
  -- are written together, so a turn that fails the aggregate leaves the
  -- provider's counters untouched — and vice versa. Each INSERT .. ON CONFLICT
  -- DO UPDATE re-checks the ceiling under the row lock it takes, so two
  -- concurrent final-slot requests cannot both win.
  BEGIN
    -- Sponsored concurrency: at most maxConcurrentTurns live reservations per
    -- scope. Counting is not enough on its own — two concurrent calls could both
    -- read zero before either commits. A transaction-scoped advisory lock per
    -- scope serializes the admission decision, so the second caller re-reads
    -- after the first commits (or rolls back) and sees its reservation. The lock
    -- is released automatically at the end of the transaction.
    IF max_concurrent >= 1 THEN
      PERFORM pg_advisory_xact_lock(hashtext('atlas_ai_reserve:' || p_scope));
      SELECT count(*) INTO in_flight FROM ai_reservation
        WHERE scope = p_scope AND status IN ('reserved', 'unknown') AND ai_reservation.expires_at > p_now;
      IF in_flight >= max_concurrent THEN RAISE EXCEPTION 'concurrent' USING ERRCODE = 'AT004'; END IF;
    END IF;

    -- A provider's day ceiling sums that provider's own day rows across every
    -- subject, so — unlike the aggregate, which has one row to lock — there is
    -- no single row whose lock makes the check and this turn's increment
    -- atomic. A transaction-scoped advisory lock per scope and provider
    -- serializes them, so two concurrent final-slot turns cannot both read the
    -- other's absence and both commit.
    IF provider_per_day >= 1 THEN
      PERFORM pg_advisory_xact_lock(hashtext('atlas_ai_reserve_provider:' || p_scope || ':' || p_provider));
    END IF;

    INSERT INTO ai_usage_window (scope, provider, subject_key, window_kind, window_start, requests, reserved_input_tokens, reserved_output_tokens, updated_at)
    SELECT p_scope, p_provider, p_subject_key, 'hour', hour_start, 1, max_input, max_output, p_now
    WHERE per_hour >= 1
    ON CONFLICT (scope, provider, subject_key, window_kind, window_start) DO UPDATE
      SET requests = ai_usage_window.requests + 1,
          reserved_input_tokens = ai_usage_window.reserved_input_tokens + EXCLUDED.reserved_input_tokens,
          reserved_output_tokens = ai_usage_window.reserved_output_tokens + EXCLUDED.reserved_output_tokens,
          updated_at = EXCLUDED.updated_at
      WHERE ai_usage_window.requests < per_hour;
    GET DIAGNOSTICS changed = ROW_COUNT;
    IF changed = 0 THEN RAISE EXCEPTION 'minute' USING ERRCODE = 'AT001'; END IF;

    INSERT INTO ai_usage_window (scope, provider, subject_key, window_kind, window_start, requests, reserved_input_tokens, reserved_output_tokens, updated_at)
    SELECT p_scope, p_provider, p_subject_key, 'day', day_start, 1, max_input, max_output, p_now
    WHERE per_day >= 1
    ON CONFLICT (scope, provider, subject_key, window_kind, window_start) DO UPDATE
      SET requests = ai_usage_window.requests + 1,
          reserved_input_tokens = ai_usage_window.reserved_input_tokens + EXCLUDED.reserved_input_tokens,
          reserved_output_tokens = ai_usage_window.reserved_output_tokens + EXCLUDED.reserved_output_tokens,
          updated_at = EXCLUDED.updated_at
      WHERE ai_usage_window.requests < per_day;
    GET DIAGNOSTICS changed = ROW_COUNT;
    IF changed = 0 THEN RAISE EXCEPTION 'daily' USING ERRCODE = 'AT002'; END IF;

    -- The provider's own day ceiling: the sum of its day rows across subjects,
    -- the same aggregation as the aggregate's global row but filtered by
    -- provider instead of the sentinel. This turn has already been counted
    -- above, so a sum past the ceiling means this turn broke it; the exception
    -- rolls every increment in this subtransaction back. 0/absent disables it.
    IF provider_per_day >= 1 THEN
      SELECT COALESCE(sum(requests), 0) INTO provider_day_used FROM ai_usage_window
        WHERE scope = p_scope AND provider = p_provider AND window_kind = 'day' AND window_start = day_start;
      IF provider_day_used > provider_per_day THEN RAISE EXCEPTION 'provider' USING ERRCODE = 'AT005'; END IF;
    END IF;

    -- The token ceiling is enforced on the aggregate row: provider '*', subject
    -- '*'. It holds the worst-case reservation of every live turn plus the actual
    -- spend of every settled turn from every provider, so refusing when
    -- reserved + actual + this turn would exceed the ceiling keeps the
    -- organization under its daily token budget no matter which provider the
    -- turn used. The predicate re-evaluates under the row lock, so concurrent
    -- turns cannot both slip past the last free tokens.
    INSERT INTO ai_usage_window (scope, provider, subject_key, window_kind, window_start, requests, reserved_input_tokens, reserved_output_tokens, updated_at)
    SELECT p_scope, '*', '*', 'global', day_start, 1, max_input, max_output, p_now
    WHERE global_per_day >= 1
      AND (global_tokens_per_day IS NULL OR global_tokens_per_day < 1
        OR (max_input::bigint + max_output::bigint) > global_tokens_per_day
        OR NOT EXISTS (
          SELECT 1 FROM ai_usage_window existing
          WHERE existing.scope = p_scope AND existing.provider = '*'
            AND existing.subject_key = '*' AND existing.window_kind = 'global'
            AND existing.window_start = day_start
            AND (existing.reserved_input_tokens + existing.reserved_output_tokens
              + existing.input_tokens + existing.output_tokens
              + max_input::bigint + max_output::bigint) > global_tokens_per_day
        ))
    ON CONFLICT (scope, provider, subject_key, window_kind, window_start) DO UPDATE
      SET requests = ai_usage_window.requests + 1,
          reserved_input_tokens = ai_usage_window.reserved_input_tokens + EXCLUDED.reserved_input_tokens,
          reserved_output_tokens = ai_usage_window.reserved_output_tokens + EXCLUDED.reserved_output_tokens,
          updated_at = EXCLUDED.updated_at
      WHERE ai_usage_window.requests < global_per_day
        AND (global_tokens_per_day IS NULL OR global_tokens_per_day < 1
          OR (ai_usage_window.reserved_input_tokens + ai_usage_window.reserved_output_tokens
            + ai_usage_window.input_tokens + ai_usage_window.output_tokens
            + EXCLUDED.reserved_input_tokens + EXCLUDED.reserved_output_tokens) <= global_tokens_per_day);
    GET DIAGNOSTICS changed = ROW_COUNT;
    IF changed = 0 THEN RAISE EXCEPTION 'global' USING ERRCODE = 'AT003'; END IF;

    INSERT INTO ai_reservation (id, scope, provider, subject_key, status, max_input_tokens, max_output_tokens, max_tool_calls, created_at, expires_at)
    VALUES (p_reservation_id, p_scope, p_provider, p_subject_key, 'reserved', max_input, max_output, max_tools, p_now, v_expires_at);

    RETURN jsonb_build_object('type', 'reserved', 'reservationId', p_reservation_id,
      'maxInputTokens', max_input, 'maxOutputTokens', max_output, 'maxToolCalls', max_tools,
      'expiresAt', to_char(v_expires_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));
  -- Only the five tagged denials are caught here, so an unexpected
  -- error (for example a duplicate reservation id) surfaces as an error instead
  -- of being reported as an exhausted quota.
  EXCEPTION
    WHEN SQLSTATE 'AT001' THEN
      RETURN jsonb_build_object('type', 'denied', 'reason', 'minute',
        'resetsAt', to_char((hour_start + interval '1 hour') AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));
    WHEN SQLSTATE 'AT002' THEN
      RETURN jsonb_build_object('type', 'denied', 'reason', 'daily',
        'resetsAt', to_char((day_start + interval '1 day') AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));
    WHEN SQLSTATE 'AT003' THEN
      RETURN jsonb_build_object('type', 'denied', 'reason', 'global',
        'resetsAt', to_char((day_start + interval '1 day') AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));
    WHEN SQLSTATE 'AT004' THEN
      RETURN jsonb_build_object('type', 'denied', 'reason', 'global',
        'resetsAt', to_char((hour_start + interval '1 hour') AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));
    WHEN SQLSTATE 'AT005' THEN
      RETURN jsonb_build_object('type', 'denied', 'reason', 'provider',
        'resetsAt', to_char((day_start + interval '1 day') AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));
  END;
END;
$$;
--> statement-breakpoint
DROP FUNCTION IF EXISTS reconcile_ai_reservation(text, text, bigint, bigint, timestamp with time zone);
--> statement-breakpoint
CREATE FUNCTION reconcile_ai_reservation(
  p_reservation_id text,
  p_outcome text,
  p_actual_input_tokens bigint,
  p_actual_output_tokens bigint,
  p_now timestamp with time zone
)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE
  reservation ai_reservation%ROWTYPE;
  applied boolean := false;
BEGIN
  IF p_outcome NOT IN ('settled', 'unknown') THEN
    RAISE EXCEPTION 'invalid outcome' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO reservation FROM ai_reservation WHERE id = p_reservation_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'reservation not found' USING ERRCODE = '22023';
  END IF;

  -- A reservation is reconciled once. Later calls observe the recorded outcome
  -- instead of moving the counters a second time.
  IF reservation.status <> 'reserved' THEN
    RETURN jsonb_build_object('status', reservation.status, 'applied', false);
  END IF;

  IF p_outcome = 'settled' THEN
    -- The provider's own hour/day rows and the aggregate global row are the two
    -- pools this reservation charged, so both are credited here. The window is
    -- recomputed from the reservation's creation, never from now, so a late
    -- reconciliation still lands on the window that was charged.
    UPDATE ai_usage_window w
      SET reserved_input_tokens = GREATEST(0, w.reserved_input_tokens - reservation.max_input_tokens),
          reserved_output_tokens = GREATEST(0, w.reserved_output_tokens - reservation.max_output_tokens),
          input_tokens = w.input_tokens + GREATEST(0, COALESCE(p_actual_input_tokens, 0)),
          output_tokens = w.output_tokens + GREATEST(0, COALESCE(p_actual_output_tokens, 0)),
          updated_at = p_now
      WHERE w.scope = reservation.scope
        AND w.window_start = CASE w.window_kind
          WHEN 'hour' THEN date_trunc('hour', reservation.created_at AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'
          ELSE date_trunc('day', reservation.created_at AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' END
        AND (
          (w.provider = reservation.provider AND w.subject_key = reservation.subject_key)
          OR (w.provider = '*' AND w.window_kind = 'global')
        );
    UPDATE ai_reservation
      SET status = 'settled',
          actual_input_tokens = GREATEST(0, COALESCE(p_actual_input_tokens, 0)),
          actual_output_tokens = GREATEST(0, COALESCE(p_actual_output_tokens, 0)),
          settled_at = p_now
      WHERE id = p_reservation_id;
    applied := true;
  ELSE
    -- An unknown outcome (a timeout) stays charged as reserved tokens until it
    -- expires. The request slot itself is already spent and is never refunded.
    UPDATE ai_reservation SET status = 'unknown', settled_at = p_now WHERE id = p_reservation_id;
    applied := true;
  END IF;

  RETURN jsonb_build_object('status', CASE WHEN p_outcome = 'settled' THEN 'settled' ELSE 'unknown' END, 'applied', applied);
END;
$$;
--> statement-breakpoint
DROP FUNCTION IF EXISTS expire_ai_reservations(timestamp with time zone);
--> statement-breakpoint
CREATE FUNCTION expire_ai_reservations(p_now timestamp with time zone)
RETURNS integer LANGUAGE plpgsql AS $$
DECLARE
  reservation ai_reservation%ROWTYPE;
  expired integer := 0;
BEGIN
  FOR reservation IN
    SELECT * FROM ai_reservation WHERE status IN ('reserved', 'unknown') AND ai_reservation.expires_at <= p_now FOR UPDATE
  LOOP
    -- Release the hold on both pools the reservation charged — its provider's
    -- hour/day rows and the aggregate global row — using the window derived from
    -- created_at, not from now.
    UPDATE ai_usage_window w
      SET reserved_input_tokens = GREATEST(0, w.reserved_input_tokens - reservation.max_input_tokens),
          reserved_output_tokens = GREATEST(0, w.reserved_output_tokens - reservation.max_output_tokens),
          updated_at = p_now
      WHERE w.scope = reservation.scope
        AND w.window_start = CASE w.window_kind
          WHEN 'hour' THEN date_trunc('hour', reservation.created_at AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'
          ELSE date_trunc('day', reservation.created_at AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' END
        AND (
          (w.provider = reservation.provider AND w.subject_key = reservation.subject_key)
          OR (w.provider = '*' AND w.window_kind = 'global')
        );
    UPDATE ai_reservation SET status = 'expired', settled_at = p_now WHERE id = reservation.id;
    expired := expired + 1;
  END LOOP;
  RETURN expired;
END;
$$;
--> statement-breakpoint
DROP FUNCTION IF EXISTS read_ai_quota(text, text, jsonb, timestamp with time zone);
--> statement-breakpoint
CREATE FUNCTION read_ai_quota(
  p_scope text,
  p_provider text,
  p_subject_key text,
  p_provider_turns_per_day integer,
  p_policy jsonb,
  p_now timestamp with time zone
)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE
  hour_start timestamptz := date_trunc('hour', p_now AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
  day_start timestamptz := date_trunc('day', p_now AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
  used_hour integer := 0;
  used_day integer := 0;
  used_provider_day integer := 0;
  used_global integer := 0;
  used_global_tokens bigint := 0;
BEGIN
  SELECT COALESCE(sum(requests), 0) INTO used_hour FROM ai_usage_window
    WHERE scope = p_scope AND provider = p_provider AND subject_key = p_subject_key AND window_kind = 'hour' AND window_start = hour_start;
  SELECT COALESCE(sum(requests), 0) INTO used_day FROM ai_usage_window
    WHERE scope = p_scope AND provider = p_provider AND subject_key = p_subject_key AND window_kind = 'day' AND window_start = day_start;
  -- The provider's own day pool: every subject it served today, not just this
  -- one. This is the spend the provider ceiling is checked against.
  SELECT COALESCE(sum(requests), 0) INTO used_provider_day FROM ai_usage_window
    WHERE scope = p_scope AND provider = p_provider AND window_kind = 'day' AND window_start = day_start;
  SELECT COALESCE(sum(requests), 0) INTO used_global FROM ai_usage_window
    WHERE scope = p_scope AND provider = '*' AND window_kind = 'global' AND window_start = day_start;
  SELECT COALESCE(sum(reserved_input_tokens + reserved_output_tokens + input_tokens + output_tokens), 0)
    INTO used_global_tokens FROM ai_usage_window
    WHERE scope = p_scope AND provider = '*' AND window_kind = 'global' AND window_start = day_start;

  RETURN jsonb_build_object(
    'scope', p_scope,
    'requestsThisHour', used_hour,
    'requestsPerHour', COALESCE((p_policy->>'requestsPerHour')::integer, 0),
    'requestsToday', used_day,
    'requestsPerDay', COALESCE((p_policy->>'requestsPerDay')::integer, 0),
    'providerTurnsToday', used_provider_day,
    'providerTurnsPerDay', COALESCE(p_provider_turns_per_day, 0),
    'globalTurnsToday', used_global,
    'globalTurnsPerDay', COALESCE((p_policy->>'globalTurnsPerDay')::integer, 0),
    'globalTokensToday', used_global_tokens,
    'globalTokensPerDay', COALESCE((p_policy->>'globalTokensPerDay')::bigint, 0),
    'resetsAt', to_char((hour_start + interval '1 hour') AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
  );
END;
$$;
