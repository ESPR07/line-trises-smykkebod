import { supabaseClient } from "../components/utils/supabaseClient";

export function useDeleteMaterials() {
  const deleteMaterial = async (id: string): Promise<boolean> => {
    const { error } = await supabaseClient
      .from("materials")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete material:", error);
      return false;
    }

    return true;
  };

  return { deleteMaterial };
}