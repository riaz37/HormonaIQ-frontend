import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Verify the user JWT — do NOT use service role for auth checks
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

  if (authError || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const userId = user.id;

  // WatermelonDB passes last_pulled_at as a Unix ms timestamp or null on first sync
  const lastPulledAt: number | null = body.last_pulled_at ?? null;
  const since = lastPulledAt
    ? new Date(lastPulledAt).toISOString()
    : new Date(0).toISOString();

  // Capture server timestamp before queries so the client's next pull watermark
  // is anchored to a point before any concurrent writes complete.
  const now = Date.now();

  // Pull changes from each table since last_pulled_at in parallel.
  // idx_symptom_logs_user_updated covers the symptom_logs query efficiently.
  const [logsResult, labsResult, flashesResult, safetyResult] =
    await Promise.all([
      supabase
        .from("symptom_logs")
        .select("*")
        .eq("user_id", userId)
        .gt("updated_at", since)
        .is("deleted_at", null), // exclude soft-deleted rows from normal pulls

      supabase
        .from("pcos_lab_values")
        .select("*")
        .eq("user_id", userId)
        .gt("created_at", since),

      supabase
        .from("peri_hot_flashes")
        .select("*")
        .eq("user_id", userId)
        .gt("created_at", since),

      supabase
        .from("safety_plans")
        .select("*")
        .eq("user_id", userId)
        .gt("last_updated", since),
    ]);

  // Log any individual table errors without failing the whole pull
  if (logsResult.error) console.error("symptom_logs pull error:", logsResult.error);
  if (labsResult.error) console.error("pcos_lab_values pull error:", labsResult.error);
  if (flashesResult.error) console.error("peri_hot_flashes pull error:", flashesResult.error);
  if (safetyResult.error) console.error("safety_plans pull error:", safetyResult.error);

  // Map to WatermelonDB sync format: { created: [], updated: [], deleted: [] }
  // Since Supabase does not distinguish created vs. updated in the delta query,
  // all rows go into `updated`. WatermelonDB handles this correctly via
  // watermelon_id matching (upserts on the client side).
  const changes = {
    symptom_logs: {
      created: [],
      updated: logsResult.data ?? [],
      deleted: [],
    },
    pcos_lab_values: {
      created: [],
      updated: labsResult.data ?? [],
      deleted: [],
    },
    peri_hot_flashes: {
      created: [],
      updated: flashesResult.data ?? [],
      deleted: [],
    },
    safety_plans: {
      created: [],
      updated: safetyResult.data ?? [],
      deleted: [],
    },
  };

  return new Response(JSON.stringify({ changes, timestamp: now }), {
    headers: { "Content-Type": "application/json" },
  });
});
