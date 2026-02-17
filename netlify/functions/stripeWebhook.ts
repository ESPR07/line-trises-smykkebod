import Stripe from "stripe";
import type { Handler } from "@netlify/functions";
import { handlePaymentSuccess } from "./handlePaymentSucess";
import { handleRefundCreated } from "./handleRefundCreated";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ⚠️ Disable automatic JSON parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export const handler: Handler = async (event) => {
  // Only POST requests allowed
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const sig = event.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !event.body) {
    console.error("Missing signature or body");
    return { statusCode: 400, body: "Missing signature or body" };
  }

  let stripeEvent: Stripe.Event;

  try {
    // Use raw bytes for verification
    const rawBody = Buffer.from(event.body, "utf8");
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret!);
  } catch (err: unknown) {
    console.error("Webhook signature verification failed:", err);
    return { statusCode: 400, body: "Webhook signature invalid" };
  }

  // Handle relevant events
  switch (stripeEvent.type) {
    case "payment_intent.succeeded":
      await handlePaymentSuccess(stripeEvent);
      break;

    case "charge.refunded":
      await handleRefundCreated(stripeEvent);
      break;

    case "payment_intent.payment_failed":
      console.log("Payment failed:", stripeEvent.data.object);
      break;

    default:
      console.log("Unhandled event type:", stripeEvent.type);
  }

  return { statusCode: 200, body: "Webhook processed successfully" };
};
