"use server";

export type WaitlistState = {
  success: boolean;
  error?: string;
} | null;

export async function joinWaitlist(
  prevState: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const email = (formData.get("email") as string)?.trim();

  if (!email) {
    return { success: false, error: "Email required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Valid email required." };
  }

  // TODO: wire to email service (Resend, ConvertKit, etc.)
  // await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID });

  return { success: true };
}
