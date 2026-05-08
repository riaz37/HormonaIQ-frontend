interface Step {
  number: string;
  title: string;
  body: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Log once a day",
    body: "Takes 90 seconds. Rate your symptoms using the DRSP — the same scale used in clinical PMDD trials. No journaling, no essays.",
  },
  {
    number: "02",
    title: "Watch the patterns emerge",
    body: "Two complete cycles build a clinical picture. Ora connects your symptoms to your phase, your medication timing, your sleep — automatically.",
  },
  {
    number: "03",
    title: "Share what your doctor can't ignore",
    body: "Export a PDF report built on validated clinical scales. Not a mood diary — a clinical document your provider can act on.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-cream border-t border-sage/20">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-14 max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-eucalyptus-soft mb-3">
            How it works
          </p>
          <h2 className="font-display italic text-[32px] leading-[1.15] text-ink">
            Data you already have. Documentation you never did.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col">
              <span className="font-mono text-[80px] font-medium leading-none text-sage-light select-none">
                {step.number}
              </span>
              <h3 className="font-sans text-[17px] font-semibold text-ink mt-3 mb-2">
                {step.title}
              </h3>
              <p className="text-[14px] leading-[1.65] text-ink-2">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
