import { useState, useContext, ChangeEvent, useEffect } from "react";
import style from "../UpdateBox/UpdateBox.module.css";
import { useCreateProduct } from "../../../API/useCreateProduct";
import { uploadImage } from "../../../API/uploadImage";
import imageCompression from "browser-image-compression";
import { APIResult } from "../../../context/siteContexts";

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
  return uploadImage(file, fileName);
}

interface AddProductModalProps {
  showModal: boolean;
  toggleModal: (val: boolean) => void;
}

function NewBox({ showModal, toggleModal }: AddProductModalProps) {
  const { fetchProducts } = useContext(APIResult);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountAmount, setDiscountAmount] = useState("0.00");
  const [longDesc, setLongDesc] = useState("");

  // Store image in memory only
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [previewError, setPreviewError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { createProduct, isLoading, isSuccess, isError } = useCreateProduct();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 2,            // Ensure final file <= 2MB
        maxWidthOrHeight: 1200,  // Downscale large images
        useWebWorker: true,
        fileType: "image/webp",
        initialQuality: 0.8,
      };

      const compressedFile = await imageCompression(file, options);

      setImageFile(compressedFile);

      // Generate preview in memory
      const previewURL = URL.createObjectURL(compressedFile);
      setImagePreview(previewURL);
      setPreviewError(false);
    } catch (err) {
      console.error("Image processing failed:", err);
      setPreviewError(true);
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
    if (parts[1]?.length > 2)
      sanitized = parts[0] + "." + parts[1].slice(0, 2);

    sanitized = sanitized.replace(/^0+(\d)/, "$1");
    setter(sanitized);
  };

  const handleCreate = async () => {
    const numericPrice = Number(price) || 0;
    const numericDiscount = Number(discountAmount) || 0;

    setUploading(true);

    try {
      let uploadedUrl: string | undefined;

      // Upload the image if one was selected
      if (imageFile) {
        const url = await uploadImageWithHash(imageFile);
        if (url) uploadedUrl = url;
      }

      // Create product with uploaded image URL
      await createProduct({
        name,
        price: numericPrice,
        discount: numericDiscount > 0,
        discount_amount: numericDiscount,
        long_description: longDesc || undefined,
        image_url: uploadedUrl,
      });

    } catch (err) {
      console.error("Failed to create product:", err);
      setPreviewError(true);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => toggleModal(false), 1200);
      setTimeout(() => fetchProducts(), 1400);
    }
  }, [isSuccess, fetchProducts, toggleModal]);

  // Prevent scroll behind modal
  useEffect(() => {
    if (showModal) {
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
  }, [showModal]);

  if (!showModal) return null;

  return (
    <div className={style.updateModal}>
      <div className={style.updateBox}>
        <button
          className={style.closeButton}
          type="button"
          onClick={() => toggleModal(false)}
        />

        <h3>Legg til nytt produkt</h3>

        <label>
          Produktnavn:
          <input
            placeholder="F.eks. Rødt Smykke"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Pris (NOK):
          <input
            type="text"
            placeholder="F.eks. 199.99"
            value={price}
            onChange={(e) => handleNumericInput(e.target.value, setPrice)}
          />
        </label>

        <label>
          Rabattbeløp:
          <input
            type="text"
            placeholder="F.eks. 20.00"
            value={discountAmount}
            onChange={(e) =>
              handleNumericInput(e.target.value, setDiscountAmount)
            }
          />
        </label>

        <label>
          Beskrivelse:
          <textarea
            placeholder="En beskrivelse av produktet"
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
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
            alt="Produktbilde forhåndsvisning"
            onError={() => setPreviewError(true)}
          />
        )}

        {previewError && (
          <p className={style.previewError}>Kunne ikke laste bildet</p>
        )}

        {isError && (
          <p className={style.error}>Noe gikk galt, prøv igjen.</p>
        )}

        {isSuccess && (
          <p className={style.success}>Produktet ble lagt til!</p>
        )}

        <button
          className={style.updateButton}
          type="button"
          disabled={isLoading || uploading || !name || !price}
          onClick={handleCreate}
        >
          {isLoading || uploading ? "Laster..." : "Legg til produkt"}
        </button>
      </div>
    </div>
  );
}

export default NewBox;
