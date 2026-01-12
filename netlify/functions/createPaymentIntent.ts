import Stripe from "stripe";
import type { Handler } from "@netlify/functions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

interface CreatePaymentIntentBody {
  amount: number;
}

export const handler: Handler = async (event, context) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Ingen body sendt med request" }),
      };
    }

    const { amount } = JSON.parse(event.body) as CreatePaymentIntentBody;

    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Ugyldig beløp" }),
      };
    }

    // Convert to øre if frontend sent kr
    const amountInOere = Math.round(amount); // if frontend multiplies by 100, keep as is

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInOere,
      currency: "nok",
      automatic_payment_methods: { enabled: true },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (err: any) {
    console.error("Error creating PaymentIntent:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
