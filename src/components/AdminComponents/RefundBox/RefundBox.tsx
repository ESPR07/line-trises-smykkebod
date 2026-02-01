import { useContext, useEffect, useState } from "react";
import style from "./RefundBox.module.css";
import { OrderItem } from "../../../@types/Database";
import { ordersResult } from "../../../context/siteContexts";

interface RefundBoxProps {
  order: OrderItem;
  refundBoxValue: boolean;
  toggleRefundBox: (val: boolean) => void;
}

function RefundBox({ order, refundBoxValue, toggleRefundBox }: RefundBoxProps) {
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundSuccess, setRefundSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchOrders } = useContext(ordersResult);

  const handleRefund = async () => {
    setIsRefunding(true);
    setError(null);

    try {
      const res = await fetch("/.netlify/functions/createRefundIntent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: order.stripe_payment_id,
          amount: order.totals.verifiedTotal * 100, // full refund (øre)
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Ukjent feil");
      }

      setRefundSuccess(true);

      // Auto-close after success
      setTimeout(() => {
        toggleRefundBox(false);
        setRefundSuccess(false);
        fetchOrders();
      }, 1500);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Noe gikk galt under refundering.");
      }
    } finally {
      setIsRefunding(false);
    }
  };

  // Prevent background scroll (same as DeleteBox)
  useEffect(() => {
    if (refundBoxValue) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [refundBoxValue]);

  return (
    <div className={style.refundBox}>
      {refundSuccess ? (
        <p>Bestillingen er refundert ✅</p>
      ) : (
        <>
          <p>
            Er du sikker på at du vil refundere denne bestillingen?
            <br />
            <strong>
              {order.totals.verifiedTotal.toLocaleString("nb-NO")} NOK
            </strong>{" "}
            vil bli refundert.
          </p>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
            className={style.refundButton}
            type="button"
            disabled={isRefunding}
            onClick={handleRefund}
          >
            {isRefunding ? "Refunderer..." : "Bekreft refusjon"}
          </button>
        </>
      )}
    </div>
  );
}

export default RefundBox;
