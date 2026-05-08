export default function OraSection() {
  return (
    <section className="bg-cream-warm border-t border-sage/20">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-eucalyptus-soft mb-3">
              Meet Ora
            </p>
            <h2 className="font-display italic text-[32px] leading-[1.15] text-ink mb-5">
              She listens. She doesn&apos;t judge. She remembers what matters.
            </h2>
            <p className="text-[16px] leading-[1.65] text-ink-2 mb-4">
              Ora is HormonaIQ&apos;s AI companion. Tell her anything — your symptoms, your fears,
              what your doctor dismissed. She connects the dots across your cycle, your conditions,
              your patterns.
            </p>
            <p className="text-[16px] leading-[1.65] text-ink-2 mb-4">
              Everything you share with Ora stays on your device. She will never share, sell, or
              summarize your data to anyone. Not even us.
            </p>
            <blockquote className="font-display italic text-[20px] text-eucalyptus-soft mt-6 border-l-2 border-eucalyptus/30 pl-5">
              You&apos;ve been trying to explain this for years. Ora already understands.
            </blockquote>
            <a
              href="#privacy"
              className="text-[14px] font-medium text-eucalyptus hover:text-eucalyptus-deep transition-colors mt-6 inline-flex items-center gap-1"
            >
              Learn more about privacy →
            </a>
          </div>
          <div className="lg:flex lg:justify-end">
            <div
              className="aspect-square bg-mint-mist rounded-[28px] w-full max-w-[480px] mx-auto flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="text-[13px] text-ink-3 font-medium">
                Ora illustration — custom asset pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
