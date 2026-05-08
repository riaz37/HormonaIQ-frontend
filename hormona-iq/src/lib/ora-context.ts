export interface OraContext {
  conditions: string[];
  cycle_length: number;
  entries: Array<{
    cycle_day: number | null;
    phase: string | null;
    drsp: Record<string, number> | null;
    sleep_quality: number | null;
    functional_impairment: string | null;
  }>;
  luteal_averages: Record<string, number>;
  follicular_averages: Record<string, number>;
  cycle_count: number;
}

interface LogEntry {
  date: string;
  drspScores: Record<string, number>;
  mood: number | null;
  energy: number | null;
  createdAt: string;
}

function computePhaseAverages(
  entries: LogEntry[],
  phase: 'luteal' | 'follicular',
  cycleLen: number,
  lastPeriod: Date | null
): Record<string, number> {
  const phaseEntries = entries.filter((e) => {
    if (!lastPeriod) return false;
    const entryDate = new Date(e.date);
    const daysSince = Math.floor((entryDate.getTime() - lastPeriod.getTime()) / 86400000);
    const cycleDay = (daysSince % cycleLen) + 1;
    const lutealStart = Math.floor(cycleLen * 0.55);
    if (phase === 'luteal') return cycleDay >= lutealStart;
    return cycleDay < lutealStart && cycleDay > 5;
  });

  if (phaseEntries.length === 0) return {};

  const totals: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const entry of phaseEntries) {
    for (const [key, val] of Object.entries(entry.drspScores)) {
      totals[key] = (totals[key] ?? 0) + val;
      counts[key] = (counts[key] ?? 0) + 1;
    }
  }

  return Object.fromEntries(
    Object.keys(totals).map((k) => [k, Math.round((totals[k] / counts[k]) * 10) / 10])
  );
}

export function buildOraContext(
  entries: LogEntry[],
  cycleLen: number,
  conditions: string[],
  lastPeriod: Date | null
): OraContext {
  const lastPeriodMs = lastPeriod?.getTime() ?? 0;

  return {
    conditions,
    cycle_length: cycleLen,
    entries: entries.map((e) => {
      const entryDate = new Date(e.date);
      const daysSince = lastPeriod
        ? Math.floor((entryDate.getTime() - lastPeriodMs) / 86400000)
        : null;
      const cycleDay = daysSince !== null ? (daysSince % cycleLen) + 1 : null;
      return {
        cycle_day: cycleDay,
        phase: null,
        drsp: e.drspScores,
        sleep_quality: null,
        functional_impairment: null,
      };
    }),
    luteal_averages: computePhaseAverages(entries, 'luteal', cycleLen, lastPeriod),
    follicular_averages: computePhaseAverages(entries, 'follicular', cycleLen, lastPeriod),
    cycle_count: lastPeriod
      ? Math.max(1, Math.floor((Date.now() - lastPeriodMs) / (cycleLen * 86400000)))
      : 0,
  };
}
