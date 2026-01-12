import { useState, useCallback } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";
import { Database } from "../@types/Database";

type CustomProductRow = Database["public"]["Tables"]["custom_products"]["Row"];

export function useCustomProducts() {
  const [customProducts, setCustomProducts] = useState<CustomProductRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchCustomProducts = useCallback(
    async (cartIds: string[], filterExpired: boolean = true) => {
      if (!cartIds.length) return;

      const idsToFetch = cartIds.filter(
        (id) => !customProducts.some((p) => p.id === id)
      );

      if (!idsToFetch.length) return;

      setIsLoading(true);
      setIsError(false);

      try {
        const { data, error } = await supabaseClient
          .from("custom_products")
          .select("*")
          .in("id", idsToFetch);

        if (error) {
          console.error("Feil ved henting av tilpassede produkter:", error.message);
          setIsError(true);
          return;
        }

        let results: CustomProductRow[] = data ?? [];

        if (filterExpired) {
          const now = new Date();
          results = results.filter(
            (p) => !p.expires_at || new Date(p.expires_at) > now
          );
        }

        setCustomProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newProducts = results.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newProducts];
        });
      } catch (err) {
        console.error("Uventet feil ved henting av tilpassede produkter:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [customProducts]
  );

  return {
    customProducts,
    isLoading,
    isError,
    fetchCustomProducts,
  };
}
