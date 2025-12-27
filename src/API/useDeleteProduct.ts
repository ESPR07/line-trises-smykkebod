import { useState } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";

export interface DeleteResult {
  tableDeleted: boolean;
  storageDeleted: boolean | null;
  error?: string;
}

export function useDeleteProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DeleteResult | null>(null);

  async function deleteProduct(id: string, imageUrl?: string): Promise<void> {
    setIsLoading(true);
    setResult(null);

    let tableDeleted = false;
    let storageDeleted: boolean | null = null;

    try {
      const { error: tableError } = await supabaseClient
        .from("products")
        .delete()
        .eq("id", id);

      if (tableError) {
        setResult({
          tableDeleted: false,
          storageDeleted: null,
          error: "Produktet kunne ikke slettes.",
        });
        return;
      }

      tableDeleted = true;

      if (imageUrl) {
        storageDeleted = false;
        try {
          const url = new URL(imageUrl);
          const parts = url.pathname.split("/storage/v1/object/public/");
          if (parts[1]) {
            const [bucket, ...fileParts] = parts[1].split("/");
            const filePath = fileParts.join("/").split("?")[0];

            const { error: storageError } = await supabaseClient.storage
              .from(bucket)
              .remove([filePath]);

            storageDeleted = !storageError;
          } else {
            storageDeleted = null;
          }
        } catch {
          storageDeleted = false;
        }
      }

      setResult({ tableDeleted, storageDeleted });
    } catch {
      setResult({
        tableDeleted,
        storageDeleted,
        error: "Uventet feil under sletting.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return { deleteProduct, result, isLoading };
}
