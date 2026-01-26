import { useState } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";

export function useDeleteCustomOption() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function deleteCustomOption(id: number): Promise<boolean> {
    try {
      setIsLoading(true);
      setIsError(false);

      const { error } = await supabaseClient
        .from("custom_options")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Delete error:", error.message);
        setIsError(true);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Unexpected delete error:", err);
      setIsError(true);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { deleteCustomOption, isLoading, isError };
}
