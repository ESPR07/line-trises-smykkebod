import { useState } from "react";
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

  async function createProduct(data: NewProductData): Promise<Database["public"]["Tables"]["products"]["Row"] | null> {
    try {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);

      const { data: insertedData, error } = await supabaseClient
        .from("products")
        .insert([data])
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
      setIsLoading(false);
    }
  }

  return { createProduct, isLoading, isError, isSuccess };
}
