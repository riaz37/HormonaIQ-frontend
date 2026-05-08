export default function Footer() {
  return (
    <footer className="bg-cream border-t border-sage/20">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1 — Brand */}
          <div>
            <p className="font-sans text-[17px] font-semibold text-ink">HormonaIQ</p>
            <p className="text-[13px] text-ink-3 mt-2 leading-[1.6] max-w-[180px]">
              Clinical-grade hormonal health tracking for women who already knew.
            </p>
            <p className="text-[13px] text-ink-3 mt-4 leading-[1.6]">
              Built by a team that believes your health data belongs to you. HIPAA-adjacent
              practices, on-device by default.
            </p>
          </div>

          {/* Col 2 — Product */}
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-3 mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#how-it-works"
                  className="text-[14px] text-ink-2 hover:text-ink transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#conditions"
                  className="text-[14px] text-ink-2 hover:text-ink transition-colors"
                >
                  Conditions
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-[14px] text-ink-2 hover:text-ink transition-colors"
                >
                  Privacy Promise
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-[14px] text-ink-2 hover:text-ink transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-3 mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/privacy"
                  className="text-[14px] text-ink-2 hover:text-ink transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-[14px] text-ink-2 hover:text-ink transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                {/* TODO: confirm email address */}
                <a
                  href="mailto:contact@hormona-iq.com"
                  className="text-[14px] text-ink-2 hover:text-ink transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 — Download */}
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-3 mb-4">
              Download
            </h3>
            <ul className="space-y-3">
              <li>
                {/* TODO: fill real App Store URL before deploy */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download on the App Store"
                  className="text-[14px] text-ink-2 hover:text-ink transition-colors"
                >
                  App Store →
                </a>
              </li>
              <li>
                {/* TODO: fill real Google Play URL before deploy */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download on Google Play"
                  className="text-[14px] text-ink-2 hover:text-ink transition-colors"
                >
                  Google Play →
                </a>
              </li>
            </ul>
            <p className="text-[12px] text-ink-3 mt-4">Available on iOS &amp; Android</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-sage/20 flex flex-col sm:flex-row sm:justify-between gap-4">
          <p className="text-[12px] text-ink-3">
            © 2026 HormonaIQ. All rights reserved.
          </p>
          <p className="text-[12px] text-ink-3 max-w-sm sm:text-right">
            HormonaIQ is not a substitute for medical advice, diagnosis, or treatment. Always
            consult a qualified healthcare provider.
          </p>
        </div>
      </div>
    </footer>
  );
}
