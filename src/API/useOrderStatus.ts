import { useEffect, useState } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";

export function useOrderStatus(paymentIntentId: string) {
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paymentIntentId) return;

    const checkOrder = async () => {
      const { data } = await supabaseClient
        .from("orders")
        .select("*")
        .eq("stripe_payment_id", paymentIntentId)
        .single();

      if (data) {
        setOrder(data);
        setLoading(false);
        clearInterval(intervalId);
      }
    };

    const intervalId: number = window.setInterval(checkOrder, 2000);
    checkOrder();

    return () => clearInterval(intervalId);
  }, [paymentIntentId]);

  return { order, loading };
}
