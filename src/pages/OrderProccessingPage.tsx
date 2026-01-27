import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";
import style from "./OrderProccessingPage.module.css";

function OrderProcessingPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const paymentIntentId = params.get("paymentIntentId") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dots, setDots] = useState("");

  // Animated dots for loading state
  useEffect(() => {
    if (status !== "loading") return;
    
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    return () => clearInterval(dotsInterval);
  }, [status]);

  useEffect(() => {
    if (!paymentIntentId) {
      setStatus("error");
      setErrorMessage("Ingen betaling å behandle.");
      return;
    }

    let attempts = 0;
    const maxAttempts = 30; // Poll for 1 min (30 * 2s)

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
          // Small delay to show success state before navigation
          setTimeout(() => {
            navigate(
              `/velykket?order=${order.order_id}&name=${order.customer_info.customer_firstName}`
            );
          }, 800);
        } else if (attempts >= maxAttempts) {
          clearInterval(intervalId);
          setStatus("error");
          setErrorMessage(
            "Kunne ikke bekrefte bestillingen. Kontakt kundeservice hvis problemet vedvarer."
          );
        }
      } catch (err) {
        console.error("Feil ved sjekk av ordre:", err);
        if (attempts >= maxAttempts) {
          clearInterval(intervalId);
          setStatus("error");
          setErrorMessage("En uventet feil oppstod. Vennligst prøv igjen.");
        }
      }
    };

    // Check immediately and then every 2s
    checkOrder();
    const intervalId: number = window.setInterval(checkOrder, 2000);

    return () => clearInterval(intervalId);
  }, [paymentIntentId, navigate]);

  return (
    <main className={style.processingPage}>
      <div className={style.processingCard}>
        {status === "loading" && (
          <div className={style.loadingState}>
            <div className={style.spinner}></div>
            <h1>Behandler bestillingen din{dots}</h1>
            <p>Vent litt mens vi bekrefter betalingen din.</p>
            <p className={style.subtext}>Dette tar vanligvis bare noen sekunder</p>
          </div>
        )}

        {status === "success" && (
          <div className={style.successState}>
            <div className={style.successIcon}>
              <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                <circle cx="26" cy="26" r="25" fill="none" />
                <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h1>Betaling bekreftet!</h1>
            <p>Du blir sendt videre...</p>
          </div>
        )}

        {status === "error" && (
          <div className={style.errorState}>
            <div className={style.errorIcon}>
              <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                <circle cx="26" cy="26" r="25" fill="none" />
                <path fill="none" d="M16 16 36 36 M36 16 16 36" />
              </svg>
            </div>
            <h1>Noe gikk galt</h1>
            <p>{errorMessage}</p>
            <button 
              className={style.retryButton}
              onClick={() => navigate("/handlekurv")}
            >
              Tilbake til handlekurv
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default OrderProcessingPage;