import { useState, useEffect, useContext, ChangeEvent } from "react";
import style from "./UpdateBox.module.css";
import { useUpdateProduct } from "../../../API/useUpdateProduct";
import { APIResult } from "../../../App";
import { uploadImage } from "../../../API/uploadImage";
import { FetchResult } from "../../../types/Database";

// Hash utility for files
async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Deduplicated upload using hash
async function uploadImageWithHash(file: File): Promise<string | null> {
  const fileHash = await hashFile(file);
  const extension = file.name.split(".").pop();
  const fileName = `products/${fileHash}.${extension}`;

  // uploadImage now accepts filename
  return uploadImage(file, fileName);
}

interface UpdateBoxProps {
  product: FetchResult;
  updateBoxValue: boolean;
  toggleUpdateBox: (val: boolean) => void;
}

function UpdateBox({ product, updateBoxValue, toggleUpdateBox }: UpdateBoxProps) {
  const { fetchProducts } = useContext(APIResult);

  const [name, setName] = useState<string>(product.name);
  const [price, setPrice] = useState<string>(product.price.toString());
  const [discountAmount, setDiscountAmount] = useState<string>(
    (product.discount_amount || 0).toFixed(2)
  );
  const [imageUrl, setImageUrl] = useState<string>(product.image_url || "");
  const [previewError, setPreviewError] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const { updateProduct, isLoading, isSuccess, isError } = useUpdateProduct();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const uploadedUrl = await uploadImageWithHash(file);
    if (uploadedUrl) {
      setImageUrl(`${uploadedUrl}?cacheBust=${Date.now()}`);
      setPreviewError(false);
    }

    setUploading(false);
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

  const handleUpdate = async (): Promise<void> => {
    const numericPrice = Number(price) || 0;
    const numericDiscount = Number(discountAmount) || 0;
    const hasDiscount = numericDiscount > 0;

    await updateProduct(product.id, {
      name,
      price: numericPrice,
      discount: hasDiscount,
      discount_amount: numericDiscount,
      image_url: imageUrl,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      fetchProducts();
      setTimeout(() => toggleUpdateBox(false), 1200);
    }
  }, [isSuccess, fetchProducts, toggleUpdateBox]);

  return (
    <div className={style.updateModal}>
      <div className={style.updateBox}>
        <button
          className={style.closeButton}
          type="button"
          onClick={() => toggleUpdateBox(!updateBoxValue)}
        >
          X
        </button>

        <h3>Endre {product.name}</h3>

        <label>
          Navn:
          <input value={name} onChange={(e) => setName(e.target.value)} />
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
            onChange={(e) => handleNumericInput(e.target.value, setDiscountAmount)}
          />
        </label>

        <label>
          Last opp bilde:
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        {uploading && <p>Laster opp bilde...</p>}

        {imageUrl && !previewError && (
          <img
          className={style.previewImage}
            src={imageUrl}
            alt="Preview"
            onError={() => setPreviewError(true)}
          />
        )}
        {previewError && <p className={style.previewError}>Kunne ikke laste bildet</p>}

        {isError && <p className={style.error}>Noe gikk galt, prøv igjen.</p>}

        {isSuccess && <p className={style.success}>Produktet ble oppdatert!</p>}

        <button
          className={style.updateButton}
          type="button"
          disabled={isLoading || uploading}
          onClick={handleUpdate}
        >
          {isLoading ? "Laster..." : "Lagre"}
        </button>
      </div>
    </div>
  );
}

export default UpdateBox;
