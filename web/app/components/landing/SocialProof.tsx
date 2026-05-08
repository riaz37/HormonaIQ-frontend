// PLACEHOLDER CONTENT — All testimonials, ratings, and counts in this component
// are placeholders and MUST be replaced with real, verifiable App Store / user
// content before this section is shipped publicly. Do not deploy as-is.

interface PlaceholderTestimonial {
  quote: string;
  attribution: string;
}

const placeholderTestimonials: PlaceholderTestimonial[] = [
  {
    quote:
      "After 8 years of being told it was stress, two cycles of DRSP data gave my psychiatrist everything she needed.",
    attribution: "— App Store review",
  },
  {
    quote:
      "I've tried every cycle app. None of them spoke to me like a human until this one.",
    attribution: "— App Store review",
  },
  {
    quote:
      "Ora remembered things about my cycle I'd forgotten to mention. That's when I knew this was different.",
    attribution: "— App Store review",
  },
];

export default function SocialProof() {
  return (
    <section className="bg-cream border-t border-sage/20">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-eucalyptus-soft mb-4">
          Trusted by women who&apos;ve been dismissed
        </p>
        <h2 className="font-display italic text-[28px] text-ink">
          Finally, an app that takes me seriously.
        </h2>

        {/* PLACEHOLDER — fill with real App Store rating before deploy */}
        <div
          aria-hidden="true"
          className="flex items-center gap-2 mb-12 mt-6"
        >
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="text-butter-deep text-[18px]">
                ★
              </span>
            ))}
          </div>
          <span className="text-[14px] font-semibold text-ink">4.9</span>
          <span className="text-[14px] text-ink-3">
            · 200+ ratings on the App Store
          </span>
        </div>

        {/* PLACEHOLDER QUOTES — replace with real user testimonials before deploy */}
        <div className="grid md:grid-cols-3 gap-5">
          {placeholderTestimonials.map((testimonial, index) => (
            // PLACEHOLDER: replace before launch
            <article
              key={index}
              aria-hidden="true"
              className="rounded-[18px] bg-paper ring-1 ring-sage/20 p-7 flex flex-col gap-4"
            >
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-butter-deep text-[14px]">
                    ★
                  </span>
                ))}
              </div>
              <p className="font-display italic text-[16px] leading-[1.6] text-ink">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="text-[12px] text-ink-3 mt-auto">
                {testimonial.attribution}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
