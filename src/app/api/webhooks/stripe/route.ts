import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, mapSubscriptionStatus } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const organizationId = session.metadata?.organizationId;
        if (organizationId && session.subscription) {
          await prisma.organization.update({
            where: { id: organizationId },
            data: {
              stripeSubscriptionId: session.subscription as string,
              subscriptionStatus: "ACTIVE",
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        // Period end now lives on the subscription item (Stripe API 2025+).
        const periodEnd = subscription.items.data[0]?.current_period_end;
        await prisma.organization.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: mapSubscriptionStatus(subscription.status),
            ...(periodEnd && {
              currentPeriodEnd: new Date(periodEnd * 1000),
            }),
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        await prisma.organization.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionStatus: "CANCELED",
            stripeSubscriptionId: null,
          },
        });
        break;
      }

      default:
        // Unhandled event types are acknowledged without action.
        break;
    }
  } catch (err) {
    console.error(`Stripe webhook handler failed for ${event.type}`, err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
