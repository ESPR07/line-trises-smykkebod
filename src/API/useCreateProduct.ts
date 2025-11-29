import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { Database } from "../types/Database";

const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
const supabaseAPIKey = import.meta.env.VITE_SUPABASE_KEY;
const supabaseClient = createClient<Database>(supabaseURL, supabaseAPIKey);

interface NewProductData {
  name: string;
  price: number;
  discount: boolean;
  discount_amount: number;
  short_description?: string;
  long_description?: string;
  image_url?: string;
}

export function useCreateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function createProduct(data: NewProductData) {
    try {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);

      const { error } = await supabaseClient.from("products").insert([data]);

      if (error) setIsError(true);
      else setIsSuccess(true);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return { createProduct, isLoading, isError, isSuccess };
}
