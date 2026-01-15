import Stripe from "stripe";
import type { Handler } from "@netlify/functions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CreatePaymentIntentBody {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  adress: string;
  place: string;
  postNr: string;
  cart: { id: string; quantity: number }[];
  clientPlatform?: string;
}

export const handler: Handler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No body sent" }),
    };
  }

  let body: CreatePaymentIntentBody;

  try {
    body =
      typeof event.body === "string"
        ? JSON.parse(event.body)
        : (event.body as CreatePaymentIntentBody);

    if (!body.cart || !Array.isArray(body.cart) || body.cart.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Cart is empty" }),
      };
    }
  } catch (err) {
    console.error("Failed to parse request body:", err);
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: body.amount,
      currency: "nok",
      automatic_payment_methods: { enabled: true },
      metadata: {
        customer_email: body.email,
        customer_firstName: body.firstName,
        customer_lastName: body.lastName,
        customer_phone: body.phone,
        customer_adress: body.adress,
        customer_place: body.place,
        customer_postNr: body.postNr,
        client_platform: body.clientPlatform ?? "web",
        cart_snapshot: JSON.stringify(body.cart),
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (err: any) {
    console.error("Stripe error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
