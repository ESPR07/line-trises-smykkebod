import { supabaseClient } from "../components/utils/supabaseClient";

interface Category {
  id: string;
  name: string;
}

export function useCreateCategory() {
  const createCategory = async (name: string): Promise<Category | null> => {
    const { data, error } = await supabaseClient
      .from("categories")
      .insert({ name })
      .select("id, name")
      .single();

    if (error || !data) {
      console.error("Failed to create category:", error);
      return null;
    }

    return data;
  };

  return { createCategory };
}