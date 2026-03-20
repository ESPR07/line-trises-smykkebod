import { useState, useContext, ChangeEvent, useEffect } from "react";
import style from "../UpdateBox/UpdateBox.module.css";
import { useCreateProduct } from "../../../API/useCreateProduct";
import { uploadImage } from "../../../API/uploadImage";
import imageCompression from "browser-image-compression";
import { APIResult } from "../../../context/siteContexts";
import { useMaterials } from "../../../API/useMaterials";

// Hash utility for files
async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Deduplicated upload using hash
async function uploadImageWithHash(file: File): Promise<string | null> {
  const fileHash = await hashFile(file);
  const fileName = `products/${fileHash}.webp`;
  return uploadImage(file, fileName);
}

interface Category {
  id: string;
  name: string;
}

interface AddProductModalProps {
  showModal: boolean;
  toggleModal: (val: boolean) => void;
}

function NewBox({ showModal, toggleModal }: AddProductModalProps) {
  const { fetchProducts } = useContext(APIResult);
  const { categories, fetchMaterials } = useMaterials();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountAmount, setDiscountAmount] = useState("0.00");
  const [longDesc, setLongDesc] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const [previewError, setPreviewError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { createProduct, isLoading, isSuccess, isError } = useCreateProduct();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.some((c) => c.id === cat.id)
        ? prev.filter((c) => c.id !== cat.id)
        : [...prev, cat]
    );
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: "image/webp",
        initialQuality: 0.9,
      };

      const newFiles: File[] = [];
      const newPreviews: string[] = [];

      for (const file of files) {
        const compressed = await imageCompression(file, options);

        const alreadyAdded = imageFiles.some(
          (existing) =>
            existing.name === compressed.name &&
            existing.size === compressed.size
        );

        if (alreadyAdded) continue;

        newFiles.push(compressed);
        newPreviews.push(URL.createObjectURL(compressed));
      }

      if (!newFiles.length) return;

      setImageFiles((prev) => [...prev, ...newFiles]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      setPreviewError(false);
      e.target.value = "";
    } catch (err) {
      console.error("Image processing failed:", err);
      setPreviewError(true);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });

    setImagePreviews((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index]);
      updated.splice(index, 1);
      return updated;
    });

    setMainImageIndex((prev) => {
      if (index === prev) return 0;
      if (index < prev) return prev - 1;
      return prev;
    });
  };

  const handleNumericInput = (value: string, setter: (val: string) => void) => {
    if (value === "") { setter(""); return; }
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

    setUploading(true);

    try {
      let uploadedImages: string[] = [];

      if (imageFiles.length) {
        const results = await Promise.all(
          imageFiles.map((file) => uploadImageWithHash(file))
        );
        uploadedImages = results.filter((url): url is string => Boolean(url));
      }

      const orderedImages = uploadedImages.length
        ? [
            uploadedImages[mainImageIndex],
            ...uploadedImages.filter((_, i) => i !== mainImageIndex),
          ]
        : [];

      await createProduct({
        name,
        price: numericPrice,
        discount: numericDiscount > 0,
        discount_amount: numericDiscount,
        long_description: longDesc || undefined,
        image_links: orderedImages.length ? orderedImages : undefined,
        image_url: orderedImages[0],
        categories: selectedCategories.length
          ? selectedCategories.map((c) => c.name)
          : undefined,
      });
    } catch (err) {
      console.error("Failed to create product:", err);
      setPreviewError(true);
    } finally {
      setUploading(false);
    }
  };

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

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => toggleModal(false), 1200);
      setTimeout(() => fetchProducts(), 1400);
    }
  }, [isSuccess, fetchProducts, toggleModal]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="f.eks Rødt smykke"
          />
        </label>

        <label>
          Pris (NOK):
          <input
            value={price}
            onChange={(e) => handleNumericInput(e.target.value, setPrice)}
            placeholder="f.eks 299.90"
          />
        </label>

        <label>
          Rabattbeløp:
          <input
            value={discountAmount}
            onChange={(e) =>
              handleNumericInput(e.target.value, setDiscountAmount)
            }
            placeholder="f.eks 210"
          />
        </label>

        <label>
          Beskrivelse:
          <textarea
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
            placeholder="Skriv noe om produktet"
          />
        </label>

        {/* Category selector */}
        {categories.length > 0 && (
          <div className={style.categorySelector}>
            <span className={style.categorySelectorLabel}>Kategorier:</span>
            <div className={style.categoryChips}>
              {categories.map((cat) => {
                const isSelected = selectedCategories.some(
                  (c) => c.id === cat.id
                );
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`${style.categoryChip} ${
                      isSelected ? style.categoryChipSelected : ""
                    }`}
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <label>
          Last opp bilder:
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </label>

        {uploading && <p>Laster opp bilder...</p>}

        {imagePreviews.length > 0 && !previewError && (
          <div className={style.previewGrid}>
            {imagePreviews.map((src, i) => (
              <div
                key={i}
                className={`${style.previewWrapper} ${
                  i === mainImageIndex ? style.mainImage : ""
                }`}
              >
                <button
                  type="button"
                  className={style.removeImageButton}
                  onClick={() => handleRemoveImage(i)}
                  title="Fjern bilde"
                >
                  ✕
                </button>
                <button
                  type="button"
                  className={style.selectMainButton}
                  onClick={() => setMainImageIndex(i)}
                  title="Velg som hovedbilde"
                >
                  <img src={src} alt={`Produktbilde ${i + 1}`} />
                  {i === mainImageIndex && (
                    <span className={style.mainBadge}>Hovedbilde</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {previewError && (
          <p className={style.previewError}>Kunne ikke laste bildet</p>
        )}
        {isError && <p className={style.error}>Noe gikk galt, prøv igjen.</p>}
        {isSuccess && <p className={style.success}>Produktet ble lagt til!</p>}

        <button
          className={style.updateButton}
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