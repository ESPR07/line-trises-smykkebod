import { useEffect, useState } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";
import { Database } from "../@types/Database";

export function useGetOrders() {
  const [orderList, setOrderList] = useState<
    Database["public"]["Tables"]["orders"]["Row"][] | undefined
  >(undefined);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [ordersError, setOrdersError] = useState<boolean>(false);

  async function fetchOrders(sortBy?: string, ascending: boolean = true) {
    try {
      setOrdersLoading(true);
      setOrdersError(false);

      let query = supabaseClient.from("orders").select("*");

      if (sortBy) {
        query = query.order(sortBy, { ascending });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error.message);
        setOrdersError(true);
      } else if (data) {
        setOrderList(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setOrdersError(true);
    } finally {
      setOrdersLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orderList, ordersLoading, ordersError, fetchOrders };
}
