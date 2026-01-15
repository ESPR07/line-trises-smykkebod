import Stripe from "stripe";
import type { Handler } from "@netlify/functions";
import { supabaseServerClient } from "./supabaseClientBackend";
import { OrderItem } from "../../src/@types/Database";

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
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return { statusCode: 400, body: "Webhook signature invalid" };
  }

  if (stripeEvent.type !== "payment_intent.succeeded") {
    return { statusCode: 200, body: "Event ignored" };
  }

  const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;

  const metadata = paymentIntent.metadata;

  // Parse cart snapshot
  let cartItems: { id: string; quantity: number, price: number, discountPrice: number }[] = [];
  if (metadata.cart_snapshot) {
    try {
      cartItems = JSON.parse(metadata.cart_snapshot);
    } catch (err) {
      console.error("Failed to parse cart snapshot:", err);
      return { statusCode: 400, body: "Invalid cart snapshot" };
    }
  }

  if (!cartItems.length) {
    console.error("Cart snapshot is empty");
    return { statusCode: 400, body: "Cart empty" };
  }

  // Idempotency: skip if order already exists
  const { data: existingOrder } = await supabaseServerClient
    .from("orders")
    .select("id")
    .eq("stripe_payment_id", paymentIntent.id)
    .maybeSingle();

  if (existingOrder) {
    console.error("Order already exists for PaymentIntent:", paymentIntent.id);
    return { statusCode: 200, body: "Already processed" };
  }

  // Rebuild cart and calculate totals
  const verifiedCart: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    metadata?: any;
  }[] = [];

  let verifiedTotal = 0;

  for (const item of cartItems) {
    // Check custom products first
    const { data: custom } = await supabaseServerClient
      .from("custom_products")
      .select("calculated_price, configuration, expires_at")
      .eq("id", item.id)
      .maybeSingle();

    if (custom) {
      if (new Date(custom.expires_at) < new Date()) {
        console.warn("Custom product expired, skipping:", item.id);
        continue;
      }

      const lineTotal = custom.calculated_price * item.quantity;
      verifiedTotal += lineTotal;

      verifiedCart.push({
        id: item.id,
        name: "Lag Din Egen",
        quantity: item.quantity,
        unitPrice: custom.calculated_price,
        lineTotal,
        metadata: custom.configuration,
      });
      continue;
    }

    // Standard product
    const { data: product } = await supabaseServerClient
      .from("products")
      .select("name, price, discount_amount")
      .eq("id", item.id)
      .single();

    if (!product) {
      console.warn("Product not found, skipping:", item.id);
      continue;
    }

    const unitPrice = product.discount_amount ?? product.price;
    const lineTotal = (item.discountPrice ?? item.price ?? 0) * item.quantity;
    verifiedTotal += lineTotal;

    verifiedCart.push({
      id: item.id,
      name: product.name,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
    });
  }

  if (!verifiedCart.length) {
    console.error("No valid items to create order for PaymentIntent:", paymentIntent.id);
    return { statusCode: 400, body: "Cart empty" };
  }

  console.log(`Verified total for PaymentIntent ${paymentIntent.id}:`, verifiedTotal);
  console.log("Verified cart:", verifiedCart);

  // Build order object exactly matching OrderItem type
  const orderInsert: Omit<OrderItem, "order_id"> = {
    stripe_payment_id: paymentIntent.id,
    customer_info: {
      customer_email: metadata.customer_email ?? "",
      customer_phone: metadata.customer_phone ?? "",
      customer_firstName: metadata.customer_firstName ?? "",
      customer_lastName: metadata.customer_lastName ?? "",
      customer_adress: metadata.customer_adress ?? "",
      customer_place: metadata.customer_place ?? "",
      customer_postNr: metadata.customer_postNr ?? "",
    },
    status: "paid",
    cart: verifiedCart.map((i) => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      lineTotal: i.lineTotal,
    })),
    totals: {
      verifiedTotal,
      itemCount: verifiedCart.reduce((sum, i) => sum + i.quantity, 0),
    },
    meta: {
      createdAt: new Date().toISOString(),
      clientPlatform: metadata.client_platform ?? "web",
    },
  };

  const { error } = await supabaseServerClient.from("orders").insert(orderInsert);

  if (error) {
    console.error("Failed to create order in webhook:", error);
    return { statusCode: 500, body: "Order creation failed" };
  }

  return { statusCode: 200, body: "Webhook processed successfully" };
};
