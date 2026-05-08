interface Condition {
  name: string;
  accent: string;
  accentBg: string;
  body: string;
  wide?: boolean;
}

const conditions: Condition[] = [
  {
    name: "PMDD",
    accent: "#B97A8A",
    accentBg: "#F5E4B8",
    body: "Daily symptom tracking with the DRSP — the same scale used in clinical trials. Two complete cycles become clinical documentation.",
  },
  {
    name: "PCOS",
    accent: "#5C8A75",
    accentBg: "#C7D9C5",
    body: "Rotterdam criteria logging. Irregular cycle tracking that doesn't assume a 28-day pattern. Data your endocrinologist can use.",
  },
  {
    name: "Perimenopause",
    accent: "#C97962",
    accentBg: "#F5E4B8",
    body: "Greene Climacteric Scale built in. Tracking that takes the transition seriously — not as a mood disorder, as a hormonal shift.",
  },
  {
    name: "ADHD & hormone overlap",
    accent: "#7A8B82",
    accentBg: "#DCEBDD",
    body: "Medication efficacy mapped onto cycle phase. Understand why focus and executive function change across the month.",
  },
  {
    name: "Endometriosis & more",
    accent: "#D88A95",
    accentBg: "#F5C8B5",
    body: "Many of you carry more than one condition. HormonaIQ tracks them together — not as separate problems requiring separate apps.",
    wide: true,
  },
];

export default function ConditionsSection() {
  return (
    <section id="conditions" className="bg-cream-warm border-t border-sage/20">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-eucalyptus-soft mb-3">
            Built for
          </p>
          <h2 className="font-display italic text-[32px] leading-[1.15] text-ink">
            The conditions that take years to name.
          </h2>
          <p className="text-[16px] leading-[1.6] text-ink-2 mt-4">
            Most cycle apps assume one condition and a 28-day cycle. Most women here have neither.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {conditions.map((c) => (
            <article
              key={c.name}
              className={`flex flex-col gap-3 overflow-hidden rounded-[18px] bg-paper ring-1 ring-sage/20 ${
                c.wide ? "sm:col-span-2" : ""
              }`}
            >
              <div className="h-1 w-full" style={{ backgroundColor: c.accent }} aria-hidden="true" />
              <div className="px-7 pb-7 flex flex-col gap-3">
                <h3 className="text-[18px] font-semibold leading-snug text-ink">{c.name}</h3>
                <p className="text-[14px] leading-[1.65] text-ink-2">{c.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
