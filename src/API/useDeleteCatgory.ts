import { supabaseClient } from "../components/utils/supabaseClient";

export function useDeleteCategory() {
  const deleteCategory = async (id: string): Promise<boolean> => {
    const { error } = await supabaseClient
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete category:", error);
      return false;
    }

    return true;
  };

  return { deleteCategory };
}