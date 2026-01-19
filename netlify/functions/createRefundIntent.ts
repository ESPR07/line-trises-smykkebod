import Stripe from "stripe";
import type { Handler } from "@netlify/functions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CreateRefundBody {
  paymentIntentId: string;
}

export const handler: Handler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No body sent" }),
    };
  }

  let body: CreateRefundBody;

  try {
    body =
      typeof event.body === "string"
        ? JSON.parse(event.body)
        : (event.body as CreateRefundBody);

    if (!body.paymentIntentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing paymentIntentId" }),
      };
    }
  } catch (err) {
    console.error("Failed to parse refund request body:", err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: body.paymentIntentId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount,
      }),
    };
  } catch (err: any) {
    console.error("Stripe refund error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
