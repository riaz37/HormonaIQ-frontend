/**
 * generate-drsp-chart
 *
 * Triggered after sync-push to pre-compute DRSP phase averages and C-PASS
 * scoring for a user's latest complete cycle, then upsert into drsp_charts.
 *
 * Called via: supabase.functions.invoke('generate-drsp-chart', { body: { user_id } })
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const CORE_MOOD_ITEMS = [
  "mood_shifts", "irritability", "anxiety_tension", "depressed_mood",
  "hopelessness", "self_critical", "feeling_overwhelmed", "feeling_out_of_control",
];

Deno.serve(async (req: Request) => {
  const { user_id } = await req.json() as { user_id: string };
  if (!user_id) {
    return new Response(JSON.stringify({ error: "user_id required" }), { status: 400 });
  }

  // Fetch all logs for this user ordered by date
  const { data: logs, error: logsError } = await supabase
    .from("symptom_logs")
    .select("log_date, cycle_day, cycle_phase, drsp_scores")
    .eq("user_id", user_id)
    .is("deleted_at", null)
    .order("log_date", { ascending: true });

  if (logsError || !logs) {
    return new Response(JSON.stringify({ error: logsError?.message ?? "no logs" }), {
      status: 500,
    });
  }

  // Fetch user's cycle_len
  const { data: userData } = await supabase
    .from("users")
    .select("cycle_len")
    .eq("id", user_id)
    .single();

  const cycleLen = userData?.cycle_len ?? 28;

  // Group logs into cycles based on cycle_day resets
  const cycles = groupIntoCycles(logs, cycleLen);
  if (cycles.length === 0) {
    return new Response(JSON.stringify({ generated: 0 }), { status: 200 });
  }

  let generated = 0;

  for (let i = 0; i < cycles.length; i++) {
    const cycleLogs = cycles[i];
    if (cycleLogs.length < 5) continue; // skip cycles with too few logs

    const lutealLogs = cycleLogs.filter((l) =>
      l.cycle_phase === "luteal" || l.cycle_phase === "luteal_late"
    );
    const follicularLogs = cycleLogs.filter((l) =>
      l.cycle_phase === "follicular" || l.cycle_phase === "menstrual"
    );

    if (lutealLogs.length === 0 || follicularLogs.length === 0) continue;

    const lutealAvg = computeAverages(lutealLogs);
    const follicularAvg = computeAverages(follicularLogs);
    const cPass = computeCPass(lutealAvg, follicularAvg);
    const swingRatio = computeSwingRatio(lutealAvg, follicularAvg);

    const startDate = cycleLogs[0].log_date;
    const endDate = cycleLogs[cycleLogs.length - 1].log_date;

    const { error: upsertError } = await supabase.from("drsp_charts").upsert(
      {
        user_id,
        cycle_number: i + 1,
        start_date: startDate,
        end_date: endDate,
        days_logged: cycleLogs.length,
        days_estimated: 0,
        c_pass_met: cPass.absolute_severity && cPass.core_mood && cPass.absolute_clearance && cPass.cyclicity,
        chart_data: {
          luteal_averages: lutealAvg,
          follicular_averages: follicularAvg,
          c_pass: cPass,
          swing_ratio: swingRatio,
          logged_days: cycleLogs.length,
          estimated_days: 0,
        },
        generated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,cycle_number" }
    );

    if (upsertError) {
      console.error(`drsp_charts upsert error cycle ${i + 1}:`, upsertError);
    } else {
      generated++;
    }
  }

  return new Response(JSON.stringify({ generated }), {
    headers: { "Content-Type": "application/json" },
  });
});

function groupIntoCycles(
  logs: Array<{ log_date: string; cycle_day: number | null; cycle_phase: string | null; drsp_scores: Record<string, number> | null }>,
  cycleLen: number,
): typeof logs[] {
  const cycles: typeof logs[] = [];
  let current: typeof logs = [];

  for (const log of logs) {
    const day = log.cycle_day ?? 1;
    if (day === 1 && current.length > 0) {
      cycles.push(current);
      current = [];
    }
    current.push(log);
  }
  if (current.length > 0) cycles.push(current);
  return cycles;
}

function computeAverages(
  logs: Array<{ drsp_scores: Record<string, number> | null }>,
): Record<string, number> {
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const log of logs) {
    if (!log.drsp_scores) continue;
    for (const [item, score] of Object.entries(log.drsp_scores)) {
      sums[item] = (sums[item] ?? 0) + score;
      counts[item] = (counts[item] ?? 0) + 1;
    }
  }

  const avgs: Record<string, number> = {};
  for (const item of Object.keys(sums)) {
    avgs[item] = Math.round((sums[item] / counts[item]) * 10) / 10;
  }
  return avgs;
}

function computeCPass(
  luteal: Record<string, number>,
  follicular: Record<string, number>,
): { absolute_severity: boolean; core_mood: boolean; absolute_clearance: boolean; cyclicity: boolean } {
  const lutealValues = Object.values(luteal);
  const highItems = lutealValues.filter((v) => v >= 4).length;

  const coreScores = CORE_MOOD_ITEMS.map((k) => luteal[k] ?? 0);
  const hasCoreMood = coreScores.some((v) => v >= 4);

  const follicularCoreScores = CORE_MOOD_ITEMS.map((k) => follicular[k] ?? 0);
  const clearanceOk = follicularCoreScores.every((v) => v <= 3);

  // Cyclicity: >30% differential on at least 3 items
  let cyclicItems = 0;
  for (const item of Object.keys(luteal)) {
    const l = luteal[item] ?? 0;
    const f = follicular[item] ?? 0;
    if (f > 0 && (l - f) / f > 0.3) cyclicItems++;
    else if (f === 0 && l >= 2) cyclicItems++;
  }

  return {
    absolute_severity: highItems >= 5,
    core_mood: hasCoreMood,
    absolute_clearance: clearanceOk,
    cyclicity: cyclicItems >= 3,
  };
}

function computeSwingRatio(
  luteal: Record<string, number>,
  follicular: Record<string, number>,
): number {
  const items = Object.keys(luteal).filter((k) => k in follicular);
  if (items.length === 0) return 0;
  const ratios = items
    .map((k) => (follicular[k] > 0 ? luteal[k] / follicular[k] : luteal[k]))
    .filter((r) => isFinite(r));
  if (ratios.length === 0) return 0;
  return Math.round((ratios.reduce((a, b) => a + b, 0) / ratios.length) * 10) / 10;
}
