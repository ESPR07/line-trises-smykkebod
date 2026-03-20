import { useState } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";

interface Category {
  id: string;
  name: string;
}

export function useTypeSort() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchTypeSort = async () => {
    setIsLoading(true);
    setIsError(false);

    const { data, error } = await supabaseClient
      .from("product_type")
      .select("id, name")
      .order("name", { ascending: true });

    if (error || !data) {
      setIsError(true);
    } else {
      setCategories(data);
    }

    setIsLoading(false);
  };

  return { categories, isLoading, isError, fetchTypeSort };
}