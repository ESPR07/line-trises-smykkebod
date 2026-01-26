import Stripe from "stripe";
import type { Handler } from "@netlify/functions";
import { handlePaymentSuccess } from "./handlePaymentSucess";
import { handleRefundCreated } from "./handleRefundCreated";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const handler: Handler = async (event) => {
  const sig = event.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!event.body) {
    console.error("Webhook called without body");
    return { statusCode: 400, body: "No body" };
  }

  let stripeEvent: Stripe.Event;

  try {
    // Use raw body string for verification
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig!,
      webhookSecret!
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Webhook signature verification failed:", err.message);
    } else {
      console.error("Webhook signature verification failed:", err);
    }
    return { statusCode: 400, body: "Webhook signature invalid" };
  }

  switch (stripeEvent.type as string) {
  case "payment_intent.succeeded":
    await handlePaymentSuccess(stripeEvent);
    break;
  case "charge.refunded":
    await handleRefundCreated(stripeEvent);
    break;
  default:
    console.log("Unhandled event type:", stripeEvent.type);
}


  return { statusCode: 200, body: "Webhook processed successfully" };
};
