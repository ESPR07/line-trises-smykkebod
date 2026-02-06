import { useState, useEffect, useContext, ChangeEvent, useRef } from "react";
import style from "./UpdateBox.module.css";
import { useUpdateProduct } from "../../../API/useUpdateProduct";
import { uploadImage } from "../../../API/uploadImage";
import { FetchResult } from "../../../@types/Database";
import { supabaseClient } from "../../../components/utils/supabaseClient";
import imageCompression from "browser-image-compression";
import { APIResult } from "../../../context/siteContexts";

// Hash utility for files
async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Upload file using hash as filename
async function uploadImageWithHash(file: File): Promise<string | null> {
  const fileHash = await hashFile(file);
  const extension = file.name.split(".").pop();
  const fileName = `products/${fileHash}.${extension}`;
  return uploadImage(file, fileName);
}

// Parse Supabase public URL into bucket & path
function parseSupabaseFilePath(imageUrl: string) {
  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split("/storage/v1/object/public/");
    if (!parts[1]) return null;
    const [bucket, ...fileParts] = parts[1].split("/");
    const filePath = fileParts.join("/").split("?")[0];
    return { bucket, filePath };
  } catch {
    return null;
  }
}

interface UpdateBoxProps {
  product: FetchResult;
  updateBoxValue: boolean;
  toggleUpdateBox: (val: boolean) => void;
}

export default function UpdateBox({
  product,
  updateBoxValue,
  toggleUpdateBox,
}: UpdateBoxProps) {
  const { fetchProducts } = useContext(APIResult);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [name, setName] = useState<string>(product.name);
  const [longDescription, setLongDescription] = useState<string>(
    product.long_description || "",
  );
  const [price, setPrice] = useState<string>(product.price.toString());
  const [discountAmount, setDiscountAmount] = useState<string>(
    (product.discount_amount || 0).toFixed(2),
  );
  const [activeStatus, setActiveStatus] = useState<boolean>(
    product.active_status ?? true,
  );

  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    product.image_url || "",
  );
  const [previewError, setPreviewError] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const { updateProduct, isLoading, isSuccess, isError } = useUpdateProduct();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: "image/webp",
        initialQuality: 0.8,
      };

      const compressedFile = await imageCompression(file, options);
      setImageFile(compressedFile);

      const previewURL = URL.createObjectURL(compressedFile);
      setImagePreview(previewURL);
      setPreviewError(false);
    } catch (err) {
      console.error("Image processing failed:", err);
      setPreviewError(true);
    } finally {
      setUploading(false);
    }
  };

  const handleNumericInput = (value: string, setter: (val: string) => void) => {
    if (value === "") {
      setter("");
      return;
    }
    let sanitized = value.replace(/[^0-9.]/g, "");
    const parts = sanitized.split(".");
    if (parts.length > 2) sanitized = parts[0] + "." + parts[1];
    if (parts[1]?.length > 2) sanitized = parts[0] + "." + parts[1].slice(0, 2);
    sanitized = sanitized.replace(/^0+(\d)/, "$1");
    setter(sanitized);
  };

  const handleUpdate = async () => {
    const numericPrice = Number(price) || 0;
    const numericDiscount = Number(discountAmount) || 0;
    const hasDiscount = numericDiscount > 0;

    setUploading(true);

    try {
      let uploadedUrl = imagePreview; // keep existing URL if no new file

      // Upload new image if selected
      if (imageFile) {
        const url = await uploadImageWithHash(imageFile);
        if (url) uploadedUrl = url;
      }

      const oldUrl = product.image_url;

      // Update product
      await updateProduct(product.id, {
        name,
        long_description: longDescription,
        price: numericPrice,
        discount: hasDiscount,
        discount_amount: numericDiscount,
        image_url: uploadedUrl,
        active_status: activeStatus,
      });

      // Delete old image if replaced
      if (oldUrl && oldUrl !== uploadedUrl) {
        const parsed = parseSupabaseFilePath(oldUrl);
        if (parsed) {
          const { bucket, filePath } = parsed;
          const { error } = await supabaseClient.storage
            .from(bucket)
            .remove([filePath]);
          if (error)
            console.error("Failed to delete old image:", error.message);
        }
      }
    } catch (err) {
      console.error("Update failed:", err);
      setPreviewError(true);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      fetchProducts();
      timeoutRef.current = setTimeout(() => toggleUpdateBox(false), 1200);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (updateBoxValue) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [updateBoxValue]);

  return (
    <div className={style.updateModal}>
      <div className={style.updateBox}>
        <button
          className={style.closeButton}
          type="button"
          onClick={() => toggleUpdateBox(!updateBoxValue)}
        />

        <h3>Endre {product.name}</h3>

        <label>
          Navn:
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          Beskrivelse:
          <textarea
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
          />
        </label>

        <label>
          Pris:
          <input
            type="text"
            value={price}
            onChange={(e) => handleNumericInput(e.target.value, setPrice)}
          />
        </label>

        <label>
          Rabattbeløp:
          <input
            type="text"
            value={discountAmount}
            onChange={(e) =>
              handleNumericInput(e.target.value, setDiscountAmount)
            }
          />
        </label>

        <label>
          Aktiv:
          <input
            type="checkbox"
            checked={activeStatus}
            onChange={(e) => setActiveStatus(e.target.checked)}
          />
        </label>

        <label>
          Last opp bilde:
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        {uploading && <p>Laster opp bilde...</p>}

        {imagePreview && !previewError && (
          <img
            className={style.previewImage}
            src={imagePreview}
            alt="Preview"
            onError={() => setPreviewError(true)}
          />
        )}

        {previewError && (
          <p className={style.previewError}>Kunne ikke laste bildet</p>
        )}

        {isError && <p className={style.error}>Noe gikk galt, prøv igjen.</p>}

        {isSuccess && <p className={style.success}>Produktet ble oppdatert!</p>}

        <button
          className={style.updateButton}
          type="button"
          disabled={isLoading || uploading}
          onClick={handleUpdate}
        >
          {isLoading || uploading ? "Laster..." : "Lagre"}
        </button>
      </div>
    </div>
  );
}
