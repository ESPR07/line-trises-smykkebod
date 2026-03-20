import { supabaseClient } from "../components/utils/supabaseClient";

export function useDeleteSortType() {
  const deleteSortType = async (id: string): Promise<boolean> => {
    const { error } = await supabaseClient
      .from("product_type")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete sort type:", error);
      return false;
    }

    return true;
  };

  return { deleteSortType };
}