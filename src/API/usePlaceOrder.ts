import { useState } from "react";
import { Database, NewOrderData } from "../@types/Database";

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

      const response = await fetch("/.netlify/functions/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsError(true);
        console.error("Order creation error:", json.error);
        return null;
      }

      setIsSuccess(true);
      return json as Database["public"]["Tables"]["orders"]["Row"];
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
