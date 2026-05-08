import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { runCrisisPipeline, type SymptomLogRow } from "./crisis-pipeline.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Tables that participate in WatermelonDB sync-push
const SYNCED_TABLES = [
  "symptom_logs",
  "pcos_lab_values",
  "peri_hot_flashes",
  "safety_plans",
] as const;

type SyncedTable = (typeof SYNCED_TABLES)[number];

// Conflict key per table — used for upsert onConflict resolution
const UPSERT_CONFLICT_KEY: Record<SyncedTable, string> = {
  symptom_logs: "watermelon_id",
  pcos_lab_values: "watermelon_id",
  peri_hot_flashes: "watermelon_id",
  safety_plans: "watermelon_id",
};

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Verify the user JWT
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

  if (authError || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = user.id;
  const body = await req.json();
  const { changes } = body as { changes: Record<string, { created?: unknown[]; updated?: unknown[]; deleted?: unknown[] }> };

  if (!changes || typeof changes !== "object") {
    return new Response(
      JSON.stringify({ error: "Missing or invalid changes payload" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECURITY: Validate user_id on every row before any write.
  // Prevents a compromised client from writing to another user's rows.
  // ─────────────────────────────────────────────────────────────────────────
  for (const table of SYNCED_TABLES) {
    const tableChanges = changes[table];
    if (!tableChanges) continue;

    const allRows = [
      ...(tableChanges.created ?? []),
      ...(tableChanges.updated ?? []),
    ] as Record<string, unknown>[];

    for (const row of allRows) {
      if (row.user_id && row.user_id !== userId) {
        return new Response(
          JSON.stringify({ error: "Forbidden: user_id mismatch" }),
          { status: 403, headers: { "Content-Type": "application/json" } },
        );
      }
      // Stamp the correct user_id regardless of what the client sent
      row.user_id = userId;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPSERT symptom_logs + collect rows for the crisis pipeline
  // ─────────────────────────────────────────────────────────────────────────
  const logChanges = changes.symptom_logs;
  let upsertedLogs: SymptomLogRow[] = [];

  if (logChanges) {
    const toUpsert = [
      ...(logChanges.created ?? []),
      ...(logChanges.updated ?? []),
    ] as SymptomLogRow[];

    if (toUpsert.length > 0) {
      const { error: upsertError } = await supabase
        .from("symptom_logs")
        .upsert(toUpsert, { onConflict: UPSERT_CONFLICT_KEY.symptom_logs });

      if (upsertError) {
        console.error("symptom_logs upsert error:", upsertError);
        return new Response(
          JSON.stringify({ error: upsertError.message }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }

      upsertedLogs = toUpsert;
    }

    // Soft-delete: mark deleted_at instead of hard DELETE to preserve sync history
    for (const deleted of logChanges.deleted ?? []) {
      const deletedRow = deleted as Record<string, unknown>;
      await supabase
        .from("symptom_logs")
        .update({ deleted_at: new Date().toISOString() })
        .eq("watermelon_id", deletedRow.id as string)
        .eq("user_id", userId);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPSERT remaining tables (pcos_lab_values, peri_hot_flashes, safety_plans)
  // ─────────────────────────────────────────────────────────────────────────
  for (const table of ["pcos_lab_values", "peri_hot_flashes", "safety_plans"] as const) {
    const tableChanges = changes[table];
    if (!tableChanges) continue;

    const toUpsert = [
      ...(tableChanges.created ?? []),
      ...(tableChanges.updated ?? []),
    ] as Record<string, unknown>[];

    if (toUpsert.length > 0) {
      const { error } = await supabase
        .from(table)
        .upsert(toUpsert, { onConflict: UPSERT_CONFLICT_KEY[table] });

      if (error) {
        // Log but continue — partial sync is better than a full abort for non-critical tables
        console.error(`${table} upsert error:`, error);
      }
    }

    // Soft-delete safety_plans is not applicable (one-per-user, never deleted via sync)
    // For pcos_lab_values and peri_hot_flashes, hard-delete is acceptable (no crisis data)
    for (const deleted of tableChanges.deleted ?? []) {
      const deletedRow = deleted as Record<string, unknown>;
      await supabase
        .from(table)
        .delete()
        .eq("watermelon_id", deletedRow.id as string)
        .eq("user_id", userId);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CRISIS PIPELINE — runs after upserts so rows are persisted even if
  // the pipeline throws. This is the known MVP trade-off: crisis assessment
  // failure does NOT roll back user data.
  //
  // Known gap: not atomic. For full atomicity, wrap in a PLPGSQL RPC that
  // does the UPSERT + crisis insert in a single DB transaction.
  // ─────────────────────────────────────────────────────────────────────────
  if (upsertedLogs.length > 0) {
    try {
      await runCrisisPipeline(upsertedLogs, supabase);
    } catch (err: unknown) {
      // Pipeline failure is logged but does not fail the sync response.
      // The user's data is already persisted — this preserves data integrity.
      const message = err instanceof Error ? err.message : String(err);
      console.error("Crisis pipeline error (non-fatal):", message);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE SYNC WATERMARK
  // ─────────────────────────────────────────────────────────────────────────
  await supabase
    .from("sync_watermarks")
    .upsert({ user_id: userId, last_synced_at: new Date().toISOString() });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
