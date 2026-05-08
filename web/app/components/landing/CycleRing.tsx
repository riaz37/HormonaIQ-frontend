interface Phase {
  pct: number;
  color: string;
  label: string;
}

export default function CycleRing() {
  const size = 280;
  const stroke = 28;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  // Phase segments (28-day cycle)
  // Menstrual 0-18%, Follicular 18-47%, Ovulatory 47-58%, Luteal 58-100%
  const phases: Phase[] = [
    { pct: 0.18, color: "#B97A8A", label: "menstrual" },
    { pct: 0.29, color: "#C7D9C5", label: "follicular" },
    { pct: 0.11, color: "#F5E4B8", label: "ovulatory" },
    { pct: 0.42, color: "#E89F86", label: "luteal" },
  ];

  // Build arc segments
  let offset = circumference * 0.25; // start from top (rotate -90°)
  const arcs = phases.map((phase) => {
    const dash = circumference * phase.pct;
    const gap = circumference - dash;
    const arc = (
      <circle
        key={phase.label}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={phase.color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={offset}
        strokeLinecap="butt"
      />
    );
    offset -= dash;
    return arc;
  });

  // Day 19 indicator dot — 19/28 = 67.8% around the circle
  const dayPct = 19 / 28;
  const angle = dayPct * 2 * Math.PI - Math.PI / 2;
  const dotR = r;
  const dotX = cx + dotR * Math.cos(angle);
  const dotY = cy + dotR * Math.sin(angle);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label="Cycle ring showing day 19 of 28 — luteal phase"
        role="img"
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#ECF4EC"
          strokeWidth={stroke}
        />
        {/* Phase arcs */}
        {arcs}
        {/* Day indicator dot */}
        <circle
          cx={dotX}
          cy={dotY}
          r={6}
          fill="white"
          stroke="#2C5443"
          strokeWidth={2}
        />
        {/* White inner circle (creates donut) */}
        <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="white" />
      </svg>

      {/* Inner content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
        <span
          className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink-3"
          aria-hidden="true"
        >
          DAY
        </span>
        <span
          className="font-mono text-[64px] font-medium leading-none text-ink"
          aria-hidden="true"
        >
          19
        </span>
        <span
          className="font-display italic text-[16px] text-ink-3"
          aria-hidden="true"
        >
          luteal
        </span>
      </div>

      {/* Floating badge */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-[9999px] border border-sage/30 bg-paper px-4 py-1.5 shadow-sm"
        aria-hidden="true"
      >
        <span className="font-display italic text-[14px] text-ink-2">
          &ldquo;that makes sense.&rdquo;
        </span>
      </div>
    </div>
  );
}
