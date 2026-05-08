import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

const PHASE_COPY: Record<string, string[]> = {
  menstrual: [
    "Harder day. Log how you're feeling — it builds your pattern.",
    "Day noted. Logging now means more context later.",
  ],
  follicular: [
    "Follicular phase. A good time to log — contrast data is what makes patterns visible.",
    "Energy window. One log keeps your baseline sharp.",
  ],
  ovulatory: [
    "Mid-cycle. Logging consistently through this phase improves your chart accuracy.",
  ],
  luteal: [
    "Luteal phase has started. Logging consistently this week matters most.",
    "Tracking in this phase is where the pattern shows up.",
  ],
  luteal_late: [
    "Your harder window is starting. One log a day is enough.",
    "Heads up — you're heading into your harder stretch. We're tracking.",
  ],
};

function pickCopy(phase: string): string {
  const options = PHASE_COPY[phase] ?? PHASE_COPY["follicular"];
  return options[Math.floor(Math.random() * options.length)];
}

Deno.serve(async (_req: Request) => {
  const nowUtc = new Date();
  const hour = nowUtc.getUTCHours();
  const minute = nowUtc.getUTCMinutes();

  // Query users whose notification time matches the current UTC minute
  const { data: users, error } = await supabase
    .from("users")
    .select("id, expo_push_token, notifs_enabled, passive_mode_until, cycle_len, last_period_date")
    .eq("notifs_enabled", true)
    .eq("notif_hour", hour)
    .eq("notif_minute", minute)
    .not("expo_push_token", "is", null);

  if (error) {
    console.error("Failed to query users:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (!users || users.length === 0) {
    return new Response(JSON.stringify({ sent: 0 }), { status: 200 });
  }

  let sent = 0;

  for (const user of users) {
    // Skip users in passive mode
    if (user.passive_mode_until) {
      const passiveUntil = new Date(user.passive_mode_until);
      if (passiveUntil > nowUtc) continue;
    }

    // Estimate current cycle phase
    const phase = estimatePhase(user.last_period_date, user.cycle_len ?? 28);
    const body = pickCopy(phase);

    try {
      const res = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.expo_push_token,
          title: "HormonaIQ",
          body,
          data: { type: "daily_reminder" },
          sound: "default",
        }),
      });

      if (!res.ok) {
        console.error(`Push failed for user ${user.id}:`, await res.text());
        continue;
      }

      await supabase.from("notification_log").insert({
        user_id: user.id,
        type: "daily_reminder",
        phase,
      });

      sent++;
    } catch (err) {
      console.error(`Push error for user ${user.id}:`, err);
    }
  }

  return new Response(JSON.stringify({ sent }), {
    headers: { "Content-Type": "application/json" },
  });
});

function estimatePhase(lastPeriodDate: string | null, cycleLen: number): string {
  if (!lastPeriodDate) return "follicular";
  const daysSince = Math.floor(
    (Date.now() - new Date(lastPeriodDate).getTime()) / 86_400_000,
  );
  const cycleDay = (daysSince % cycleLen) + 1;

  if (cycleDay <= 5) return "menstrual";
  if (cycleDay <= 13) return "follicular";
  if (cycleDay <= 16) return "ovulatory";
  if (cycleDay <= cycleLen - 5) return "luteal";
  return "luteal_late";
}
