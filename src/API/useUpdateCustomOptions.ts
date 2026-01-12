import { useState } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";
import { Database } from "../@types/Database";

export interface CustomOptionUpdateData {
  type?: string;
  type_options?: Database["public"]["Tables"]["custom_options"]["Row"]["type_options"];
}

export function useUpdateCustomOptions() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function updateCustomOptions(
    id: number,
    data: Partial<CustomOptionUpdateData>
  ): Promise<Database["public"]["Tables"]["custom_options"]["Row"] | null> {
    try {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);

      const { data: updatedData, error } = await supabaseClient
        .from("custom_options")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Feil ved oppdatering av tilpassede alternativer:", error.message);
        setIsError(true);
        return null;
      } else {
        setIsSuccess(true);
        return updatedData;
      }
    } catch (err) {
      console.error("Uventet feil ved oppdatering av tilpassede alternativer:", err);
      setIsError(true);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { updateCustomOptions, isLoading, isError, isSuccess };
}
