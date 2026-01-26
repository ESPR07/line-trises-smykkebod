import React from "react";
import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { render } from "@react-email/render";
import { ShippingConfirmationEmail } from "./emails/ShippingConfirmationEmail";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANT: service role
);

export const handler: Handler = async (event) => {
  try {
    if (!event.body) {
      return { statusCode: 400, body: "Missing body" };
    }

    const { orderId } = JSON.parse(event.body);

    if (!orderId) {
      return { statusCode: 400, body: "Missing orderId" };
    }

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (fetchError || !order) {
      return { statusCode: 404, body: "Order not found" };
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("order_id", orderId);

    if (updateError) {
      throw updateError;
    }

    const html = await render(
      <ShippingConfirmationEmail
        order_id={order.order_id}
        customer_info={order.customer_info}
        cart={order.cart}
        totals={order.totals}
      />
    );

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LT Kunstsmykker <ordre@ltkunstsmykker.no>",
        to: order.customer_info.customer_email,
        subject: `Bestilling #${order.order_id} er sendt`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const text = await emailRes.text();
      throw new Error(text);
    }

    return {
      statusCode: 200,
      body: "Order completed and email sent",
    };
  } catch (err: unknown) {
    console.error("Complete order failed:", err);
    return {
      statusCode: 500,
      body: err instanceof Error ? err.message : "Internal error",
    };
  }
};
