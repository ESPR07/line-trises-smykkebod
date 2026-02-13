import { useState } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";
import { Database } from "../@types/Database";

export function useUpdateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function updateProduct(
    id: string,
    data: Partial<Database["public"]["Tables"]["products"]["Update"]>
  ): Promise<Database["public"]["Tables"]["products"]["Row"] | null> {
    try {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);

      const { data: updatedData, error } = await supabaseClient
        .from("products")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Update error:", error.message);
        setIsError(true);
        return null;
      } else {
        setIsSuccess(true);
        return updatedData;
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setIsError(true);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { updateProduct, isLoading, isError, isSuccess };
}
