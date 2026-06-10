"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/**
 * Starts a Stripe Checkout session for the $79/mo office subscription.
 * Returns the URL for the client to redirect to.
 */
export async function createCheckoutSession(): Promise<{ url: string }> {
  const admin = await requireAdmin();

  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: admin.organizationId },
  });

  let customerId = org.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: admin.email,
      name: org.name,
      metadata: { organizationId: org.id },
    });
    customerId = customer.id;
    await prisma.organization.update({
      where: { id: org.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    metadata: { organizationId: org.id },
    subscription_data: {
      metadata: { organizationId: org.id },
    },
    success_url: `${APP_URL}/settings?billing=success`,
    cancel_url: `${APP_URL}/settings?billing=canceled`,
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  return { url: session.url };
}

/**
 * Opens the Stripe billing portal so admins can update cards,
 * view invoices, or cancel. Returns the URL to redirect to.
 */
export async function createBillingPortalSession(): Promise<{ url: string }> {
  const admin = await requireAdmin();

  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: admin.organizationId },
    select: { stripeCustomerId: true },
  });

  if (!org.stripeCustomerId) {
    throw new Error("No billing account yet — subscribe first");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: org.stripeCustomerId,
    return_url: `${APP_URL}/settings`,
  });

  return { url: session.url };
}
