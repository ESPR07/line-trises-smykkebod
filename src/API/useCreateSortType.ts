import { supabaseClient } from "../components/utils/supabaseClient";

interface Category {
  id: string;
  name: string;
}

export function useCreateSortType() {
  const createSortType = async (name: string): Promise<Category | null> => {
    const { data, error } = await supabaseClient
      .from("product_type")
      .insert({ name })
      .select("id, name")
      .single();

    if (error || !data) {
      console.error("Failed to create material:", error);
      return null;
    }

    return data;
  };

  return { createSortType };
}