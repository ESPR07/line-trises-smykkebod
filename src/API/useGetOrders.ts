import { useState, useEffect } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";
import { Database } from "../@types/Database";

export function useGetOrders() {
  const [orderList, setOrderList] = useState<Database["public"]["Tables"]["orders"]["Row"][] | undefined>(undefined);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [ordersError, setOrdersError] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const itemsPerPage = 10;

  async function fetchOrders(page: number = 1, sortBy?: string, ascending: boolean = true, searchQuery?: string) {
    try {
      setOrdersLoading(true);
      setOrdersError(false);

      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabaseClient
        .from("orders")
        .select("*", { count: "exact" })
        .range(from, to);

      if (sortBy) {
        query = query.order(sortBy, { ascending });
      }

      if (searchQuery && searchQuery.trim()) {
        // Search by customer name, email, or order_id
        query = query.or(`customer_firstName.ilike.%${searchQuery}%,customer_lastName.ilike.%${searchQuery}%,order_id.ilike.%${searchQuery}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching orders:", error.message);
        setOrdersError(true);
      } else if (data) {
        setOrderList(data);
        if (count !== null) setTotalOrders(count);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setOrdersError(true);
    } finally {
      setOrdersLoading(false);
    }
  }

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orderList,
    ordersLoading,
    ordersError,
    fetchOrders,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
  };
}
