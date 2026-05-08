export default function PrivacySection() {
  return (
    <section
      id="privacy"
      className="bg-mint-mist border-t border-sage/20"
    >
      <div className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-eucalyptus-soft mb-4">
          Privacy
        </p>
        <h2 className="font-display italic text-[32px] leading-[1.15] text-ink mb-8">
          Your health data is yours. Full stop.
        </h2>

        <p className="text-[16px] leading-[1.7] text-ink-2 mb-5">
          Everything you log in HormonaIQ lives on your device. We use on-device
          processing — your symptoms, your cycle data, your Ora conversations
          never touch our servers.
        </p>
        <p className="text-[16px] leading-[1.7] text-ink-2 mb-5">
          We don&apos;t sell data. We don&apos;t share data with insurers,
          advertisers, employers, or anyone else. We don&apos;t want your data —
          we want you to have it.
        </p>
        <p className="text-[16px] leading-[1.7] text-ink-2 mb-5">
          When you export a report, you choose exactly what to share and with
          whom. Nothing leaves without your explicit action.
        </p>

        <div className="mt-10 border-t border-sage/20 pt-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-eucalyptus-soft mb-6">
            What we will never do
          </p>
          <div className="flex flex-col gap-4 text-[18px] leading-[1.55] text-ink">
            <p>
              We will never tell you you&apos;re feeling{" "}
              <strong>LUMINOUS</strong> when you feel like death.
            </p>
            <p>We will never sell your data to anyone.</p>
            <p>We will never pretend this is easy.</p>
            <p className="text-eucalyptus-soft">
              We will show up honestly. Every day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
