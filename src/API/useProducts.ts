import { useEffect, useState } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";
import { Database } from "../@types/Database";

export function useProductList() {
  const [productList, setProductList] = useState<
    Database["public"]["Tables"]["products"]["Row"][] | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  async function fetchProducts() {
    try {
      setIsLoading(true);
      setIsError(false);

      const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .eq('active_status', true);

      if (error) {
        console.error("Error fetching products:", error.message);
        setIsError(true);
      } else if (data) {
        setProductList(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return { productList, isLoading, isError, fetchProducts };
}
