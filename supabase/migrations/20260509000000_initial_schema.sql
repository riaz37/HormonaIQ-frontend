-- =============================================================================
-- HormonaIQ — Initial Database Schema
-- Migration: 20260509000000_initial_schema.sql
-- Generated: 2026-05-09
--
-- Tables (in dependency order):
--   1.  users
--   2.  symptom_logs          (+ validate_drsp_scores function)
--   3.  drsp_charts
--   4.  pcos_lab_values
--   5.  peri_hot_flashes
--   6.  peri_gcs_assessments
--   7.  safety_plans
--   8.  crisis_events
--   9.  ora_usage
--   10. notification_log
--   11. sync_watermarks
--   12. audit_log
--
-- Also includes:
--   - Row Level Security (RLS) on all tables
--   - check_ora_quota() RPC (advisory-locked quota check)
--   - pg_cron jobs (daily reminders + crisis event purge)
-- =============================================================================


-- =============================================================================
-- 1. USERS
-- =============================================================================

CREATE TABLE users (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_hash            VARCHAR(64),                  -- SHA-256 of lowercased email. Never plaintext.
  age_decade            SMALLINT CHECK (age_decade BETWEEN 1 AND 9),  -- 2=20s, 3=30s, etc.
  conditions            TEXT[] NOT NULL DEFAULT '{}', -- ['pmdd','pcos','perimenopause','endometriosis','adhd']
  primary_condition     TEXT,
  tier                  TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  revenuecat_user_id    TEXT UNIQUE,
  cycle_len             SMALLINT DEFAULT 28 CHECK (cycle_len BETWEEN 21 AND 120),
  last_period_date      DATE,                         -- stored as date only, no time component
  irregular_cycles      BOOLEAN DEFAULT false,
  hbc_active            BOOLEAN DEFAULT false,        -- hormonal birth control
  hbc_type              TEXT,
  perimenopausal_status TEXT,                         -- 'early_peri','late_peri','postmenopause',null
  veteran_mode          BOOLEAN DEFAULT false,        -- >=60 days tracked -> terse copy variant
  verified_minor        BOOLEAN DEFAULT false,
  adhd_flag             BOOLEAN DEFAULT false,
  ed_safe_mode          BOOLEAN DEFAULT false,
  ora_enabled           BOOLEAN DEFAULT true,         -- user can disable Ora, keeps tracker
  brain_fog_mode        BOOLEAN DEFAULT false,
  passive_mode_until    TIMESTAMPTZ,
  reduce_motion         BOOLEAN DEFAULT false,
  notifs_enabled        BOOLEAN DEFAULT false,
  notif_hour            SMALLINT DEFAULT 20 CHECK (notif_hour BETWEEN 0 AND 23),
  notif_minute          SMALLINT DEFAULT 0 CHECK (notif_minute BETWEEN 0 AND 59),
  expo_push_token       TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at            TIMESTAMPTZ                   -- soft delete; hard purge via scheduled job
);

CREATE INDEX idx_users_revenuecat ON users(revenuecat_user_id);


-- =============================================================================
-- 2. SYMPTOM LOGS
-- =============================================================================

-- Validate DRSP score ranges in JSONB (each value must be 1–6)
-- Defined before the table so the CHECK constraint can reference it.
CREATE OR REPLACE FUNCTION validate_drsp_scores(scores JSONB) RETURNS BOOLEAN AS $$
DECLARE
  val INTEGER;
  key TEXT;
BEGIN
  IF scores IS NULL THEN RETURN TRUE; END IF;
  FOR key, val IN SELECT * FROM jsonb_each_text(scores) LOOP
    IF val::INTEGER < 1 OR val::INTEGER > 6 THEN
      RETURN FALSE;
    END IF;
  END LOOP;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE TABLE symptom_logs (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_date                  DATE NOT NULL,
  cycle_day                 SMALLINT CHECK (cycle_day BETWEEN 1 AND 120),
  cycle_phase               TEXT CHECK (cycle_phase IN (
                              'menstrual', 'follicular', 'ovulatory', 'luteal', 'luteal_late'
                            )),

  -- DRSP 1–6 scale. Validated at DB level. All items 1–6 or null.
  -- Expected keys: mood_shifts, irritability, anxiety_tension, depressed_mood,
  -- hopelessness, self_critical, feeling_overwhelmed, feeling_out_of_control,
  -- breast_tenderness, bloating, headache, joint_muscle_pain, hypersomnia_insomnia,
  -- appetite_change, difficulty_concentrating, fatigue_lethargy, decreased_interest_activities,
  -- decreased_interest_relationships, difficulty_with_usual_activities,
  -- relationship_conflict, social_withdrawal, productivity_reduced,
  -- subjective_difficulty, suicidal_ideation
  drsp_scores               JSONB,

  physical_symptoms         TEXT[] DEFAULT '{}',
  adhd_ef_scores            JSONB,                    -- {focus, initiation, memory, regulation, hyperactivity}
  adhd_med_effectiveness    SMALLINT CHECK (adhd_med_effectiveness BETWEEN 1 AND 5),
  sleep_quality             SMALLINT CHECK (sleep_quality BETWEEN 1 AND 6),
  sleep_hours               NUMERIC(3, 1),
  energy_level              SMALLINT CHECK (energy_level BETWEEN 1 AND 6),
  functional_impairment     TEXT,                     -- 'none','mild','moderate','severe'
  spotting                  BOOLEAN DEFAULT false,
  fast_log                  BOOLEAN DEFAULT false,    -- 1-tap minimum log
  voice_note_ref            TEXT,                     -- Supabase Storage object key (optional)
  free_text_note            TEXT,                     -- optional; reviewed for crisis language server-side
  crisis_flag               BOOLEAN DEFAULT false,    -- set by crisis pipeline; not shown to user
  crisis_tier               SMALLINT CHECK (crisis_tier IN (1, 2, 3)),
  bad_day_only              BOOLEAN DEFAULT false,
  watermelon_id             TEXT UNIQUE,              -- WatermelonDB local record ID for sync
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at                TIMESTAMPTZ,              -- soft delete

  CONSTRAINT unique_user_log_date UNIQUE (user_id, log_date),
  CONSTRAINT drsp_score_range CHECK (validate_drsp_scores(drsp_scores))
);

-- Primary query index: fetching logs by user ordered by date
CREATE INDEX idx_symptom_logs_user_date
  ON symptom_logs(user_id, log_date DESC);

-- Crisis audit index: partial index — only crisis rows
CREATE INDEX idx_symptom_logs_crisis
  ON symptom_logs(user_id, crisis_flag)
  WHERE crisis_flag = true;

-- Sync-pull performance index: sync-pull queries by updated_at, not log_date.
-- Without this index every sync-pull is a sequential scan.
CREATE INDEX idx_symptom_logs_user_updated
  ON symptom_logs(user_id, updated_at DESC);


-- =============================================================================
-- 3. DRSP CHARTS (cached, pre-generated per cycle)
-- =============================================================================

CREATE TABLE drsp_charts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cycle_number    INTEGER NOT NULL,       -- 1-indexed from first log entry
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  days_logged     SMALLINT NOT NULL,
  days_estimated  SMALLINT DEFAULT 0,     -- data quality indicator
  c_pass_met      BOOLEAN,               -- null = insufficient data
  -- pre-computed per-item phase averages
  -- { luteal_averages, follicular_averages, c_pass, swing_ratio, logged_days, estimated_days }
  chart_data      JSONB NOT NULL,
  generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT unique_user_cycle UNIQUE (user_id, cycle_number)
);


-- =============================================================================
-- 4. PCOS — LAB VAULT
-- =============================================================================

CREATE TABLE pcos_lab_values (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_date       DATE NOT NULL,
  lab_type        TEXT NOT NULL,  -- 'testosterone','shbg','amh','lh','fsh','insulin_fasting',
                                  -- 'glucose_fasting','prolactin','tsh','dhea_s','androstenedione'
  value           NUMERIC(10, 3) NOT NULL,
  unit            TEXT NOT NULL,
  reference_low   NUMERIC(10, 3),
  reference_high  NUMERIC(10, 3),
  in_range        BOOLEAN GENERATED ALWAYS AS (
                    value BETWEEN COALESCE(reference_low, value)
                              AND COALESCE(reference_high, value)
                  ) STORED,
  notes           TEXT,
  watermelon_id   TEXT UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lab_values_user_type
  ON pcos_lab_values(user_id, lab_type, test_date DESC);


-- =============================================================================
-- 5. PERIMENOPAUSE — HOT FLASH LOG
-- =============================================================================

CREATE TABLE peri_hot_flashes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  occurred_at       TIMESTAMPTZ NOT NULL,            -- timestamp, not just date
  severity          SMALLINT CHECK (severity BETWEEN 1 AND 4),  -- 1=mild,2=mod,3=severe,4=very
  duration_minutes  SMALLINT,
  flash_type        TEXT CHECK (flash_type IN ('flash', 'sweat', 'both')),
  sleep_disrupted   BOOLEAN DEFAULT false,
  sheet_change      BOOLEAN DEFAULT false,
  trigger           TEXT,
  accompanying      TEXT[] DEFAULT '{}',             -- ['palpitations','chills','nausea','anxiety']
  watermelon_id     TEXT UNIQUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_hot_flashes_user_time
  ON peri_hot_flashes(user_id, occurred_at DESC);


-- =============================================================================
-- 6. PERIMENOPAUSE — GCS ASSESSMENTS
-- =============================================================================

CREATE TABLE peri_gcs_assessments (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessed_on             DATE NOT NULL,
  -- 21 items, 0–3 each
  scores                  JSONB NOT NULL,
  -- subscale totals (computed on insert via application logic or trigger)
  subscale_anxiety        SMALLINT,
  subscale_depression     SMALLINT,
  subscale_somatic        SMALLINT,
  subscale_vasomotor      SMALLINT,
  subscale_sexual         SMALLINT,
  total_score             SMALLINT,
  -- alert flags (GENERATED from subscale totals)
  alert_depression        BOOLEAN GENERATED ALWAYS AS (subscale_depression >= 10) STORED,
  alert_total             BOOLEAN GENERATED ALWAYS AS (total_score >= 42) STORED,
  watermelon_id           TEXT UNIQUE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- =============================================================================
-- 7. SAFETY PLANS (Stanley-Brown structure; one per user)
-- =============================================================================

CREATE TABLE safety_plans (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_in_phase  TEXT,                  -- 'follicular','ovulatory' — follicular-only creation allowed
  last_updated      TIMESTAMPTZ NOT NULL DEFAULT now(),
  warning_signs     TEXT[] DEFAULT '{}',
  coping_strategies TEXT[] DEFAULT '{}',
  contacts          JSONB DEFAULT '[]',    -- [{name, phone, relationship}]
  reasons_to_live   TEXT[] DEFAULT '{}',
  crisis_numbers    TEXT[] DEFAULT '{"988"}',
  -- Plan is locked (read-only) during luteal
  locked_at         TIMESTAMPTZ,           -- set when user enters luteal phase
  watermelon_id     TEXT UNIQUE,

  CONSTRAINT one_plan_per_user UNIQUE (user_id)
);


-- =============================================================================
-- 8. CRISIS EVENTS
-- =============================================================================

CREATE TABLE crisis_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  cycle_day       SMALLINT,
  tier            SMALLINT NOT NULL CHECK (tier IN (1, 2, 3)),
  trigger_source  TEXT,   -- 'drsp_item','daily_log','consecutive_days'
  -- No symptom content stored. Only the fact that a crisis event occurred.
  purge_after     TIMESTAMPTZ GENERATED ALWAYS AS (
                    occurred_at + INTERVAL '72 hours'
                  ) STORED
  -- Scheduled purge: DELETE FROM crisis_events WHERE purge_after < now()
  -- Run every 6 hours via Supabase pg_cron (see bottom of file).
);


-- =============================================================================
-- 9. ORA USAGE TRACKING
-- =============================================================================

CREATE TABLE ora_usage (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feature         TEXT NOT NULL CHECK (feature IN (
                    'explain_chart', 'appointment_prep', 'why_now',
                    'clinical_letter', 'pattern_discovery', 'crisis_context'
                  )),
  called_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  tokens_used     INTEGER,
  guard_blocked   BOOLEAN DEFAULT false,  -- true if guard model suppressed the response
  cycle_day       SMALLINT
);

-- Used for: free tier quota (3 explain_chart queries/month), cost tracking, guard audit
CREATE INDEX idx_ora_usage_user_month
  ON ora_usage(user_id, called_at);


-- =============================================================================
-- 10. NOTIFICATION LOG
-- =============================================================================

CREATE TABLE notification_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,  -- 'daily_reminder','phase_alert','pattern_discovery',
                                  -- 'milestone','crisis_checkin'
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  cycle_day       SMALLINT,
  phase           TEXT,
  opened          BOOLEAN DEFAULT false
);

CREATE INDEX idx_notif_log_user
  ON notification_log(user_id, sent_at DESC);


-- =============================================================================
-- 11. SYNC WATERMARK
-- =============================================================================

CREATE TABLE sync_watermarks (
  user_id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  last_synced_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  client_id       TEXT        -- device identifier for conflict resolution
);


-- =============================================================================
-- 12. AUDIT LOG
-- Deletion events only. No content. No symptoms.
-- user_id is nullable because account deletion NULLs it after the user row is purged.
-- =============================================================================

CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID,           -- May be null after account deletion (no FK — intentional)
  event_type  TEXT NOT NULL,  -- 'account_deleted','range_deleted','export_generated','crisis_purged'
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE drsp_charts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcos_lab_values    ENABLE ROW LEVEL SECURITY;
ALTER TABLE peri_hot_flashes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE peri_gcs_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_plans       ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE ora_usage          ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log   ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_watermarks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log          ENABLE ROW LEVEL SECURITY;

-- users: can only read/update their own row
CREATE POLICY "users_self_only" ON users
  FOR ALL USING (auth.uid() = id);

-- symptom_logs
CREATE POLICY "symptom_logs_owner" ON symptom_logs
  FOR ALL USING (auth.uid() = user_id);

-- drsp_charts
CREATE POLICY "drsp_charts_owner" ON drsp_charts
  FOR ALL USING (auth.uid() = user_id);

-- pcos_lab_values
CREATE POLICY "lab_values_owner" ON pcos_lab_values
  FOR ALL USING (auth.uid() = user_id);

-- peri_hot_flashes
CREATE POLICY "hot_flashes_owner" ON peri_hot_flashes
  FOR ALL USING (auth.uid() = user_id);

-- peri_gcs_assessments
CREATE POLICY "gcs_owner" ON peri_gcs_assessments
  FOR ALL USING (auth.uid() = user_id);

-- safety_plans
CREATE POLICY "safety_plan_owner" ON safety_plans
  FOR ALL USING (auth.uid() = user_id);

-- crisis_events
CREATE POLICY "crisis_events_owner" ON crisis_events
  FOR ALL USING (auth.uid() = user_id);

-- ora_usage
CREATE POLICY "ora_usage_owner" ON ora_usage
  FOR ALL USING (auth.uid() = user_id);

-- notification_log
CREATE POLICY "notif_log_owner" ON notification_log
  FOR ALL USING (auth.uid() = user_id);

-- sync_watermarks
CREATE POLICY "sync_watermarks_owner" ON sync_watermarks
  FOR ALL USING (auth.uid() = user_id);

-- audit_log: users cannot read their own audit events (append-only from service role)
-- Service role bypasses RLS for all writes, so no INSERT policy needed for users.
-- No SELECT policy means authenticated users cannot query this table directly.
-- (A policy that matches no rows is equivalent to no access for that operation.)
CREATE POLICY "audit_log_no_user_access" ON audit_log
  AS RESTRICTIVE
  FOR SELECT
  USING (false);

-- Service role bypasses RLS for server-side operations:
--   PDF generation, RevenueCat webhooks, crisis purge job, audit writes


-- =============================================================================
-- ORA QUOTA RPC
-- Atomically check Ora quota with advisory lock.
-- Prevents TOCTOU race where two concurrent requests both pass the quota check.
-- =============================================================================

CREATE OR REPLACE FUNCTION check_ora_quota(
  p_user_id UUID,
  p_feature TEXT,
  p_limit   INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Advisory lock scoped to this transaction; released automatically on commit/rollback.
  -- Serialises concurrent quota checks for the same user, eliminating TOCTOU races.
  PERFORM pg_advisory_xact_lock(hashtext(p_user_id::text));

  SELECT COUNT(*) INTO v_count
  FROM ora_usage
  WHERE user_id  = p_user_id
    AND feature  = p_feature
    AND called_at >= date_trunc('month', now());

  RETURN v_count < p_limit;
END;
$$;


-- =============================================================================
-- PG_CRON JOBS
-- Requires the pg_cron extension to be enabled on the Supabase project.
-- Enable via: Dashboard -> Database -> Extensions -> pg_cron
-- Also requires pg_net for the HTTP POST in the daily-reminders job.
-- =============================================================================

-- Daily reminder trigger
-- Runs every minute; the Edge Function selects only users whose notif_hour:notif_minute
-- matches the current UTC time, so at most one notification fires per user per day.
SELECT cron.schedule(
  'daily-reminders',
  '* * * * *',
  $cron$
    SELECT net.http_post(
      url     := current_setting('app.supabase_url') || '/functions/v1/send-daily-reminders',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.service_key')
      )
    );
  $cron$
);

-- Crisis event purge (every 6 hours)
-- purge_after is a GENERATED column: occurred_at + 72 hours
SELECT cron.schedule(
  'purge-crisis-events',
  '0 */6 * * *',
  $cron$
    DELETE FROM crisis_events WHERE purge_after < now();
  $cron$
);
