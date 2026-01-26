import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../src/@types/Database";

export const handler: Handler = async (event) => {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const body = JSON.parse(event.body || "{}");

    const { data: order, error } = await supabase
      .from("orders")
      .insert([body])
      .select()
      .single();

    if (error || !order) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error?.message || "Insert failed" }),
      };
    }

    try {
      await fetch(
        "https://www.ltkunstsmykker.no/.netlify/functions/createOrderConfirmation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        }
      );
    } catch (emailErr) {
      console.error("Failed to send order confirmation email:", emailErr);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(order),
    };
  } catch (err) {
    console.error("Unexpected function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
