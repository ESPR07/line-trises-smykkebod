import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { Database } from "../types/Database";

const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
const supabaseAPIKey = import.meta.env.VITE_SUPABASE_KEY;
const supabaseClient = createClient<Database>(supabaseURL, supabaseAPIKey);

export function useUpdateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function updateProduct(id: number, data: any) {
    try {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);

      const { error } = await supabaseClient.from("products").update(data).eq("id", id);

      if (error) setIsError(true);
      else setIsSuccess(true);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return { updateProduct, isLoading, isError, isSuccess };
}
