import { createClient } from "@supabase/supabase-js";
import { Database, FetchResult } from "../types/Database";
import { useEffect, useState } from "react";

const supabaseURL: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseAPIKey: string = import.meta.env.VITE_SUPABASE_KEY;
const supabaseClient = createClient<Database>(supabaseURL, supabaseAPIKey);

export function getProductList() {
  const [productList, setProductList] = useState<FetchResult[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  async function fetchProducts() {
    try {
      setIsLoading(true);
      setIsError(false);

      const { data, error } = await supabaseClient
        .from("products")
        .select();

      if (error) {
        setIsError(true);
      } else {
        setProductList(data);
      }
    } catch (err) {
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
