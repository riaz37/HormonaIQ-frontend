import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — HormonaIQ",
  description: "HormonaIQ Terms of Service",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display italic text-[40px] text-ink mb-6">Terms of Service</h1>
      <p className="text-[16px] leading-[1.7] text-ink-2">
        {/* TODO: Legal copy pending legal review before this page goes live. */}
        Full terms of service coming soon. For questions, contact{" "}
        <a href="mailto:contact@hormona-iq.com" className="text-eucalyptus hover:underline">
          contact@hormona-iq.com
        </a>
        .
      </p>
    </main>
  );
}
