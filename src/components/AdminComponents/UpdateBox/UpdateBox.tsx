import { useState, useEffect, useContext, ChangeEvent, useRef } from "react";
import style from "./UpdateBox.module.css";
import { useUpdateProduct } from "../../../API/useUpdateProduct";
import { uploadImage } from "../../../API/uploadImage";
import { FetchResult } from "../../../@types/Database";
import { supabaseClient } from "../../../components/utils/supabaseClient";
import imageCompression from "browser-image-compression";
import { APIResult } from "../../../context/siteContexts";
import { useMaterials } from "../../../API/useMaterials";
import { useTypeSort } from "../../../API/useTypeSort";

async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function uploadImageWithHash(file: File): Promise<string | null> {
  const fileHash = await hashFile(file);
  const fileName = `products/${fileHash}.webp`;
  return uploadImage(file, fileName);
}

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

interface Category {
  id: string;
  name: string;
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
  const { categories, fetchMaterials } = useMaterials();
  const { sortTypes, fetchTypeSort } = useTypeSort();

  const { updateProduct, isLoading, isSuccess, isError } = useUpdateProduct();

  const [name, setName] = useState(product.name);
  const [longDescription, setLongDescription] = useState(
    product.long_description || "",
  );
  const [price, setPrice] = useState(product.price.toString());
  const [discountAmount, setDiscountAmount] = useState(
    (product.discount_amount || 0).toFixed(2),
  );
  const [activeStatus, setActiveStatus] = useState(
    product.active_status ?? true,
  );

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    if ((categories.length || sortTypes.length) && product.categories) {
      const existingNames = product.categories as string[];

      const matchedMaterials = categories.filter((c) =>
        existingNames.includes(c.name),
      );

      const matchedSortTypes = sortTypes.filter((c) =>
        existingNames.includes(c.name),
      );

      setSelectedCategories(() => {
        const combined = [...matchedMaterials, ...matchedSortTypes];
        const unique = combined.filter(
          (item, index, self) =>
            index === self.findIndex((c) => c.id === item.id),
        );
        return unique;
      });
    }
  }, [categories, sortTypes]);

  const originalImages = product.image_links?.length
    ? product.image_links
    : product.image_url
      ? [product.image_url]
      : [];

  const [existingImages, setExistingImages] =
    useState<string[]>(originalImages);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [previewError, setPreviewError] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMaterials();
    fetchTypeSort();
  }, []);

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.some((c) => c.id === cat.id)
        ? prev.filter((c) => c.id !== cat.id)
        : [...prev, cat],
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

      const compressedFiles: File[] = [];
      const previews: string[] = [];

      for (const file of files) {
        const compressed = await imageCompression(file, options);
        compressedFiles.push(compressed);
        previews.push(URL.createObjectURL(compressed));
      }

      setNewImageFiles((prev) => [...prev, ...compressedFiles]);
      setNewImagePreviews((prev) => [...prev, ...previews]);
      setPreviewError(false);
      e.target.value = "";
    } catch (err) {
      console.error("Image processing failed:", err);
      setPreviewError(true);
    }
  };

  const handleRemoveImage = (index: number) => {
    const existingCount = existingImages.length;

    if (index < existingCount) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingCount;
      setNewImageFiles((prev) => prev.filter((_, i) => i !== newIndex));
      setNewImagePreviews((prev) => {
        URL.revokeObjectURL(prev[newIndex]);
        return prev.filter((_, i) => i !== newIndex);
      });
    }

    setMainImageIndex((prev) => {
      if (index === prev) return 0;
      if (index < prev) return prev - 1;
      return prev;
    });
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

    setUploading(true);

    try {
      let uploadedNewImages: string[] = [];

      if (newImageFiles.length) {
        const results = await Promise.all(
          newImageFiles.map((file) => uploadImageWithHash(file)),
        );
        uploadedNewImages = results.filter((url): url is string =>
          Boolean(url),
        );
      }

      const allImages = [...existingImages, ...uploadedNewImages];

      const orderedImages = allImages.length
        ? [
            allImages[mainImageIndex],
            ...allImages.filter((_, i) => i !== mainImageIndex),
          ]
        : [];

      await updateProduct(product.id, {
        name,
        long_description: longDescription,
        price: numericPrice,
        discount: numericDiscount > 0,
        discount_amount: numericDiscount,
        active_status: activeStatus,
        image_url: orderedImages[0] || undefined,
        image_links: orderedImages,
        categories: selectedCategories.map((c) => c.name),
      });

      const removedImages = originalImages.filter(
        (url) => !orderedImages.includes(url),
      );

      if (removedImages.length) {
        await Promise.all(
          removedImages.map(async (url) => {
            const parsed = parseSupabaseFilePath(url);
            if (!parsed) return;
            await supabaseClient.storage
              .from(parsed.bucket)
              .remove([parsed.filePath]);
          }),
        );
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
  }, [isSuccess]);

  if (!updateBoxValue) return null;

  return (
    <div className={style.updateModal}>
      <div className={style.updateBox}>
        <button
          className={style.closeButton}
          type="button"
          onClick={() => toggleUpdateBox(false)}
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

        {/* Category selector */}
        {categories.length > 0 && (
          <div className={style.categorySelector}>
            <span className={style.categorySelectorLabel}>Materiale:</span>
            <div className={style.categoryChips}>
              {categories.map((cat) => {
                const isSelected = selectedCategories.some(
                  (c) => c.id === cat.id,
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

        {categories.length > 0 && (
          <div className={style.categorySelector}>
            <span className={style.categorySelectorLabel}>Smykke Type:</span>
            <div className={style.categoryChips}>
              {sortTypes.map((cat) => {
                const isSelected = selectedCategories.some(
                  (c) => c.id === cat.id,
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

        {[...existingImages, ...newImagePreviews].length > 0 &&
          !previewError && (
            <div className={style.previewGrid}>
              {[...existingImages, ...newImagePreviews].map((src, i) => (
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
                  >
                    ✕
                  </button>
                  <button
                    type="button"
                    className={style.selectMainButton}
                    onClick={() => setMainImageIndex(i)}
                  >
                    <img src={src} alt={`Bilde ${i + 1}`} />
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
