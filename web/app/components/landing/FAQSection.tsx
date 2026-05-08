"use client";

import { useState } from "react";

interface FAQ {
  q: string;
  a: string;
}

const faqs: FAQ[] = [
  {
    q: "Is HormonaIQ free?",
    a: "HormonaIQ is free to download. Premium features including Ora, clinical report exports, and advanced cycle analysis require a subscription. Pricing is shown in-app.",
  },
  {
    q: "Is my data private?",
    a: "Yes. All your health data lives on your device. We use on-device processing — nothing is sent to our servers. We don't sell or share your data with anyone, ever.",
  },
  {
    q: "What conditions does HormonaIQ track?",
    a: "PMDD (with DRSP), PCOS (Rotterdam criteria), perimenopause (Greene Climacteric Scale), endometriosis, and ADHD-hormone overlap. Most users track multiple conditions simultaneously.",
  },
  {
    q: "What is Ora?",
    a: "Ora is your AI health companion. You can tell her anything — symptoms, fears, questions your doctor didn't have time to answer. She connects patterns across your cycle and conditions. Everything you share with Ora stays on your device.",
  },
  {
    q: "Do I need to understand clinical scales to use HormonaIQ?",
    a: "No. You answer questions in plain language. HormonaIQ translates your answers into clinical documentation behind the scenes. The report your doctor receives is clinical — the experience for you isn't.",
  },
  {
    q: "Can I share my data with my doctor?",
    a: "Yes. You can export a PDF report at any time. You choose exactly what to include. The report is built on validated clinical scales and formatted for medical professionals.",
  },
  {
    q: "Is HormonaIQ available on iPhone and Android?",
    a: "Yes. HormonaIQ is available on the App Store and Google Play Store.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-cream-warm border-t border-sage/20">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-eucalyptus-soft mb-4">
          FAQ
        </p>
        <h2 className="font-display italic text-[32px] text-ink mb-10">
          Questions we actually hear.
        </h2>

        <div>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-sage/20">
              <button
                type="button"
                onClick={() => setOpen(open === index ? null : index)}
                className="w-full flex items-center justify-between py-5 text-left"
                aria-expanded={open === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <span className="text-[16px] font-semibold text-ink pr-8">
                  {faq.q}
                </span>
                <span
                  className="text-eucalyptus-soft text-[20px] select-none flex-shrink-0"
                  aria-hidden="true"
                >
                  {open === index ? "−" : "+"}
                </span>
              </button>
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                hidden={open !== index}
                className="pb-5"
              >
                <p className="text-[15px] leading-[1.7] text-ink-2">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
