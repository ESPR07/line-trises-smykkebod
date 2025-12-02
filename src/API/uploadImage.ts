import { supabaseClient } from "../components/utils/supabaseClient";

export async function uploadImage(file: File, fileName?: string): Promise<string | null> {
  try {
    const filePath: string = fileName || `products/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabaseClient.storage
      .from("product.images")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      return null;
    }

    const { data } = supabaseClient.storage
      .from("product.images")
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      console.error("Failed to get public URL");
      return null;
    }

    return data.publicUrl + `?cacheBust=${Date.now()}`;
  } catch (err) {
    console.error("Unexpected upload error:", err);
    return null;
  }
}
