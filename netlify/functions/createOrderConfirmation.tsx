import * as React from "react";
import { Handler } from "@netlify/functions";
import { render } from "@react-email/render";
import { OrderConfirmationEmail } from "./emails/OrderConfirmationEmail";

void React;

interface OrderItem {
  name: string;
  quantity: number;
  lineTotal: number;
}

interface CustomerInfo {
  customer_firstName: string;
  customer_lastName: string;
  customer_adress: string;
  customer_postNr: string;
  customer_place: string;
  customer_email: string;
}

interface Order {
  order_id: string;
  customer_info: CustomerInfo;
  cart: OrderItem[];
  totals: { verifiedTotal: number, shippingCost: number };
}

const handler: Handler = async (event) => {
  try {
    if (!event.body) {
      return { statusCode: 400, body: "Missing request body" };
    }

    const order: Order = JSON.parse(event.body);

    const {
      order_id,
      customer_info,
      cart = [],
      totals = { verifiedTotal: 0, shippingCost: 0 },
    } = order;

    const email = customer_info?.customer_email;

    if (!email || !order_id) {
      return {
        statusCode: 400,
        body: "Missing required order data (email or order_id)",
      };
    }

    console.log("Sending order confirmation:", {
      order_id,
      email,
      itemCount: cart.length,
    });

    const html = await render(
      <OrderConfirmationEmail
        order_id={order_id}
        customer_info={customer_info}
        cart={cart}
        totals={totals}
      />,
    );

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LT Kunstsmykker <ordre@ltkunstsmykker.no>",
        to: email,
        subject: `Bekreftelse på ordre #${order_id}`,
        html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend API error:", errorText);
      return {
        statusCode: 502,
        body: `Resend error: ${errorText}`,
      };
    }

    return {
      statusCode: 200,
      body: "Order confirmation sent",
    };
  } catch (err: unknown) {
    console.error("Order confirmation failed:", err);
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    return {
      statusCode: 500,
      body: message || "Internal server error",
    };
  }
};

export { handler };
