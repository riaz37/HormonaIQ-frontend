"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { joinWaitlist, type WaitlistState } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-[52px] shrink-0 rounded-[9999px] bg-eucalyptus px-8 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-eucalyptus-deep disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus"
      aria-label="Join the waitlist"
    >
      {pending ? "Saving…" : "Count me in"}
    </button>
  );
}

export function WaitlistForm() {
  const [state, formAction] = useActionState<WaitlistState, FormData>(
    joinWaitlist,
    null
  );

  if (state?.success) {
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
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-start">
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
          className="h-[52px] w-full rounded-[9999px] border border-sage/40 bg-paper px-5 text-[15px] text-ink placeholder:text-ink-3 focus:border-eucalyptus focus:outline-none focus:ring-2 focus:ring-eucalyptus/20 transition-colors duration-150"
          aria-describedby={state?.error ? "waitlist-error" : "waitlist-note"}
        />
        {state?.error && (
          <p id="waitlist-error" className="pl-4 text-[13px] text-danger" role="alert">
            {state.error}
          </p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
