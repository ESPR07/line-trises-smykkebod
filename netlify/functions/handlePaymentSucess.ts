import { supabaseServerClient } from "./supabaseClientBackend";
import { OrderItem } from "../../src/@types/Database";
import Stripe from "stripe";

export async function handlePaymentSuccess(stripeEvent: Stripe.Event) {
  const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
  const metadata = paymentIntent.metadata;

  const totalPaidOere = paymentIntent.amount_received ?? paymentIntent.amount;

  // Parse cart snapshot
  let cartItems: {
    id: string;
    quantity: number;
    price: number;
    discountPrice: number;
  }[] = [];
  if (metadata.cart_snapshot) {
    try {
      cartItems = JSON.parse(metadata.cart_snapshot);
    } catch (err) {
      console.error("Failed to parse cart snapshot:", err);
      throw new Error("Invalid cart snapshot");
    }
  }

  if (!cartItems.length) {
    console.error("Cart snapshot is empty");
    throw new Error("Cart empty");
  }

  // Idempotency: skip if order already exists
  const { data: existingOrder } = await supabaseServerClient
    .from("orders")
    .select("id")
    .eq("stripe_payment_id", paymentIntent.id)
    .maybeSingle();

  if (existingOrder) {
    console.log("Order already exists for PaymentIntent:", paymentIntent.id);
    return; // idempotent, nothing more to do
  }

  // Rebuild cart and calculate totals
  const verifiedCart: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    metadata?: {
      createdAt: string;
      clientPlatform: string;
    };
  }[] = [];

  for (const item of cartItems) {
    // Custom products first
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

      const unitPrice = custom.calculated_price;
      const lineTotal = unitPrice * item.quantity;

      verifiedCart.push({
        id: item.id,
        name: "Lag Din Egen",
        quantity: item.quantity,
        unitPrice,
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

    console.log("Product found:", product);

    const unitPrice =
      product.discount_amount && product.discount_amount > 0
        ? product.discount_amount
        : product.price;

    const lineTotal = unitPrice * item.quantity;

    verifiedCart.push({
      id: item.id,
      name: product.name,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
    });
  }

  if (!verifiedCart.length) {
    console.error(
      "No valid items to create order for PaymentIntent:",
      paymentIntent.id,
    );
    throw new Error("Cart empty after verification");
  }

  // Build order object
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
      verifiedTotal: totalPaidOere / 100,
      shippingCost: parseFloat(metadata.shipping_cost ?? "0"),
      itemCount: verifiedCart.reduce((sum, i) => sum + i.quantity, 0),
    },
    meta: {
      createdAt: new Date().toISOString(),
      clientPlatform: metadata.client_platform ?? "web",
    },
  };

  const { data: insertedOrder, error } = await supabaseServerClient
    .from("orders")
    .insert(orderInsert)
    .select()
    .single();

  if (error) {
    console.error("Failed to create order in webhook:", error);
    throw error;
  }

  console.log(
    "Order created successfully for PaymentIntent:",
    paymentIntent.id,
  );

  const orderPayload = {
    ...orderInsert,
    order_id: insertedOrder.order_id,
  };

  try {
    const emailRes = await fetch(
      "https://www.ltkunstsmykker.no/.netlify/functions/createOrderConfirmation",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      },
    );

    if (!emailRes.ok) {
      const text = await emailRes.text();
      console.error("Failed to send order confirmation email:", text);
    } else {
      console.log("Order confirmation email sent successfully");
    }
  } catch (err) {
    console.error("Unexpected error sending order confirmation email:", err);
  }
}
