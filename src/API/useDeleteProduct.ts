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

  async function deleteProduct(
    id: string,
    imageUrls?: string | string[]
  ): Promise<void> {
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

      if (imageUrls) {
        const urlsArray = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
        storageDeleted = true;

        for (const url of urlsArray) {
          try {
            const parsed = new URL(url);
            const parts = parsed.pathname.split("/storage/v1/object/public/");
            if (parts[1]) {
              const [bucket, ...fileParts] = parts[1].split("/");
              const filePath = fileParts.join("/").split("?")[0];

              const { error: storageError } = await supabaseClient.storage
                .from(bucket)
                .remove([filePath]);

              if (storageError) {
                console.error("Failed to delete image:", storageError.message);
                storageDeleted = false;
              }
            }
          } catch (err) {
            console.error("Failed to parse/delete image:", err);
            storageDeleted = false;
          }
        }
      }

      setResult({ tableDeleted, storageDeleted });
    } catch (err) {
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
