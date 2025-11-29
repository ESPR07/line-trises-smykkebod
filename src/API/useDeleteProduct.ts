import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/Database";
import { useState } from "react";

const supabaseURL: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseAPIKey: string = import.meta.env.VITE_SUPABASE_KEY;
const supabaseClient = createClient<Database>(supabaseURL, supabaseAPIKey);

interface DeleteResult {
  tableDeleted: boolean;
  storageDeleted: boolean | null;
  error?: string;
}

export function useDeleteProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DeleteResult | null>(null);

  async function deleteProduct(id: number, imageUrl?: string) {
    setIsLoading(true);
    setResult(null);

    let tableDeleted = false;
    let storageDeleted: boolean | null = null;

    try {
      // Delete product row
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

      // Delete image from storage
      if (imageUrl) {
        storageDeleted = false;
        try {
          const url = new URL(imageUrl);
          // URL pathname: /storage/v1/object/public/<bucket>/<filePath>
          const parts = url.pathname.split("/storage/v1/object/public/");
          if (parts[1]) {
            const [bucket, ...fileParts] = parts[1].split("/");
            const filePath = fileParts.join("/").split("?")[0]; // remove query string

            const { error: storageError } = await supabaseClient.storage
              .from(bucket)
              .remove([filePath]);

            if (!storageError) {
              storageDeleted = true;
            } else {
              storageDeleted = false;
            }
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
