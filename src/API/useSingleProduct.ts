import { useEffect, useState } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";
import { Database } from "../@types/Database";

export function useSingleProduct(id: string) {
  const [product, setProduct] = useState<Database["public"]["Tables"]["products"]["Row"] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        setIsError(false);

        const { data, error } = await supabaseClient
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching product:", error.message);
          setIsError(true);
        } else {
          setProduct(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  return { product, isLoading, isError };
}
