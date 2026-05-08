// crisis-pipeline.ts
// Server-side authoritative crisis assessment.
//
// This is an independent re-implementation of the client-side logic in
// hormona-iq/src/lib/crisis.ts. The server MUST NOT trust the client's
// crisis_flag / crisis_tier fields — it recalculates from raw drsp_scores.
//
// Tier definitions (from backend.md §11):
//   Tier 3: SI >= 4 (immediate danger)
//   Tier 2: SI >= 3
//   Tier 1: SI >= 1 OR 5+ DRSP items at score >= 4 today
//   null:   no threshold crossed
//
// Storage rules (§11):
//   - crisis_events stores only: user_id, tier, trigger_source, cycle_day
//   - NO symptom content, NO drsp_scores, NO free_text_note
//   - purge_after = occurred_at + 72 hours (GENERATED column)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface SymptomLogRow {
  id: string;
  user_id: string;
  log_date: string;
  cycle_day?: number | null;
  drsp_scores: Record<string, number> | null;
  crisis_flag?: boolean;
  crisis_tier?: number | null;
  [key: string]: unknown;
}

/**
 * Compute the crisis tier from a single symptom log row.
 *
 * Uses DRSP suicidal_ideation key (scale 1–6, where >= 4 maps to PHQ-9 max).
 * Returns null if no crisis threshold is crossed.
 */
export function assessCrisisTier(log: SymptomLogRow): number | null {
  const drsp = log.drsp_scores;
  if (!drsp || typeof drsp !== "object") return null;

  const si: number = drsp["suicidal_ideation"] ?? 0;

  // Tier 3: SI >= 4 (maps to PHQ-9 item 9 maximum on 1–6 DRSP scale)
  if (si >= 4) return 3;

  // Tier 2: SI >= 3
  if (si >= 3) return 2;

  // Tier 1: SI >= 1 OR 5+ items at score >= 4
  const highItems = Object.values(drsp).filter((v) => typeof v === "number" && v >= 4).length;
  if (si >= 1 || highItems >= 5) return 1;

  return null;
}

type SupabaseClient = ReturnType<typeof createClient>;

/**
 * Run the crisis pipeline over a batch of symptom log rows.
 *
 * For each log that crosses a crisis threshold:
 *   1. Insert a row into crisis_events (tier + cycle_day + source only — no content).
 *   2. Update crisis_flag and crisis_tier on the symptom_log row itself.
 *
 * This function is intentionally fire-and-forget from sync-push: a pipeline
 * failure does NOT roll back the sync upsert (acceptable MVP trade-off,
 * documented in sync-push/index.ts).
 */
export async function runCrisisPipeline(
  logs: SymptomLogRow[],
  supabase: SupabaseClient,
): Promise<void> {
  for (const log of logs) {
    const tier = assessCrisisTier(log);

    if (tier === null) {
      // Ensure previously-flagged logs are cleared if scores changed
      if (log.crisis_flag) {
        await supabase
          .from("symptom_logs")
          .update({ crisis_flag: false, crisis_tier: null })
          .eq("watermelon_id", log.watermelon_id ?? log.id)
          .eq("user_id", log.user_id);
      }
      continue;
    }

    // 1. Store the crisis event (no symptom content — only metadata)
    const { error: eventError } = await supabase.from("crisis_events").insert({
      user_id: log.user_id,
      tier,
      trigger_source: "daily_log",
      cycle_day: log.cycle_day ?? null,
      // occurred_at defaults to now()
      // purge_after is a GENERATED column (occurred_at + 72 hours)
    });

    if (eventError) {
      console.error(
        `crisis_events insert failed for log ${log.id}:`,
        eventError,
      );
      // Continue — partial crisis storage is better than halting the pipeline
    }

    // 2. Flag the symptom log row (crisis_tier visible to clinical export only)
    const { error: flagError } = await supabase
      .from("symptom_logs")
      .update({ crisis_flag: true, crisis_tier: tier })
      .eq("watermelon_id", log.watermelon_id ?? log.id)
      .eq("user_id", log.user_id);

    if (flagError) {
      console.error(
        `symptom_logs crisis flag update failed for log ${log.id}:`,
        flagError,
      );
    }
  }
}
