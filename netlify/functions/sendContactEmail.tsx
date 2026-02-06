import * as React from "react";
import { Handler } from "@netlify/functions";
import { render } from "@react-email/render";
import { ContactMessageEmail } from "./emails/ContactFormEmail";

void React;

type ContactPayload = {
  mail: string;
  orderNumber?: string;
  inquiry: string;
  company?: string;
};

const RATE_LIMIT = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute

export const handler: Handler = async (event) => {
  try {
    if (!event.body) {
      return { statusCode: 400, body: "Mangler body" };
    }

    const { mail, orderNumber, inquiry, company } = JSON.parse(
      event.body,
    ) as ContactPayload;

    if (company) {
      return {
        statusCode: 200,
        body: "OK",
      };
    }

    const ip =
      event.headers["x-forwarded-for"] ||
      event.headers["client-ip"] ||
      "unknown";

    const now = Date.now();
    const lastRequest = RATE_LIMIT.get(ip) || 0;

    if (now - lastRequest < RATE_LIMIT_WINDOW) {
      return {
        statusCode: 429,
        body: "For mange forespørsler. Vennligst prøv igjen senere.",
      };
    }

    RATE_LIMIT.set(ip, now);

    if (!mail || !inquiry) {
      return { statusCode: 400, body: "Mangler påkrevde felt" };
    }

    const html = await render(
      <ContactMessageEmail
        fromEmail={mail}
        orderNumber={orderNumber}
        message={inquiry}
      />,
    );

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Kontaktskjema <kontakt@ltkunstsmykker.no>",
        to: "trine-lise@ltkunstsmykker.no",
        reply_to: mail,
        subject: `Ny Kundehendvendelse ${orderNumber ? `fra - Ordre #${orderNumber}` : ""}`,
        html,
      }),
    });

    if (!emailRes.ok) {
      throw new Error(await emailRes.text());
    }

    return {
      statusCode: 200,
      body: "Email sent",
    };
  } catch (err) {
    console.error("Contact email failed:", err);
    return {
      statusCode: 500,
      body: "Intern feil på serveren",
    };
  }
};
