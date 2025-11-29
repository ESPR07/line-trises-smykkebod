import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/Database";
import { useState } from "react";

const supabaseURL: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseAPIKey: string = import.meta.env.VITE_SUPABASE_KEY;
const supabaseClient = createClient<Database>(supabaseURL, supabaseAPIKey);

export function useDeleteProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function deleteProduct(id: number) {
    try {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);

      const { error } = await supabaseClient
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        setIsError(true);
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return { deleteProduct, isLoading, isError, isSuccess };
}
