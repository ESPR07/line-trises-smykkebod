import { useState, useRef } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";
import { Database } from "../@types/Database";

export interface NewProductData {
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

  const creatingRef = useRef(false);

  async function createProduct(
    data: NewProductData,
  ): Promise<Database["public"]["Tables"]["products"]["Row"] | null> {
    if (creatingRef.current) return null;
    creatingRef.current = true;

    try {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);

      const { data: insertedData, error } = await supabaseClient
        .from("products")
        .upsert([data], { onConflict: "name" })
        .select()
        .single();

      if (error) {
        setIsError(true);
        console.error("Insert error:", error.message);
        return null;
      } else {
        setIsSuccess(true);
        return insertedData;
      }
    } catch (err) {
      setIsError(true);
      console.error("Unexpected error:", err);
      return null;
    } finally {
      creatingRef.current = false;
      setIsLoading(false);
    }
  }

  return { createProduct, isLoading, isError, isSuccess };
}
