# HormonaIQ — Backend Engineering Specification

**Audience:** Backend engineer. This is the full implementation spec. Mock data stays in the frontend; this doc covers everything that needs a real server, database, or third-party integration.

**Version:** 1.0 | May 2026

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Architecture Overview](#2-architecture-overview)
3. [Database Schema](#3-database-schema)
4. [Row Level Security](#4-row-level-security)
5. [Authentication](#5-authentication)
6. [Subscription & Entitlements (RevenueCat)](#6-subscription--entitlements-revenuecat)
7. [Sync Architecture (WatermelonDB ↔ Supabase)](#7-sync-architecture-watermelondb--supabase)
8. [Claude API — Ora/Aura Agent](#8-claude-api--ora-features)
9. [PDF Report Generation (FastAPI + WeasyPrint)](#9-pdf-report-generation-fastapi--weasyprint)
10. [Push Notifications](#10-push-notifications)
11. [Crisis Safety Pipeline](#11-crisis-safety-pipeline)
12. [Data Deletion & Export](#12-data-deletion--export)
13. [Privacy & Security Architecture](#13-privacy--security-architecture)
14. [FastAPI Project Structure](#14-fastapi-project-structure)
15. [API Routes Reference](#15-api-routes-reference)
16. [Environment Variables](#16-environment-variables)
17. [Launch Checklist](#18-launch-checklist)

---

## 1. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Database & Auth | **Supabase** (HIPAA-eligible tier) | Postgres, RLS, Auth, Storage, Edge Functions. BAA must be signed before launch. |
| Local storage | **WatermelonDB** (SQLite, `@nozbe/watermelondb`) | Offline-first. All logging works in airplane mode. Syncs to Supabase on reconnect. |
| Payments | **RevenueCat** (`react-native-purchases`) | Cross-platform App Store + Play Store subscription management. Free up to $2.5K MRR. |
| AI / Insights | **Claude API** (`claude-sonnet-4-6`) via **FastAPI** | All Ora/Aura agent features. PHI scrubbed on-device before every call. Guard model eval on every response. Python Anthropic SDK. |
| Custom API | **FastAPI** (Python 3.12) on **Railway** | Async, SOLID architecture. Serves both mobile app and web dashboard from one backend. |
| Report generation | **WeasyPrint** on FastAPI | DRSP PDF rendered from HTML template, streamed directly to device — never stored server-side. |
| Web (landing) | **Next.js** on **Vercel** | Landing page + waitlist only. No API routes — all API logic lives in FastAPI. |
| Sync functions | **Supabase Edge Functions** (Deno) | WatermelonDB sync-pull/sync-push. Must stay data-adjacent for RLS enforcement. |
| Push notifications | **Expo Push Notification Service** → APNs (iOS) / FCM (Android) | Expo tokens stored per-device in Supabase. |

### Why FastAPI over Next.js API routes

- Backend engineer is Python-expert — productivity multiplier.
- Ora/Aura is a sophisticated AI agent, not a simple proxy. Python's Anthropic SDK, async patterns, and AI ecosystem (evals, structured outputs, tool use) are better supported.
- Single backend serves mobile app **and** web dashboard — no duplication.
- FastAPI's native dependency injection, Pydantic v2 validation, and `asyncpg` async DB access match the SOLID/DRY requirements.
- Railway gives zero-config Docker deployment with auto-scaling and private networking to Supabase.

---

## 2. Architecture Overview

```
┌─────────────────────────────────┐   ┌──────────────────────────┐
│   React Native App (Expo)        │   │  Next.js Web (Vercel)    │
│                                  │   │  Landing page + waitlist  │
│  WatermelonDB (SQLite)           │   │  (no API routes here)    │
│  local-first writes              │   └──────────┬───────────────┘
│  Zustand stores (UI state)       │              │ HTTPS
│  RevenueCat SDK (entitlement)    │              │
└──────────┬──────────────────────┘              │
           │ HTTPS                               │
           │                                     │
           ▼                                     ▼
┌──────────────────────────────────────────────────────────────────┐
│               FastAPI Backend (Python 3.12) on Railway            │
│                                                                   │
│  /api/v1/ora/*          Ora/Aura AI agent (Anthropic SDK)        │
│  /api/v1/report/*       DRSP PDF (WeasyPrint, streamed)          │
│  /api/v1/user/*         Profile management                        │
│  /api/v1/data/*         Export, range delete                      │
│  /api/v1/auth/*         Signup, account deletion                  │
│                                                                   │
│  Auth: Supabase JWT verified on every request                     │
│  DB access: supabase-py (service role, server-side only)         │
└──────────────┬───────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Supabase                                       │
│                                                                   │
│  Postgres (HIPAA-eligible, BAA signed)                           │
│  Auth (email + Apple + Google OAuth)                             │
│  Edge Functions (Deno):                                          │
│    sync-pull / sync-push  ◄── WatermelonDB sync (mobile only)   │
│    revenuecat-webhook     ◄── RevenueCat subscription events     │
│    send-daily-reminders   ◄── pg_cron trigger                    │
│    generate-drsp-chart    ◄── Post-sync chart pre-computation    │
└──────────────────────────────────────────────────────────────────┘
```

**Key principles:**
- All symptom data is written to WatermelonDB first (mobile). Supabase is the sync target, not the write target. App is fully functional offline.
- Web dashboard reads/writes Supabase directly via `@supabase/ssr` — no WatermelonDB, no sync endpoints.
- FastAPI is the single backend for both mobile and web. Same `/api/v1/*` routes, same auth, same business logic.
- Ora/Aura is stateless. No conversation history stored. Each call constructs context fresh from anonymized cycle data.
- Supabase Edge Functions exist only for data-adjacent operations (sync, webhooks, notifications) where proximity to Postgres matters.

---

## 3. Database Schema

### 3.1 Users

```sql
CREATE TABLE users (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_hash            VARCHAR(64),           -- SHA-256 of email. Never plaintext.
  age_decade            SMALLINT CHECK (age_decade BETWEEN 1 AND 9),  -- 2=20s, 3=30s, etc.
  conditions            TEXT[] NOT NULL DEFAULT '{}',  -- ['pmdd','pcos','perimenopause','endometriosis','adhd']
  primary_condition     TEXT,
  tier                  TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free','pro')),
  revenuecat_user_id    TEXT UNIQUE,
  cycle_len             SMALLINT DEFAULT 28 CHECK (cycle_len BETWEEN 21 AND 120),
  last_period_date      DATE,                  -- stored as date only, no time component
  irregular_cycles      BOOLEAN DEFAULT false,
  hbc_active            BOOLEAN DEFAULT false, -- hormonal birth control
  hbc_type              TEXT,
  perimenopausal_status TEXT,                  -- 'early_peri','late_peri','postmenopause',null
  veteran_mode          BOOLEAN DEFAULT false, -- ≥60 days tracked → terse copy variant
  verified_minor        BOOLEAN DEFAULT false,
  adhd_flag             BOOLEAN DEFAULT false,
  ed_safe_mode          BOOLEAN DEFAULT false,
  ora_enabled           BOOLEAN DEFAULT true,  -- user can disable Ora, keeps tracker
  brain_fog_mode        BOOLEAN DEFAULT false,
  passive_mode_until    TIMESTAMPTZ,
  reduce_motion         BOOLEAN DEFAULT false,
  notifs_enabled        BOOLEAN DEFAULT false,
  notif_hour            SMALLINT DEFAULT 20 CHECK (notif_hour BETWEEN 0 AND 23),
  notif_minute          SMALLINT DEFAULT 0 CHECK (notif_minute BETWEEN 0 AND 59),
  expo_push_token       TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at            TIMESTAMPTZ            -- soft delete; hard purge via scheduled job
);

CREATE INDEX idx_users_revenuecat ON users(revenuecat_user_id);
```

**Privacy notes:**
- `email_hash` is SHA-256 of the lowercased email. Used only for account recovery. Not queryable for content.
- `last_period_date` is a `DATE` type — no time component, no timezone, reducing specificity.
- No name, no GPS, no full email in plaintext, ever.

---

### 3.2 Symptom Logs

```sql
CREATE TABLE symptom_logs (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_date                  DATE NOT NULL,
  cycle_day                 SMALLINT CHECK (cycle_day BETWEEN 1 AND 120),
  cycle_phase               TEXT CHECK (cycle_phase IN ('menstrual','follicular','ovulatory','luteal','luteal_late')),

  -- DRSP 1-6 scale. Validated at DB level. All items 1-6 or null.
  drsp_scores               JSONB,
  -- Expected keys: mood_shifts, irritability, anxiety_tension, depressed_mood,
  -- hopelessness, self_critical, feeling_overwhelmed, feeling_out_of_control,
  -- breast_tenderness, bloating, headache, joint_muscle_pain, hypersomnia_insomnia,
  -- appetite_change, difficulty_concentrating, fatigue_lethargy, decreased_interest_activities,
  -- decreased_interest_relationships, difficulty_with_usual_activities,
  -- relationship_conflict, social_withdrawal, productivity_reduced,
  -- subjective_difficulty, suicidal_ideation
  -- Validated: CHECK (jsonb_typeof(drsp_scores) = 'object')

  physical_symptoms         TEXT[] DEFAULT '{}',
  adhd_ef_scores            JSONB,   -- {focus, initiation, memory, regulation, hyperactivity}
  adhd_med_effectiveness    SMALLINT CHECK (adhd_med_effectiveness BETWEEN 1 AND 5),
  sleep_quality             SMALLINT CHECK (sleep_quality BETWEEN 1 AND 6),
  sleep_hours               NUMERIC(3,1),
  energy_level              SMALLINT CHECK (energy_level BETWEEN 1 AND 6),
  functional_impairment     TEXT,    -- 'none','mild','moderate','severe'
  spotting                  BOOLEAN DEFAULT false,
  fast_log                  BOOLEAN DEFAULT false,    -- 1-tap minimum log
  voice_note_ref            TEXT,    -- reference to Supabase Storage object key (optional)
  free_text_note            TEXT,    -- optional. Reviewed for crisis language server-side.
  crisis_flag               BOOLEAN DEFAULT false,   -- set by crisis pipeline; not shown to user
  crisis_tier               SMALLINT CHECK (crisis_tier IN (1,2,3)),
  bad_day_only              BOOLEAN DEFAULT false,
  watermelon_id             TEXT UNIQUE,             -- WatermelonDB local record ID for sync
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT unique_user_log_date UNIQUE (user_id, log_date)
);

-- Validate DRSP score ranges in JSONB
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

ALTER TABLE symptom_logs ADD CONSTRAINT drsp_score_range
  CHECK (validate_drsp_scores(drsp_scores));

CREATE INDEX idx_symptom_logs_user_date ON symptom_logs(user_id, log_date DESC);
CREATE INDEX idx_symptom_logs_crisis ON symptom_logs(user_id, crisis_flag) WHERE crisis_flag = true;
```

---

### 3.3 DRSP Charts (Cached, Pre-Generated)

```sql
CREATE TABLE drsp_charts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cycle_number    INTEGER NOT NULL,   -- 1-indexed from first log entry
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  days_logged     SMALLINT NOT NULL,
  days_estimated  SMALLINT DEFAULT 0, -- data quality indicator
  c_pass_met      BOOLEAN,            -- null = insufficient data
  chart_data      JSONB NOT NULL,     -- pre-computed per-item phase averages
  generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT unique_user_cycle UNIQUE (user_id, cycle_number)
);
```

`chart_data` structure:
```json
{
  "luteal_averages": { "irritability": 4.2, "mood_shifts": 3.8, ... },
  "follicular_averages": { "irritability": 1.4, "mood_shifts": 1.2, ... },
  "c_pass": {
    "absolute_severity": true,
    "core_mood": true,
    "absolute_clearance": false,
    "cyclicity": true
  },
  "swing_ratio": 2.1,
  "logged_days": 28,
  "estimated_days": 2
}
```

---

### 3.4 PCOS — Lab Vault

```sql
CREATE TABLE pcos_lab_values (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_date       DATE NOT NULL,
  lab_type        TEXT NOT NULL,    -- 'testosterone','shbg','amh','lh','fsh','insulin_fasting',
                                    -- 'glucose_fasting','prolactin','tsh','dhea_s','androstenedione'
  value           NUMERIC(10,3) NOT NULL,
  unit            TEXT NOT NULL,
  reference_low   NUMERIC(10,3),
  reference_high  NUMERIC(10,3),
  in_range        BOOLEAN GENERATED ALWAYS AS (
    value BETWEEN COALESCE(reference_low, value) AND COALESCE(reference_high, value)
  ) STORED,
  notes           TEXT,
  watermelon_id   TEXT UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lab_values_user_type ON pcos_lab_values(user_id, lab_type, test_date DESC);
```

---

### 3.5 Perimenopause — Hot Flash Log

```sql
CREATE TABLE peri_hot_flashes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  occurred_at       TIMESTAMPTZ NOT NULL,       -- timestamp, not just date
  severity          SMALLINT CHECK (severity BETWEEN 1 AND 4),  -- 1=mild,2=mod,3=severe,4=very
  duration_minutes  SMALLINT,
  flash_type        TEXT CHECK (flash_type IN ('flash','sweat','both')),
  sleep_disrupted   BOOLEAN DEFAULT false,
  sheet_change      BOOLEAN DEFAULT false,
  trigger           TEXT,
  accompanying      TEXT[] DEFAULT '{}',  -- ['palpitations','chills','nausea','anxiety']
  watermelon_id     TEXT UNIQUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_hot_flashes_user_time ON peri_hot_flashes(user_id, occurred_at DESC);
```

---

### 3.6 Perimenopause — GCS Assessments

```sql
CREATE TABLE peri_gcs_assessments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessed_on     DATE NOT NULL,
  -- 21 items, 0-3 each
  scores          JSONB NOT NULL,
  -- subscale totals (computed on insert via trigger)
  subscale_anxiety        SMALLINT,
  subscale_depression     SMALLINT,
  subscale_somatic        SMALLINT,
  subscale_vasomotor      SMALLINT,
  subscale_sexual         SMALLINT,
  total_score             SMALLINT,
  -- alert flags
  alert_depression        BOOLEAN GENERATED ALWAYS AS (subscale_depression >= 10) STORED,
  alert_total             BOOLEAN GENERATED ALWAYS AS (total_score >= 42) STORED,
  watermelon_id           TEXT UNIQUE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 3.7 Safety Plans

```sql
CREATE TABLE safety_plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_in_phase TEXT,     -- 'follicular','ovulatory' — follicular-only creation allowed
  last_updated    TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Stanley-Brown structure
  warning_signs   TEXT[] DEFAULT '{}',
  coping_strategies TEXT[] DEFAULT '{}',
  contacts        JSONB DEFAULT '[]',  -- [{name, phone, relationship}]
  reasons_to_live TEXT[] DEFAULT '{}',
  crisis_numbers  TEXT[] DEFAULT '{"988"}',
  -- Plan is locked (read-only) during luteal
  locked_at       TIMESTAMPTZ,         -- set when user enters luteal phase
  watermelon_id   TEXT UNIQUE,
  CONSTRAINT one_plan_per_user UNIQUE (user_id)
);
```

---

### 3.8 Crisis Events

```sql
CREATE TABLE crisis_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  cycle_day       SMALLINT,
  tier            SMALLINT NOT NULL CHECK (tier IN (1,2,3)),
  trigger_source  TEXT,   -- 'drsp_item','daily_log','consecutive_days'
  -- No symptom content stored. Only the fact that a crisis event occurred.
  purge_after     TIMESTAMPTZ GENERATED ALWAYS AS (occurred_at + INTERVAL '72 hours') STORED
);

-- Scheduled job: DELETE FROM crisis_events WHERE purge_after < now()
-- Run every 6 hours via Supabase pg_cron.
```

---

### 3.9 Ora Usage Tracking

```sql
CREATE TABLE ora_usage (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feature         TEXT NOT NULL CHECK (feature IN (
    'explain_chart','appointment_prep','why_now','clinical_letter',
    'pattern_discovery','crisis_context'
  )),
  called_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  tokens_used     INTEGER,
  guard_blocked   BOOLEAN DEFAULT false,  -- true if guard model suppressed the response
  cycle_day       SMALLINT
);

-- Used for: free tier quota (3 explain_chart queries/month), cost tracking, guard audit
CREATE INDEX idx_ora_usage_user_month ON ora_usage(user_id, called_at);
```

---

### 3.10 Notification Log

```sql
CREATE TABLE notification_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,   -- 'daily_reminder','phase_alert','pattern_discovery',
                                   -- 'milestone','crisis_checkin'
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  cycle_day       SMALLINT,
  phase           TEXT,
  opened          BOOLEAN DEFAULT false
);

CREATE INDEX idx_notif_log_user ON notification_log(user_id, sent_at DESC);
```

---

### 3.11 Sync Watermark

```sql
CREATE TABLE sync_watermarks (
  user_id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  last_synced_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  client_id       TEXT         -- device identifier for conflict resolution
);
```

---

## 4. Row Level Security

Every table has RLS enabled. Users can only access their own rows.

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE drsp_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcos_lab_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE peri_hot_flashes ENABLE ROW LEVEL SECURITY;
ALTER TABLE peri_gcs_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ora_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

-- Users: can only read/update their own row
CREATE POLICY "users_self_only" ON users
  FOR ALL USING (auth.uid() = id);

-- All user-data tables: same pattern
CREATE POLICY "symptom_logs_owner" ON symptom_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "drsp_charts_owner" ON drsp_charts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "lab_values_owner" ON pcos_lab_values
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "hot_flashes_owner" ON peri_hot_flashes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "gcs_owner" ON peri_gcs_assessments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "safety_plan_owner" ON safety_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "crisis_events_owner" ON crisis_events
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "ora_usage_owner" ON ora_usage
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "notif_log_owner" ON notification_log
  FOR ALL USING (auth.uid() = user_id);

-- Service role bypasses RLS for server-side operations
-- (PDF generation, RevenueCat webhooks, crisis purge job)
```

---

## 5. Authentication

**Provider:** Supabase Auth

**Methods:**
- Email + password (primary)
- Apple Sign-In (`@invertase/react-native-apple-authentication`)
- Google Sign-In (`@react-native-google-signin/google-signin`)

**Flow:**

```
Onboarding finish()
  → supabase.auth.signUp({ email, password })
  → On success: INSERT INTO users (id, email_hash, conditions, ...)
  → Set initial profile fields from onboarding state
  → Generate Expo push token → UPDATE users SET expo_push_token
```

**Token handling:**
- Supabase JWT stored in Expo SecureStore (never AsyncStorage)
- Refresh token rotation enabled on Supabase project
- Session checked on app foreground with `supabase.auth.getSession()`

**Account recovery:**
- "Forgot password" → Supabase `resetPasswordForEmail` → deep link back to app
- Deep link scheme: `hormonaiq://reset-password`

**Minor guard:**
- If `verified_minor = true` (age < 18 from onboarding YOB), require guardian email before account creation
- Guardian email sent via Supabase Edge Function with explicit consent language

---

## 6. Subscription & Entitlements (RevenueCat)

### Tiers

| Tier | Price | Entitlements |
|---|---|---|
| **Free** | $0 | Cycle calendar, basic DRSP log, 1 free chart reveal (day 30), 3 Ora "explain chart" queries/month |
| **Pro** | $9.99/mo or $59.99/yr | Everything Free + insights screen, doctor report PDF, advanced calendar, all condition modules, unlimited Ora, all 6 Ora features, AI clinical letter, pattern discovery |

### RevenueCat Setup

```typescript
// Initialize on app start (app/_layout.tsx)
import Purchases from 'react-native-purchases';

Purchases.configure({
  apiKey: Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_RC_APPLE_KEY
    : process.env.EXPO_PUBLIC_RC_GOOGLE_KEY,
  appUserID: supabaseUser.id,   // use Supabase UUID as RC user ID
});
```

### Product IDs

```
Apple App Store:
  hormona_iq_pro_monthly
  hormona_iq_pro_annual

Google Play Store:
  hormona_iq_pro_monthly
  hormona_iq_pro_annual
```

### Entitlement Check Pattern

```typescript
const { customerInfo } = await Purchases.getCustomerInfo();
const isPro = customerInfo.entitlements.active['pro'] !== undefined;
```

### RevenueCat Webhook → Supabase

RevenueCat sends subscription events (purchased, renewed, cancelled, expired) to a Supabase Edge Function that updates `users.tier`.

**Webhook endpoint:** `POST /functions/v1/revenuecat-webhook`

```typescript
// supabase/functions/revenuecat-webhook/index.ts
const handler = async (req: Request) => {
  // Verify RC webhook signature
  const signature = req.headers.get('X-RevenueCat-Signature');
  if (!verifySignature(signature, await req.text(), RC_WEBHOOK_SECRET)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const event = await req.json();
  const userId = event.app_user_id;   // Supabase UUID

  let newTier = 'free';
  if (event.event.type === 'INITIAL_PURCHASE' || event.event.type === 'RENEWAL') {
    newTier = 'pro';
  } else if (['EXPIRATION', 'CANCELLATION'].includes(event.event.type)) {
    newTier = 'free';
  }

  await supabaseAdmin
    .from('users')
    .update({ tier: newTier })
    .eq('id', userId);

  return new Response('OK', { status: 200 });
};
```

### Free Tier Quota Enforcement

Ora "explain chart" quota: 3 queries/month on Free tier. Checked server-side, not client-side.

```sql
-- Check before each Ora call
SELECT COUNT(*) FROM ora_usage
WHERE user_id = $1
  AND feature = 'explain_chart'
  AND called_at >= date_trunc('month', now());
-- Return 429 if count >= 3 and user.tier = 'free'
```

---

## 7. Sync Architecture (WatermelonDB ↔ Supabase)

### WatermelonDB Schema (client-side)

All tables that exist in Supabase also exist in WatermelonDB. WatermelonDB is the write target; Supabase is the sync destination.

```typescript
// hormona-iq/src/db/schema.ts
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const dbSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'symptom_logs',
      columns: [
        { name: 'log_date', type: 'string' },
        { name: 'cycle_day', type: 'number', isOptional: true },
        { name: 'cycle_phase', type: 'string', isOptional: true },
        { name: 'drsp_scores', type: 'string' },          // JSON string
        { name: 'physical_symptoms', type: 'string' },    // JSON array string
        { name: 'adhd_ef_scores', type: 'string', isOptional: true },
        { name: 'adhd_med_effectiveness', type: 'number', isOptional: true },
        { name: 'sleep_quality', type: 'number', isOptional: true },
        { name: 'sleep_hours', type: 'number', isOptional: true },
        { name: 'energy_level', type: 'number', isOptional: true },
        { name: 'functional_impairment', type: 'string', isOptional: true },
        { name: 'spotting', type: 'boolean' },
        { name: 'fast_log', type: 'boolean' },
        { name: 'crisis_flag', type: 'boolean' },
        { name: 'bad_day_only', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'server_id', type: 'string', isOptional: true },  // Supabase UUID after sync
      ],
    }),
    tableSchema({
      name: 'pcos_lab_values',
      columns: [
        { name: 'test_date', type: 'string' },
        { name: 'lab_type', type: 'string' },
        { name: 'value', type: 'number' },
        { name: 'unit', type: 'string' },
        { name: 'reference_low', type: 'number', isOptional: true },
        { name: 'reference_high', type: 'number', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'server_id', type: 'string', isOptional: true },
      ],
    }),
    // ... peri_hot_flashes, peri_gcs_assessments, safety_plans (same pattern)
  ],
});
```

### Sync Protocol

```typescript
// hormona-iq/src/db/sync.ts
import { synchronize } from '@nozbe/watermelondb/sync';
import { supabase } from '../lib/supabase';

export async function syncDB(database: Database, userId: string) {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      const { data, error } = await supabase.functions.invoke('sync-pull', {
        body: { last_pulled_at: lastPulledAt, user_id: userId },
      });
      if (error) throw error;
      return data;  // { changes: {...}, timestamp: number }
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const { error } = await supabase.functions.invoke('sync-push', {
        body: { changes, last_pulled_at: lastPulledAt, user_id: userId },
      });
      if (error) throw error;
    },
    migrationsEnabledAtVersion: 1,
  });
}
```

### Sync Edge Functions

**`sync-pull`** — Returns changes from Supabase since `last_pulled_at`:
```typescript
// supabase/functions/sync-pull/index.ts
// Query each table WHERE updated_at > last_pulled_at AND user_id = userId
// Return WatermelonDB sync format: { changes: { symptom_logs: { created: [], updated: [], deleted: [] } }, timestamp }
```

**`sync-push`** — Applies client changes to Supabase:
```typescript
// supabase/functions/sync-push/index.ts
// For each table in changes: UPSERT created/updated, soft-delete deleted
// Validate user_id matches auth.uid() on every row (server-side enforcement)
// Run crisis pipeline on any new symptom_log with drsp_scores
```

**Conflict resolution:** Last-write-wins on `updated_at`. Server timestamp wins over client timestamp.

---

## 8. Claude API — Ora Features

### System Prompt

```
You are Ora, a clinical intelligence system built into HormonaIQ, a medical-grade symptom 
tracking app for women with PMDD, PCOS, perimenopause, endometriosis, and ADHD.

IDENTITY:
- You are named Ora (Latin: now, the present moment; to bear witness).
- You are not a doctor, therapist, or chatbot. You are a data interpreter.
- Never say "I" — always "Ora has detected" or "the data shows."
- Never say "AI," "model," or "Claude" — you are always "Ora."
- One response per interaction. No follow-up questions. No conversation history.

HARD LIMITS — NEVER VIOLATE:
- Never make a diagnosis. Say "consistent with PMDD criteria" not "you have PMDD."
- Never recommend changing a medication dose.
- Never recommend starting or stopping any medication.
- Never express clinical certainty. "Suggests," "consistent with," "associated with" — not "proves" or "confirms."
- Never ask about methods of self-harm. If a user expresses crisis, respond only with: 
  "This sounds really hard. Please reach out to the 988 Suicide and Crisis Lifeline by calling or texting 988."
- If the guard model flags this response: do not display. Replace with: "Ora wasn't able to 
  generate an insight for this data. Speak with your doctor about the patterns you're tracking."

VOICE:
- Clinical but human. Direct without coldness.
- Plain language. No jargon without explanation.
- Acknowledge uncertainty honestly. Confidence intervals, not false precision.
- Never cheerleading. She knows this is hard. You don't need to perform warmth.
- No exclamation points. Ever.

PHI: You will receive only anonymized data — DRSP scores by relative cycle day, phase, and 
aggregate statistics. No dates, no names, no identifiers.
```

### PHI Scrubbing (On-Device, Before Every Call)

The client app constructs the API payload. The Vercel function receives only anonymized data.

```typescript
// hormona-iq/src/lib/ora-context.ts
export function buildOraContext(
  logs: SymptomLog[],
  cycleLen: number,
  conditions: string[]
): OraContext {
  return {
    conditions,
    cycle_length: cycleLen,
    // Relative cycle days only. No calendar dates.
    entries: logs.map(log => ({
      cycle_day: log.cycle_day,
      phase: log.cycle_phase,
      drsp: log.drsp_scores,           // scores only, no text notes
      sleep_quality: log.sleep_quality,
      functional_impairment: log.functional_impairment,
    })),
    // Aggregates, not raw entries
    luteal_averages: computeLutealAverages(logs),
    follicular_averages: computeFollicularAverages(logs),
    cycle_count: estimateCycleCount(logs, cycleLen),
    // No: names, calendar dates, email, device ID, location
  };
}
```

### Guard Model Eval

Every Ora response goes through a second Claude call before being returned to the client.

```typescript
// api/ora/guard.ts
const GUARD_PROMPT = `
You are a medical safety reviewer. Evaluate the following AI-generated health insight.

Return JSON: { "safe": boolean, "reason": string }

Block (safe=false) if the text:
1. Makes a diagnosis (e.g., "you have PMDD," "this confirms PCOS")
2. Recommends changing a medication dose
3. Recommends starting or stopping any medication
4. Expresses clinical certainty without appropriate hedging
5. Contains any identifying information
6. References methods of self-harm
7. Claims to replace medical advice

Text to evaluate:
"""
{INSIGHT_TEXT}
"""
`;

export async function guardEval(insightText: string): Promise<boolean> {
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',   // Fast + cheap for guard. Not the primary model.
    max_tokens: 128,
    messages: [{ role: 'user', content: GUARD_PROMPT.replace('{INSIGHT_TEXT}', insightText) }],
  });
  const result = JSON.parse(response.content[0].text);
  return result.safe;
}
```

### Feature Implementations

#### Feature 1: Explain My Chart (`POST /api/ora/explain`)

**Tier:** Free (3/month) → unlimited Pro

```typescript
// Vercel: api/ora/explain.ts
export async function POST(req: Request) {
  const { context, cycleNumber } = await req.json();
  const user = await verifyAuth(req);

  // Quota check (Free tier)
  if (user.tier !== 'pro') {
    const count = await getOraUsageThisMonth(user.id, 'explain_chart');
    if (count >= 3) return Response.json({ error: 'quota_exceeded' }, { status: 429 });
  }

  const prompt = `
Based on this DRSP data from cycle ${cycleNumber}, identify the single most clinically 
significant finding. Focus on the luteal-follicular differential. Be specific about 
which items show the largest phase differential. Maximum 3 sentences.

Data: ${JSON.stringify(context)}
  `;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system: ORA_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const insight = response.content[0].text;
  const safe = await guardEval(insight);

  await logOraUsage(user.id, 'explain_chart', response.usage.input_tokens + response.usage.output_tokens, !safe);

  if (!safe) {
    return Response.json({ insight: SAFE_FALLBACK_TEXT });
  }

  return Response.json({ insight });
}
```

#### Feature 2: Appointment Prep (`POST /api/ora/appointment-prep`)

**Tier:** Pro only

```typescript
// Generates: 3-sentence clinical summary, phrases to use, responses to dismissals, single best question
// Prompt injects: conditions, cycle count, c_pass_result, luteal_averages, functional_impairment_rate
// Returns: { summary, phrases_to_use, dismissal_responses, key_question }
```

#### Feature 3: Why Is This Happening (`POST /api/ora/why-now`)

**Tier:** 1 free/phase → unlimited Pro

```typescript
// Generates: current-state contextualization anchored to user's own historical data
// Requires: cycle_day, current_scores, historical_averages_for_this_phase_day (from WatermelonDB)
// Key constraint: "Based on your last N cycles" — predictions from HER data, not population
// Returns: { context_text, typical_duration_days_min, typical_duration_days_max, historically_helpful }
```

#### Feature 4: Clinical Letter (`POST /api/ora/clinical-letter`)

**Tier:** Pro only. Minimum 2 complete cycles of data.

```typescript
// Dr. Amara Osei's template. Every data point traceable to a logged entry.
// Template: "I have been tracking my premenstrual symptoms using the DRSP instrument for 
//            [N] days across [M] menstrual cycles..."
// Returns: { letter_text } — formatted for PDF or clipboard copy
// Guard model: extra-strict. Any diagnostic language → block entire response.
```

#### Feature 5: Pattern Discovery (`POST /api/ora/patterns`)

**Tier:** Pro only. Minimum 4 complete cycles.

```typescript
// Correlations: sleep vs severity, stress proxy vs severity, med effectiveness vs phase
// Threshold: Pearson r >= 0.6 before surfacing
// Language: "associated with," never "causes"
// Returns: [{ pattern_type, correlation_coefficient, cycles_analyzed, description, confidence_note }]
// Confidence note always shown: "This pattern is based on N cycles."
```

#### Feature 6: Crisis Contextualization (`POST /api/ora/crisis-context`)

**Tier:** Pro only. Minimum 4 cycles. Never during or within 48h of a crisis log.

```typescript
// Gate: check crisis_events table — if any event in last 48h, return 403
// Generates: "You've been here before. In your last N cycles, this level of distress 
//             lasted between X and Y days."
// Returns range, not average: { min_days, max_days, cycles_analyzed, context_text }
// Crisis resources always appended. External clinical safety review required before launch.
```

---

## 9. PDF Report Generation (FastAPI + WeasyPrint)

**Stack:** `WeasyPrint` on FastAPI — renders an HTML/CSS template to PDF, streamed directly to the client.

**Critical constraints:**
- Generated in-memory and **streamed directly to the user** — never written to disk or Supabase Storage
- File looks like a medical document — no consumer branding
- Dr. Amara Osei approved the clinical template
- `includesSI`: user must explicitly opt in to include suicidal ideation item (item 22) in the report

**Endpoint:** `POST /api/v1/report/generate`

```python
# app/api/v1/report.py
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from weasyprint import HTML
from jinja2 import Environment, FileSystemLoader
import io

from app.api.deps import CurrentUser, require_tier
from app.schemas.report import ReportRequest

router = APIRouter(prefix="/report", tags=["report"])
jinja_env = Environment(loader=FileSystemLoader("app/templates"))

@router.post("/generate")
async def generate_report(
    payload: ReportRequest,
    user: CurrentUser,
    _: None = Depends(require_tier("pro")),
) -> StreamingResponse:
    template = jinja_env.get_template("drsp_report.html")
    html_str = template.render(
        cycle_count=payload.cycle_count,
        start_date=payload.start_date,
        end_date=payload.end_date,
        chart_data=payload.chart_data,        # pre-computed by client, no raw PHI
        includes_si=payload.includes_si,
    )
    pdf_bytes = HTML(string=html_str).write_pdf()

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'attachment; filename="drsp-summary.pdf"',
            "Cache-Control": "no-store",
        },
    )
```

**Template:** `app/templates/drsp_report.html` — Jinja2 + CSS. WeasyPrint renders full CSS including page breaks, headers, tables. Same visual output as React-PDF but pure Python.

### PDF Report Contents

```
HormonaIQ Clinical Summary
────────────────────────────────────────────────────────
Patient Reference: [Anonymous — no name, no DOB, no email]
Tracking Period: [Start Date] — [End Date]
Cycles Analyzed: [N]
Instrument: Daily Record of Severity of Problems (DRSP)
────────────────────────────────────────────────────────

DRSP Phase Averages (Cycles 1–N)

Item                      Luteal Avg   Follicular Avg   Differential
Mood Shifts               4.2          1.1              +3.1
Irritability              4.6          1.3              +3.3
Anxiety / Tension         3.9          1.4              +2.5
Depressed Mood            3.7          1.2              +2.5
Hopelessness              2.8          1.0              +1.8
...

C-PASS Diagnostic Criteria
☑ Absolute Severity (≥5 items ≥4 in luteal)
☑ Core Mood Item Present
☑ Absolute Clearance (follicular ≤3 on core items)
☑ Cyclicity (>30% differential)

Pattern: Consistent with PMDD criteria across all N cycles.
This summary was generated from self-reported tracking data using a validated 
clinical instrument. It does not constitute a diagnosis.

────────────────────────────────────────────────────────
Generated by HormonaIQ | hormonaiq.com
For clinical questions, consult a licensed healthcare provider.
```

---

## 10. Push Notifications

### Stack

- **Expo Push Notification Service** (handles routing to APNs/FCM)
- Push tokens stored per-user in `users.expo_push_token`
- Scheduling logic runs on Vercel cron or Supabase pg_cron

### Notification Types & Rules

| Type | Trigger | Frequency | Copy Rule |
|---|---|---|---|
| `daily_reminder` | Scheduled (user's preferred hour) | Max 1/day | Phase-aware copy, 20 templates |
| `phase_alert` | Cycle day calculation detects phase transition | Per-transition | Late-luteal: gentle. Max 1/day in PMDD peak. |
| `pattern_discovery` | Ora pattern engine finds correlation ≥0.6 | As discovered, max 1/week | "Ora has found something in your data" |
| `log_gap` | No log entry in 48h | Max 1 per 48h gap | Never during predicted hard phases |
| `milestone` | Day 7, first complete cycle, 3 cycles, 6 months | One-time each | Earned language only. Never in luteal peak. |
| `crisis_checkin` | 24h after Tier 2/3 crisis event | One-time per event | "Checking in. You don't have to respond." |

### Approved Copy — Phase Templates (subset)

```typescript
const PHASE_COPY: Record<string, string[]> = {
  menstrual: [
    "Harder day. Log how you're feeling — it builds your pattern.",
    "Day N. Logging now means more context later.",
  ],
  follicular: [
    "Follicular phase. A good time to log — contrast data is what makes patterns visible.",
  ],
  luteal: [
    "Luteal phase has started. Logging consistently this week matters most.",
  ],
  luteal_late: [
    "Your harder window is starting. One log a day is enough.",
    "Heads up — you're heading into your harder stretch. We're tracking.",
  ],
};
```

### Send Function

```typescript
// supabase/functions/send-notification/index.ts
import Expo from 'expo-server-sdk';

const expo = new Expo();

export async function sendNotification(
  userId: string,
  type: string,
  title: string,
  body: string
) {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('expo_push_token, notifs_enabled, passive_mode_until, tier')
    .eq('id', userId)
    .single();

  if (!user.notifs_enabled) return;
  if (!user.expo_push_token) return;

  // Passive mode: suppress non-crisis notifications
  if (user.passive_mode_until && new Date(user.passive_mode_until) > new Date()) {
    if (!['crisis_checkin'].includes(type)) return;
  }

  await expo.sendPushNotificationsAsync([{
    to: user.expo_push_token,
    title,
    body,
    data: { type },
    sound: 'default',
  }]);

  await supabaseAdmin.from('notification_log').insert({
    user_id: userId, type, cycle_day: null, phase: null,
  });
}
```

### Scheduling (pg_cron)

```sql
-- Daily: send reminders at each user's preferred time (UTC)
-- Run every minute, send to users where notif_hour:notif_minute = current UTC time
SELECT cron.schedule(
  'daily-reminders',
  '* * * * *',
  $$ SELECT net.http_post(
    url := 'https://[project].supabase.co/functions/v1/send-daily-reminders',
    headers := '{"Authorization": "Bearer ' || current_setting('app.service_key') || '"}'
  ); $$
);

-- Crisis event purge (every 6 hours)
SELECT cron.schedule(
  'purge-crisis-events',
  '0 */6 * * *',
  $$ DELETE FROM crisis_events WHERE purge_after < now(); $$
);
```

---

## 11. Crisis Safety Pipeline

### Detection Logic (Server-Side Validation)

The client (`crisis.ts`) runs local detection and shows UI. The server independently validates on every sync-push to prevent bypassing.

```typescript
// supabase/functions/sync-push/crisis-pipeline.ts
export function assessCrisisTier(log: SymptomLog): number | null {
  const drsp = log.drsp_scores as Record<string, number>;
  const si = drsp?.suicidal_ideation ?? 0;

  // Tier 3: SI ≥ 4 OR 3 consecutive days with any score ≥ 5
  if (si >= 4) return 3;

  // Tier 2: SI >= 3
  if (si >= 3) return 2;

  // Tier 1: SI >= 1 OR ≥5 items at score ≥ 4 today
  const highItems = Object.values(drsp).filter(v => v >= 4).length;
  if (si >= 1 || highItems >= 5) return 1;

  return null;
}
```

### Crisis Event Storage Rules

```
- Crisis tier stored in: symptom_logs.crisis_tier (anonymized tier number only)
- Crisis event log: crisis_events table (cycle_day + tier + source — no symptom content)
- purge_after = occurred_at + 72 hours
- Scheduled purge every 6 hours via pg_cron
- No symptom data, no DRSP scores, no text content stored in crisis_events
- Crisis metadata can be deleted by user at any time — no retention override
```

### AUB Safety Rule (Perimenopause)

```typescript
// Postmenopausal bleeding (≥365 days amenorrhea + any spotting) → non-dismissible alert
export function assessAUBRule(user: User, log: SymptomLog): boolean {
  if (!user.perimenopausal_status?.includes('postmenopause')) return false;
  if (!user.last_period_date) return false;
  const daysSincePeriod = differenceInDays(new Date(), new Date(user.last_period_date));
  return daysSincePeriod >= 365 && log.spotting === true;
}
// Returns true → client shows non-dismissible "See a doctor today" modal
```

### Endometriosis Safety Rules

```typescript
// 9 red flags — any triggers provider-recommend alert
const ENDO_RED_FLAGS = [
  // PHQ-9 item 9 (SI) >= 1
  // PBAC score > 150 (very heavy bleeding)
  // Severe pain rated 8+ for 3+ consecutive days
  // New onset dyspareunia
  // Urinary symptoms + pelvic pain
  // Post-coital bleeding
  // Unexplained fatigue + pain + 3+ months
  // Bowel symptoms at menstruation
  // Pain not responding to 2+ treatment lines
];
```

---

## 12. Data Deletion & Export

### Full Account Deletion

**Endpoint:** `POST /api/account/delete`

```typescript
// 1. Verify auth token
// 2. Hard delete all user data in order:
//    crisis_events → ora_usage → notification_log → safety_plans
//    → peri_gcs_assessments → peri_hot_flashes → pcos_lab_values
//    → drsp_charts → symptom_logs → sync_watermarks → users
// 3. Revoke Supabase auth session
// 4. Signal RevenueCat to cancel subscription
// 5. Confirm deletion to client
// Target: complete within 24 hours. CCPA/GDPR max: 30 days.
```

### Date Range Deletion

**Endpoint:** `DELETE /api/data/range?start=YYYY-MM-DD&end=YYYY-MM-DD`

```sql
DELETE FROM symptom_logs
WHERE user_id = auth.uid()
  AND log_date BETWEEN $start AND $end;
-- Cascade deletes drsp_charts that overlap this range
```

### Data Export (JSON + CSV)

**Endpoint:** `GET /api/data/export?format=json|csv`

```typescript
// Returns all user data as a ZIP:
//   - symptom_logs.json / symptom_logs.csv
//   - pcos_lab_values.json (if applicable)
//   - peri_hot_flashes.json (if applicable)
//   - safety_plan.json (if exists)
// No derived data, no Ora insights — raw logs only.
// Streamed, not stored server-side.
```

### Audit Log

```sql
-- Deletion events only. No content. No symptoms.
CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID,           -- May be null after account deletion
  event_type  TEXT NOT NULL,  -- 'account_deleted','range_deleted','export_generated','crisis_purged'
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 13. Privacy & Security Architecture

### Encryption

| Layer | Method |
|---|---|
| Data at rest | Supabase AES-256 (platform) |
| Data in transit | TLS 1.3 minimum |
| Auth tokens | Expo SecureStore (iOS Keychain / Android Keystore) |
| PDF reports | Generated and streamed, never stored |
| Voice notes | Supabase Storage, user-scoped, auto-delete after 30 days |

### Privacy Constraints (Non-Negotiable)

- No plaintext email stored in database — `email_hash` only
- No calendar dates linked to identifiable users — only relative cycle days in Ora context
- No GPS data, ever
- No period start dates in plaintext linked to a user row — `last_period_date` stored as `DATE` type only (no time/timezone)
- No conversation history from Ora stored anywhere
- No third-party analytics SDKs that transmit health data (no Amplitude, Mixpanel, Firebase Analytics)
- Post-Roe compliance: government data requests contested to the extent legally possible; users notified when legally permitted

### HIPAA Compliance Path

1. Supabase HIPAA-eligible tier: enable before launch
2. Sign Business Associate Agreement (BAA) with Supabase
3. SOC 2 Type I: Year 1 target
4. SOC 2 Type II: Year 2 target (required for enterprise practitioner partnerships)
5. All engineers complete HIPAA training before production access

### Supabase Project Configuration

```
Settings → Auth:
  - JWT expiry: 3600 (1 hour)
  - Refresh token rotation: enabled
  - Email confirmations: required

Settings → Database:
  - SSL enforced: yes
  - Connection pooling: PgBouncer, Transaction mode

Settings → Network:
  - Disable the Supabase dashboard DB access for production
  - Restrict to app service role + known IP ranges for admin

Settings → Logs:
  - Postgres logs: enabled (query duration threshold: 2000ms)
  - Auth logs: enabled
  - Do NOT log query content in production (may contain health data)
```

---

## 14. FastAPI Project Structure

```
backend/
├── app/
│   ├── main.py                        # App factory, lifespan, router registration
│   ├── core/
│   │   ├── config.py                  # Pydantic BaseSettings (all env vars typed)
│   │   ├── security.py                # Supabase JWT verification
│   │   ├── supabase.py                # Supabase client (service role, server-side only)
│   │   └── exceptions.py             # Custom HTTPException subclasses
│   ├── api/
│   │   ├── deps.py                    # Shared Depends() — CurrentUser, require_tier
│   │   └── v1/
│   │       ├── router.py              # Aggregates all v1 sub-routers
│   │       ├── auth.py                # POST /auth/signup, POST /auth/delete
│   │       ├── user.py                # GET/PATCH /user/profile, GET /user/tier
│   │       ├── ora.py                 # POST /ora/* (all Ora/Aura agent features)
│   │       ├── report.py              # POST /report/generate (PDF stream)
│   │       └── data.py                # GET /data/export, DELETE /data/range
│   ├── services/
│   │   ├── ora_service.py             # Ora/Aura agent orchestration (Anthropic SDK)
│   │   ├── guard_service.py           # Safety guard eval (second Claude call)
│   │   ├── report_service.py          # WeasyPrint PDF generation
│   │   ├── crisis_service.py          # Crisis tier assessment logic
│   │   └── notification_service.py    # Expo push dispatch
│   ├── repositories/
│   │   ├── base.py                    # Abstract BaseRepository[T] — generic CRUD
│   │   ├── user_repository.py         # UserRepository(BaseRepository[User])
│   │   └── symptom_repository.py      # SymptomRepository — cycle queries
│   ├── schemas/
│   │   ├── core.py                    # Shared mixins: UUIDSchema, TimestampSchema
│   │   ├── user.py                    # UserRead, UserUpdate (extra="forbid")
│   │   ├── ora.py                     # OraRequest, OraResponse per feature
│   │   └── report.py                  # ReportRequest (chart_data, includes_si)
│   ├── agents/
│   │   ├── ora_agent.py               # Anthropic SDK — feature dispatch, system prompt
│   │   └── guard_agent.py             # Safety eval — blocks unsafe responses
│   └── templates/
│       └── drsp_report.html           # Jinja2 + CSS for WeasyPrint PDF
├── supabase/
│   └── functions/                     # Deno Edge Functions (sync, webhooks, notifs)
├── tests/
│   ├── unit/                          # Service + repository unit tests
│   └── integration/                   # FastAPI TestClient against real Supabase test project
├── Dockerfile
├── docker-compose.yml                 # Local dev: FastAPI + (optional) local Supabase
├── pyproject.toml                     # Dependencies: fastapi, uvicorn, supabase, anthropic,
│                                      # weasyprint, jinja2, pydantic-settings, httpx, pytest
└── .env.example
```

### SOLID Principles Applied

| Principle | How |
|---|---|
| **S** Single Responsibility | Each service class owns one domain. `OraService` only orchestrates AI. `ReportService` only generates PDFs. Routes only handle HTTP concerns. |
| **O** Open/Closed | New Ora features add a new method to `OraService` + a new route. Nothing existing is modified. |
| **L** Liskov Substitution | All repositories implement `BaseRepository[T]`. Any repo can be swapped in `Depends()` without breaking callers. |
| **I** Interface Segregation | Separate Pydantic schemas per endpoint (`OraExplainRequest` ≠ `OraPatternRequest`). No fat models. |
| **D** Dependency Inversion | Services receive repositories via `Depends()`. Routes receive services via `Depends()`. Nothing is instantiated inside a route. |

### Key Dependency Injection Pattern

```python
# app/api/deps.py
from typing import Annotated
from fastapi import Depends, HTTPException, status
from app.core.security import verify_supabase_jwt
from app.repositories.user_repository import UserRepository

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
) -> dict:
    payload = verify_supabase_jwt(token)  # validates Supabase JWT signature
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return payload

CurrentUser = Annotated[dict, Depends(get_current_user)]

def require_tier(tier: str):
    async def check(user: CurrentUser):
        if user["tier"] != tier:
            raise HTTPException(status_code=403, detail="upgrade_required")
    return check
```

---

## 15. API Routes Reference

All routes are **FastAPI** endpoints hosted on Railway. Base URL: `https://api.hormonaiq.com`. Authentication: Supabase JWT in `Authorization: Bearer` header on every protected route.

### Auth

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/v1/auth/signup` | Create user + initial profile in Supabase |
| `POST` | `/api/v1/auth/delete` | Full account + data hard deletion |

### User Profile

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/v1/user/profile` | Get user settings |
| `PATCH` | `/api/v1/user/profile` | Update settings |
| `GET` | `/api/v1/user/tier` | Get current entitlement tier |

### Sync (Supabase Edge Functions — not FastAPI)

| Method | Route | Description |
|---|---|---|
| `POST` | `/functions/v1/sync-pull` | WatermelonDB pull sync (mobile only) |
| `POST` | `/functions/v1/sync-push` | WatermelonDB push sync + crisis pipeline |

### Ora / Aura Agent

| Method | Route | Tier Required |
|---|---|---|
| `POST` | `/api/v1/ora/explain` | Free (3/mo) / Pro unlimited |
| `POST` | `/api/v1/ora/appointment-prep` | Pro |
| `POST` | `/api/v1/ora/why-now` | 1/phase free / Pro unlimited |
| `POST` | `/api/v1/ora/clinical-letter` | Pro |
| `POST` | `/api/v1/ora/patterns` | Pro (min 4 cycles) |
| `POST` | `/api/v1/ora/crisis-context` | Pro (min 4 cycles, no recent crisis) |

### Reports

| Method | Route | Tier | Description |
|---|---|---|---|
| `POST` | `/api/v1/report/generate` | Pro | Generate + stream DRSP PDF (WeasyPrint) |

### Data Portability

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/v1/data/export` | JSON + CSV export, streamed ZIP |
| `DELETE` | `/api/v1/data/range` | Delete entries by date range |

### Webhooks (Supabase Edge Functions — not FastAPI)

| Method | Route | Description |
|---|---|---|
| `POST` | `/functions/v1/revenuecat-webhook` | RevenueCat subscription events → `users.tier` |
| `POST` | `/functions/v1/send-daily-reminders` | Triggered by pg_cron |

---

## 16. Environment Variables

### App (Expo / `hormona-iq/.env`)

```bash
EXPO_PUBLIC_SUPABASE_URL=https://[project].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_RC_APPLE_KEY=appl_...
EXPO_PUBLIC_RC_GOOGLE_KEY=goog_...
EXPO_PUBLIC_API_BASE_URL=https://api.hormonaiq.com   # FastAPI on Railway
```

### FastAPI Backend (`backend/.env` / Railway dashboard)

```bash
# Supabase
SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...          # Never in client bundle — server-side only
SUPABASE_JWT_SECRET=...                    # For verifying user JWTs server-side

# Anthropic (Ora/Aura agent)
ANTHROPIC_API_KEY=sk-ant-...

# App
ENVIRONMENT=production                     # "development" | "production"
ALLOWED_ORIGINS=https://hormonaiq.com,https://app.hormonaiq.com
```

### Supabase Edge Functions (Supabase Secrets)

```bash
supabase secrets set REVENUECAT_WEBHOOK_SECRET=...
supabase secrets set APP_SERVICE_KEY=...   # For pg_cron HTTP calls to send-daily-reminders
```

---

## 18. Launch Checklist


### Week 1 (Before Any Data)
- [ ] Supabase project created on HIPAA-eligible tier
- [ ] Business Associate Agreement (BAA) signed with Supabase
- [ ] All tables created with RLS enabled and tested
- [ ] Supabase Auth configured (email + Apple + Google)
- [ ] SSL enforced; dashboard DB access disabled for prod
- [ ] RevenueCat project created, products configured in App Store Connect + Google Play

### Week 2
- [ ] WatermelonDB schema matches Supabase schema
- [ ] `sync-pull` and `sync-push` Edge Functions deployed + tested with real device
- [ ] Conflict resolution tested (two devices, same user, offline edits)
- [ ] RevenueCat webhook deployed, subscription events updating `users.tier` correctly
- [ ] Free tier Ora quota enforcement tested (3 explain_chart calls/month)

### Week 3
- [ ] Ora system prompt reviewed and signed off by Dr. Amara Osei
- [ ] PHI scrubbing function audited — confirm no calendar dates or identifiers in API payload
- [ ] Guard model eval tested against 20+ known diagnostic/prescriptive phrases
- [ ] All 6 Ora feature endpoints deployed and returning post-guard responses

### Before Beta
- [ ] PDF report generates correctly, streams to device, no file stored server-side
- [ ] PDF reviewed by Dr. Amara Osei for clinical formatting accuracy
- [ ] Data export (`/api/data/export`) tested with real user data
- [ ] Date-range deletion tested and confirmed complete
- [ ] Full account deletion tested — verify all rows removed in all tables
- [ ] Crisis event purge (72h) verified via pg_cron
- [ ] Push notifications delivered on iOS (APNs) and Android (FCM)
- [ ] Passive mode suppression tested — no non-crisis notifications during passive window
- [ ] All engineers complete HIPAA training

### Launch
- [ ] RevenueCat Sandbox purchase completes end-to-end on both platforms
- [ ] Production RevenueCat connected to live App Store + Google Play
- [ ] Rate limiting configured on all `/api/ora/*` routes
- [ ] Vercel function timeouts set (PDF: 30s, Ora: 15s, sync: 10s)
- [ ] Error monitoring (Sentry or equivalent) configured — no PHI in error logs
- [ ] pg_cron jobs confirmed running in production
- [ ] Post-Roe data request policy published on `hormonaiq.com/legal/privacy`
