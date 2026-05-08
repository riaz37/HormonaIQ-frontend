import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const RC_WEBHOOK_SECRET = Deno.env.get("REVENUECAT_WEBHOOK_SECRET")!;

// RevenueCat event types that transition to Pro
const PRO_EVENTS = new Set(["INITIAL_PURCHASE", "RENEWAL"]);

// RevenueCat event types that revert to Free
const FREE_EVENTS = new Set(["EXPIRATION", "CANCELLATION", "BILLING_ISSUE"]);

/**
 * Verify the RevenueCat HMAC-SHA256 webhook signature.
 * RevenueCat sends the signature as a hex-encoded string in X-RevenueCat-Signature.
 *
 * @param signature - Hex string from the request header
 * @param body      - Raw request body (string)
 * @returns true if the signature is valid
 */
async function verifySignature(
  signature: string | null,
  body: string,
): Promise<boolean> {
  if (!signature || !RC_WEBHOOK_SECRET) return false;

  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(RC_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  // Convert hex signature to Uint8Array
  const hexPairs = signature.match(/.{1,2}/g);
  if (!hexPairs) return false;
  const sigBytes = new Uint8Array(hexPairs.map((b) => parseInt(b, 16)));

  return crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(body));
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Read body as text first so we can verify the signature before parsing JSON
  const body = await req.text();
  const signature = req.headers.get("X-RevenueCat-Signature");

  if (!(await verifySignature(signature, body))) {
    console.error("RevenueCat webhook: invalid signature");
    return new Response("Unauthorized", { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return new Response("Bad request: invalid JSON", { status: 400 });
  }

  // RevenueCat webhook payload shape:
  //   { app_user_id: string, event: { type: string, ... }, ... }
  const userId = event.app_user_id as string | undefined;
  const eventType = (event.event as Record<string, unknown> | undefined)
    ?.type as string | undefined;

  if (!userId || !eventType) {
    console.error("RevenueCat webhook: missing app_user_id or event.type", {
      userId,
      eventType,
    });
    return new Response("Bad request: missing required fields", { status: 400 });
  }

  let newTier: string;

  if (PRO_EVENTS.has(eventType)) {
    newTier = "pro";
  } else if (FREE_EVENTS.has(eventType)) {
    newTier = "free";
  } else {
    // Unknown event type (e.g. TRANSFER, PRODUCT_CHANGE, TEST) — no tier update needed
    console.log(`RevenueCat webhook: ignoring event type "${eventType}"`);
    return new Response("OK", { status: 200 });
  }

  const { error } = await supabase
    .from("users")
    .update({ tier: newTier, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    console.error(
      `RevenueCat webhook: failed to update tier for user ${userId}:`,
      error,
    );
    return new Response("Internal server error", { status: 500 });
  }

  console.log(
    `RevenueCat webhook: user ${userId} tier updated to "${newTier}" (event: ${eventType})`,
  );

  return new Response("OK", { status: 200 });
});
