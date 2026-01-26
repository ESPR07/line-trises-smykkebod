import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";

function OrderProcessingPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const paymentIntentId = params.get("paymentIntentId") ?? "";

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentIntentId) {
      setStatus("error");
      setErrorMessage("Ingen betaling å behandle.");
      return;
    }

    let attempts = 0;
    const maxAttempts = 30; // e.g., poll for 1 min (30 * 2s)

    const checkOrder = async () => {
      try {
        attempts++;
        const { data: order, error } = await supabaseClient
          .from("orders")
          .select("*")
          .eq("stripe_payment_id", paymentIntentId)
          .eq("status", "paid")
          .maybeSingle();

        if (error) {
          console.error("Supabase error:", error);
        }

        if (order) {
          clearInterval(intervalId);
          setStatus("success");
          navigate(
            `/velykket?order=${order.order_id}&name=${order.customer_info.customer_firstName}`
          );
        } else if (attempts >= maxAttempts) {
          clearInterval(intervalId);
          setStatus("error");
          setErrorMessage(
            "Kunne ikke bekrefte bestillingen. Kontakt kundeservice."
          );
        }
      } catch (err) {
        console.error("Feil ved sjekk av ordre:", err);
      }
    };

    // Check immediately and then every 2s
    checkOrder();
    const intervalId: number = window.setInterval(checkOrder, 2000);

    return () => clearInterval(intervalId);
  }, [paymentIntentId, navigate]);

  return (
    <main style={{ textAlign: "center", padding: "2rem" }}>
      {status === "loading" && (
        <>
          <h1>Behandler bestillingen din...</h1>
          <p>Vent litt mens vi bekrefter betalingen.</p>
        </>
      )}
      {status === "error" && (
        <>
          <h1>Noe gikk galt</h1>
          <p>{errorMessage}</p>
        </>
      )}
    </main>
  );
}

export default OrderProcessingPage;
