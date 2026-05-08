import CycleRing from "@/app/components/landing/CycleRing";
import DecorativeLeaf from "@/app/components/landing/DecorativeLeaf";

// TODO: fill real URL before deploy
const APP_STORE_URL = "#";
// TODO: fill real URL before deploy
const PLAY_STORE_URL = "#";

export default function Hero() {
  return (
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
                <span
                  className="h-1.5 w-1.5 rounded-full bg-eucalyptus"
                  aria-hidden="true"
                />
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
              The average woman with PMDD waits 12 years and sees 6 providers
              before diagnosis. Most are told it&rsquo;s anxiety, stress, or to
              lose weight. HormonaIQ turns what you already feel into the
              clinical chart your doctor can&rsquo;t dismiss.
            </p>

            {/* Download CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download HormonaIQ on the App Store"
                className="inline-flex h-[52px] items-center rounded-[9999px] bg-eucalyptus px-7 text-[15px] font-semibold text-white transition-colors hover:bg-eucalyptus-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus"
              >
                Download on App Store →
              </a>
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get HormonaIQ on Google Play"
                className="inline-flex h-[52px] items-center rounded-[9999px] border border-sage/50 px-7 text-[15px] font-medium text-ink-2 transition-colors hover:border-eucalyptus/50 hover:text-eucalyptus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus"
              >
                Get it on Google Play
              </a>
            </div>

            {/* Ora intro line */}
            <p className="mt-2 text-[13px] text-ink-2">
              Meet Ora, your AI health companion — private, warm, always
              listening.
            </p>

            {/* Live badge */}
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 animate-pulse rounded-full bg-eucalyptus"
                aria-hidden="true"
              />
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
  );
}
