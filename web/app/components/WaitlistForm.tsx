"use client";

import { useState } from "react";

type Status = "idle" | "pending" | "success" | "error";

export function WaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("pending");
    setError("");

    const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json() as { errors?: { message: string }[] };
        setError(data?.errors?.[0]?.message ?? "That didn't work — try again?");
        setStatus("error");
      }
    } catch {
      setError("That didn't work — try again?");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[18px] border border-eucalyptus/20 bg-paper/60 px-6 py-5">
        <p className="text-[17px] font-medium leading-snug text-ink">
          Logged. We&rsquo;ll reach out when your module opens.
        </p>
        <p className="mt-1 text-[13px] text-ink-3">
          One email. No spam. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-start"
    >
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor="waitlist-email" className="sr-only">
          Email address
        </label>
        <input
          id="waitlist-email"
          type="email"
          name="email"
          placeholder="you@email.com"
          required
          autoComplete="email"
          disabled={status === "pending"}
          className="h-[52px] w-full rounded-[9999px] border border-sage/40 bg-paper px-5 text-[15px] text-ink placeholder:text-ink-3 focus:border-eucalyptus focus:outline-none focus:ring-2 focus:ring-eucalyptus/20 transition-colors duration-150 disabled:opacity-60"
          aria-describedby={error ? "waitlist-error" : "waitlist-note"}
        />
        {error && (
          <p id="waitlist-error" className="pl-4 text-[13px] text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === "pending"}
        className="h-[52px] shrink-0 rounded-[9999px] bg-eucalyptus px-8 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-eucalyptus-deep disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus"
        aria-label="Join the waitlist"
      >
        {status === "pending" ? "Saving…" : "Count me in"}
      </button>
    </form>
  );
}
