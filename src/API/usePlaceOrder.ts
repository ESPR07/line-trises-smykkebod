import { useState } from "react";
import { supabaseServiceClient } from "../components/utils/supabaseServiceClient";
import { Database } from "../@types/Database";

export interface NewOrderData {
  customer: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    adress: string;
    sted: string;
    postNr: string;
  };
  cart: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  totals: {
    verifiedTotal: number;
    itemCount: number;
  };
  meta: {
    createdAt: string;
    clientPlatform: string;
  };
}

export function useCreateOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function createOrder(
    data: NewOrderData
  ): Promise<Database["public"]["Tables"]["orders"]["Row"] | null> {
    try {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);

      const { data: insertedData, error } = await supabaseServiceClient
        .from("orders")
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

  return { createOrder, isLoading, isError, isSuccess };
}
