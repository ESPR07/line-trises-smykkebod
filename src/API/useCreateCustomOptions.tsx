import { useState } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";
import { Database } from "../@types/Database";

type Insert =
  Database["public"]["Tables"]["custom_options"]["Insert"];
type Row =
  Database["public"]["Tables"]["custom_options"]["Row"];

export function useCreateCustomOption() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function createCustomOption(
    data: Insert
  ): Promise<Row | null> {
    try {
      setIsLoading(true);
      setIsError(false);

      const { data: created, error } = await supabaseClient
        .from("custom_options")
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error("Create error:", error.message);
        setIsError(true);
        return null;
      }

      return created;
    } catch (err) {
      console.error("Unexpected create error:", err);
      setIsError(true);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { createCustomOption, isLoading, isError };
}
