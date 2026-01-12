import { useState } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";
import { Database } from "../@types/Database";

type CustomOptionRow =
  Database["public"]["Tables"]["custom_options"]["Row"];

export function useCustomOptions() {
  const [options, setOptions] = useState<CustomOptionRow[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  async function fetchCustomOptions() {
    try {
      setIsLoading(true);
      setIsError(false);

      const { data, error } = await supabaseClient
        .from("custom_options")
        .select("*");

      if (error) {
        console.error("Error fetching custom options:", error.message);
        setIsError(true);
        return;
      }

      setOptions(data ?? []);
    } catch (err) {
      console.error("Unexpected error:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    options,
    isLoading,
    isError,
    fetchCustomOptions,
  };
}
