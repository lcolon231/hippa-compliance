import Stripe from "stripe";

const globalForStripe = globalThis as unknown as { stripe?: Stripe };

function getStripe(): Stripe {
  if (!globalForStripe.stripe) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    globalForStripe.stripe = new Stripe(apiKey, { typescript: true });
  }
  return globalForStripe.stripe;
}

/**
 * Lazily-initialized Stripe client. The underlying client is constructed on
 * first property access rather than at import time, so `next build` can collect
 * page data without STRIPE_SECRET_KEY being present in the build environment.
 */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    const client = getStripe();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

/** Maps a Stripe subscription status to our enum. */
export function mapSubscriptionStatus(
  status: Stripe.Subscription.Status
): "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" {
  switch (status) {
    case "trialing":
      return "TRIALING";
    case "active":
      return "ACTIVE";
    case "past_due":
    case "unpaid":
      return "PAST_DUE";
    default:
      // canceled, incomplete, incomplete_expired, paused
      return "CANCELED";
  }
}
