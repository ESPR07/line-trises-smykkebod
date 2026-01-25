import { supabaseServerClient } from "./supabaseClientBackend";
import Stripe from "stripe";

export async function handleRefundCreated(stripeEvent: Stripe.Event) {
  let paymentIntentId: string | undefined;
  let refundId: string | undefined;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // Handle different refund event types
  switch (stripeEvent.type) {
    case "charge.refunded": {
      const charge = stripeEvent.data.object as Stripe.Charge;
      refundId = charge.refunds?.data?.[0]?.id; // Most recent refund
      paymentIntentId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;
      break;
    }

    case "refund.created":
    case "refund.updated": {
      const refund = stripeEvent.data.object as Stripe.Refund;
      refundId = refund.id;

      if (refund.charge) {
        const charge = await stripe.charges.retrieve(refund.charge as string, {
          expand: ["payment_intent"],
        });

        paymentIntentId =
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : charge.payment_intent?.id;
      }
      break;
    }

    default:
      console.log("Unhandled refund-related event:", stripeEvent.type);
      return;
  }

  if (!paymentIntentId) {
    console.warn("Could not determine PaymentIntent for refund:", refundId);
    return; // skip; CLI test events might miss it
  }

  // Fetch the order in Supabase
  const { data: order, error: fetchError } = await supabaseServerClient
    .from("orders")
    .select("id, status")
    .eq("stripe_payment_id", paymentIntentId)
    .single();

  if (fetchError || !order) {
    console.error("Order not found for refund:", paymentIntentId, fetchError);
    return; // skip; no retry needed
  }

  if (order.status === "refunded") {
    console.log("Order already refunded:", order.id);
    return; // idempotent
  }

  // Update order status to refunded
  const { error: updateError } = await supabaseServerClient
    .from("orders")
    .update({ status: "refunded" })
    .eq("id", order.id);

  if (updateError) {
    console.error("Failed to update order status after refund:", updateError);
    throw updateError; // Stripe will retry webhook
  }

  console.log(`Order ${order.id} status updated to refunded for refund ${refundId}`);
}
