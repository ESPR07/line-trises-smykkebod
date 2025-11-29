import { useState, useContext, ChangeEvent, useEffect } from "react";
import style from "../UpdateBox/UpdateBox.module.css";
import { useCreateProduct } from "../../../API/useCreateProduct";
import { APIResult } from "../../../App";
import { uploadImage } from "../../../API/uploadImage";

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

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<string>("0.00");
  const [shortDesc, setShortDesc] = useState<string>("");
  const [longDesc, setLongDesc] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [previewError, setPreviewError] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const { createProduct, isLoading, isSuccess, isError } = useCreateProduct();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleCreate = async () => {
    const numericPrice = Number(price) || 0;
    const numericDiscount = Number(discountAmount) || 0;
    const hasDiscount = numericDiscount > 0;

    await createProduct({
      name,
      price: numericPrice,
      discount: hasDiscount,
      discount_amount: numericDiscount,
      short_description: shortDesc || undefined,
      long_description: longDesc || undefined,
      image_url: imageUrl || undefined,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      fetchProducts();
      setTimeout(() => toggleModal(false), 1200);
    }
  }, [isSuccess, fetchProducts, toggleModal]);

  if (!showModal) return null;

  return (
    <div className={style.updateModal}>
      <div className={style.updateBox}>
        <button
          className={style.closeButton}
          type="button"
          onClick={() => toggleModal(!showModal)}
        >
          X
        </button>
        <h3>Legg til nytt produkt</h3>

        <label>
          Produktnavn:
          <input
            placeholder="F.eks. Super T-skjorte"
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
          Kort beskrivelse:
          <textarea
            placeholder="En kort beskrivelse av produktet"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
          />
        </label>

        <label>
          Lang beskrivelse:
          <textarea
            placeholder="En detaljert beskrivelse av produktet"
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
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
            alt="Produktbilde forhåndsvisning"
            onError={() => setPreviewError(true)}
          />
        )}

        {previewError && (
          <p className={style.previewError}>Kunne ikke laste bildet</p>
        )}
        {isError && <p className={style.error}>Noe gikk galt, prøv igjen.</p>}
        {isSuccess && <p className={style.success}>Produktet ble lagt til!</p>}

        <button
          className={style.updateButton}
          type="button"
          disabled={isLoading || uploading || !name || !price}
          onClick={handleCreate}
        >
          {isLoading ? "Laster..." : "Legg til produkt"}
        </button>
      </div>
    </div>
  );
}

export default NewBox;
