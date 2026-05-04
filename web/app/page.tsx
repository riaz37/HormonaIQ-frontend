import { WaitlistForm } from "./components/WaitlistForm";

// Botanical leaf SVG — replaces emoji per design audit (CRITICAL fix)
function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M14 24 C14 20 14 14 14 8 C14 8 8 10 7.5 16 C7 22 12 23 14 24Z"
        fill="#C7D9C5"
        stroke="#3F6F5A"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 18 C16 15 20 15 21 10 C18 9 15 13 14 18Z"
        fill="#C7D9C5"
        stroke="#3F6F5A"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="14"
        y1="8"
        x2="14"
        y2="24"
        stroke="#3F6F5A"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

function SprigIcon({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M14 23 L14 10"
        stroke="#3F6F5A"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M14 17 C12 14 7 14 7 9 C11 9 14 14 14 17Z"
        fill="#C7D9C5"
        stroke="#3F6F5A"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M14 13 C16 10 21 10 21 5 C17 5 14 10 14 13Z"
        fill="#DCEBDD"
        stroke="#3F6F5A"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BranchIcon({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M8 20 C8 16 10 14 14 14 C18 14 20 16 20 20"
        stroke="#3F6F5A"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M14 14 L14 6"
        stroke="#3F6F5A"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="8" cy="20" r="2" fill="#B97A8A" stroke="#3F6F5A" strokeWidth="1" />
      <circle cx="20" cy="20" r="2" fill="#E89F86" stroke="#3F6F5A" strokeWidth="1" />
      <circle cx="14" cy="6" r="2" fill="#C7D9C5" stroke="#3F6F5A" strokeWidth="1" />
      <circle cx="14" cy="14" r="1.5" fill="#F5E4B8" stroke="#3F6F5A" strokeWidth="1" />
    </svg>
  );
}

// Decorative leaf — anchored to corner, opacity 0.25, pointer-events none
function DecorativeLeaf() {
  return (
    <svg
      width="320"
      height="320"
      viewBox="0 0 320 320"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute -top-12 -right-16 opacity-[0.18] select-none"
    >
      <path
        d="M280 20 C280 20 160 60 100 140 C40 220 80 300 160 300 C240 300 300 240 300 160 C300 80 280 20 280 20Z"
        fill="#9CB89A"
      />
      <path
        d="M200 40 C200 40 140 80 120 140 C100 200 130 260 180 260"
        stroke="#5C8A75"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M260 80 C240 100 220 130 210 160"
        stroke="#5C8A75"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

// Phase ring — SVG donut showing cycle day 19 / luteal
function CycleRing() {
  const size = 280;
  const stroke = 28;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  // Phase segments (28-day cycle)
  // Menstrual 0-18%, Follicular 18-47%, Ovulatory 47-58%, Luteal 58-100%
  const phases = [
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
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
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

const conditions = [
  {
    name: "PMDD",
    accent: "#B97A8A",
    accentBg: "#F5E4B8",
    body:
      "Daily symptom tracking with the DRSP — the same scale used in clinical trials. Two complete cycles become clinical documentation.",
  },
  {
    name: "PCOS",
    accent: "#5C8A75",
    accentBg: "#C7D9C5",
    body:
      "Rotterdam criteria logging. Irregular cycle tracking that doesn't assume a 28-day pattern. Data your endocrinologist can use.",
  },
  {
    name: "Perimenopause",
    accent: "#C97962",
    accentBg: "#F5E4B8",
    body:
      "Greene Climacteric Scale built in. Tracking that takes the transition seriously — not as a mood disorder, as a hormonal shift.",
  },
  {
    name: "ADHD & hormone overlap",
    accent: "#7A8B82",
    accentBg: "#DCEBDD",
    body:
      "Medication efficacy mapped onto cycle phase. Understand why focus and executive function change across the month.",
  },
  {
    name: "Endometriosis & more",
    accent: "#D88A95",
    accentBg: "#F5C8B5",
    body:
      "Many of you carry more than one condition. HormonaIQ tracks them together — not as separate problems requiring separate apps.",
    wide: true,
  },
];

const promises = [
  {
    Icon: SprigIcon,
    title: "Clinical scales, not vibes",
    body: "DRSP for PMDD. Greene Scale for perimenopause. Rotterdam criteria for PCOS. The tools your doctor uses, mapped to what you already know.",
  },
  {
    Icon: LeafIcon,
    title: "Adult language, every page",
    body: 'No euphemisms. No "flow days." No mood pickers built from emoji. You\'re the expert on your own body. We treat you like one.',
  },
  {
    Icon: BranchIcon,
    title: "No condition left behind",
    body: "PMDD, PCOS, perimenopause, endometriosis, and ADHD-hormone overlap — tracked together. Because most of you have more than one.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ─── Nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-sage/20 bg-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a
            href="/"
            className="font-sans text-[17px] font-semibold tracking-tight text-ink"
          >
            HormonaIQ
          </a>
          <a
            href="#waitlist"
            className="rounded-[9999px] bg-eucalyptus px-5 py-2.5 text-[14px] font-semibold text-white transition-colors duration-150 hover:bg-eucalyptus-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus"
          >
            Join waitlist →
          </a>
        </div>
      </header>

      <main>
        {/* ─── Hero ────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Gradient blob — butter/sage-light, top-right */}
          <div
            className="pointer-events-none absolute -top-32 right-0 h-[600px] w-[600px] rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at 70% 30%, #F5E4B8 0%, #C7D9C5 50%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-32">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              {/* Left: copy */}
              <div className="flex flex-col gap-8">
                {/* Eyebrow badge */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-[9999px] border border-sage/40 bg-mint-pale px-3.5 py-1.5 text-[12px] font-medium uppercase tracking-[0.14em] text-eucalyptus-soft">
                    <span className="h-1.5 w-1.5 rounded-full bg-eucalyptus" aria-hidden="true" />
                    For women who already knew
                  </span>
                </div>

                {/* Hero headline — mixed typography */}
                <h1 className="flex flex-col gap-1">
                  <span className="font-sans text-[42px] font-bold leading-[1.05] tracking-tight text-ink sm:text-[52px] lg:text-[56px]">
                    You already knew.
                  </span>
                  <span className="font-display italic text-[42px] leading-[1.1] text-ink sm:text-[52px] lg:text-[56px]">
                    Now your doctor will too.
                  </span>
                </h1>

                {/* Body */}
                <p className="max-w-[480px] text-[17px] leading-[1.6] text-ink-2">
                  The average woman with PMDD waits 12 years and sees 6
                  providers before diagnosis. Most are told it&rsquo;s anxiety,
                  stress, or to lose weight. HormonaIQ turns what you already
                  feel into the clinical chart your doctor can&rsquo;t dismiss.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#waitlist"
                    className="inline-flex h-[52px] items-center rounded-[9999px] bg-eucalyptus px-7 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-eucalyptus-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus"
                  >
                    Join the waitlist →
                  </a>
                  <a
                    href="#how-it-works"
                    className="inline-flex h-[52px] items-center rounded-[9999px] border border-sage/50 bg-transparent px-7 text-[15px] font-medium text-ink-2 transition-colors duration-150 hover:border-eucalyptus/50 hover:text-eucalyptus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus"
                  >
                    See how it works
                  </a>
                </div>

                {/* Trust line */}
                <p className="text-[13px] text-ink-3">
                  Reviewed by clinicians who treat PMDD, PCOS, and
                  perimenopause.
                </p>

                {/* Platform badge */}
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-eucalyptus" aria-hidden="true" />
                  <span className="text-[13px] font-medium text-ink-2">
                    NOW LIVE — Available on iOS &amp; Android
                  </span>
                </div>
              </div>

              {/* Right: Cycle ring */}
              <div className="relative flex justify-center lg:justify-end">
                <DecorativeLeaf />
                <CycleRing />
              </div>
            </div>
          </div>
        </section>

        {/* ─── How it works ────────────────────────────────────────────── */}
        <section
          id="how-it-works"
          className="border-t border-sage/20 bg-cream-warm"
        >
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-14 max-w-xl">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-eucalyptus-soft">
                How it works
              </p>
              <h2 className="font-display italic text-[32px] leading-[1.15] text-ink">
                Data you already have. Documentation you never did.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {promises.map(({ Icon, title, body }) => (
                <div
                  key={title}
                  className="flex flex-col gap-4 rounded-[18px] bg-cream p-7 ring-1 ring-sage/20"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-mint-mist">
                    <Icon />
                  </div>
                  <h3 className="text-[17px] font-semibold leading-snug text-ink">
                    {title}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-ink-2">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Conditions ──────────────────────────────────────────────── */}
        <section className="border-t border-sage/20 bg-cream">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-14 max-w-xl">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-eucalyptus-soft">
                Built for
              </p>
              <h2 className="font-display italic text-[32px] leading-[1.15] text-ink">
                The conditions that take years to name.
              </h2>
              <p className="mt-4 text-[16px] leading-[1.6] text-ink-2">
                Most cycle apps assume one condition and a 28-day cycle. Most
                women here have neither.
              </p>
            </div>

            {/* 2-col grid on desktop — fixes audit HIGH finding */}
            <div className="grid gap-4 sm:grid-cols-2">
              {conditions.map((c) => (
                <div
                  key={c.name}
                  className={`flex flex-col gap-3 overflow-hidden rounded-[18px] bg-paper ring-1 ring-sage/20 ${
                    c.wide ? "sm:col-span-2" : ""
                  }`}
                >
                  {/* Phase color accent strip */}
                  <div
                    className="h-1 w-full"
                    style={{ backgroundColor: c.accent }}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col gap-3 px-7 pb-7">
                    <h3 className="text-[18px] font-semibold leading-snug text-ink">
                      {c.name}
                    </h3>
                    <p className="text-[14px] leading-[1.65] text-ink-2">
                      {c.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Waitlist ─────────────────────────────────────────────────── */}
        <section
          id="waitlist"
          className="border-t border-sage/20 bg-mint-mist"
        >
          <div className="mx-auto max-w-6xl px-6 py-20">
            {/* Full-width card — fixes audit HIGH finding (was 55% width) */}
            <div className="w-full rounded-[28px] bg-cream p-10 ring-1 ring-sage/30 sm:p-14">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
                {/* Left: copy */}
                <div className="flex flex-col gap-5">
                  <h2 className="text-[32px] font-sans font-bold leading-tight text-ink">
                    Join the{" "}
                    <span className="font-display italic">waitlist.</span>
                  </h2>
                  <p className="text-[17px] leading-[1.6] text-ink-2">
                    An invitation arrives when your module opens. We don&rsquo;t
                    send anything else — promise.
                  </p>
                  <ul className="flex flex-col gap-2 text-[14px] text-ink-3">
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-sage" aria-hidden="true" />
                      No spam, no sharing
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-sage" aria-hidden="true" />
                      Unsubscribe anytime
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-sage" aria-hidden="true" />
                      Your data stays on your device
                    </li>
                  </ul>
                </div>

                {/* Right: form */}
                <div className="flex flex-col gap-4">
                  <WaitlistForm />
                  <p id="waitlist-note" className="text-[13px] text-ink-3">
                    HormonaIQ is not a substitute for medical advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── The promise ─────────────────────────────────────────────── */}
        <section className="border-t border-sage/20 bg-cream-warm">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.16em] text-eucalyptus-soft">
              What we will never do
            </p>
            <div className="flex flex-col gap-5 text-[20px] leading-[1.5] text-ink">
              <p>
                We will never tell you you&rsquo;re feeling{" "}
                <span className="font-semibold">LUMINOUS</span> when you feel
                like death.
              </p>
              <p>We will never sell your data to anyone.</p>
              <p>We will never pretend this is easy.</p>
              <p className="text-eucalyptus-soft">
                We will show up honestly. Every day.
              </p>
            </div>
            <div className="mt-12">
              <a
                href="#waitlist"
                className="inline-flex h-[52px] items-center rounded-[9999px] bg-eucalyptus px-8 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-eucalyptus-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus"
              >
                Join the waitlist →
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-sage/20 bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-sans text-[15px] font-semibold text-ink">
              HormonaIQ
            </span>
            <p className="max-w-sm text-[12px] leading-[1.5] text-ink-3">
              HormonaIQ is not a substitute for medical advice, diagnosis, or
              treatment. Always consult a qualified healthcare provider.
            </p>
            <p className="text-[12px] text-ink-3">
              © {new Date().getFullYear()} HormonaIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
