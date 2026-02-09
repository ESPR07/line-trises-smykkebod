import { useContext, useEffect, useState } from "react";
import { useDeleteProduct } from "../../../API/useDeleteProduct";
import style from "./DeleteBox.module.css";
import { APIResult } from "../../../context/siteContexts";
import { supabaseClient } from "../../../components/utils/supabaseClient";

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

interface DeleteBoxProps {
  id: string;
  imageUrl?: string;        // legacy support
  imageLinks?: string[];    // NEW: all product images
  deleteBoxValue: boolean;
  toggleDeleteBox: (val: boolean) => void;
}

function DeleteBox({
  id,
  imageUrl,
  imageLinks,
  deleteBoxValue,
  toggleDeleteBox,
}: DeleteBoxProps) {
  const { fetchProducts } = useContext(APIResult);
  const { deleteProduct, result, isLoading } = useDeleteProduct();
  const [showStorageError, setShowStorageError] = useState(false);

  const handleDelete = async () => {
    await deleteProduct(id, imageUrl);

    const imagesToDelete = imageLinks?.length
      ? imageLinks
      : imageUrl
      ? [imageUrl]
      : [];

    if (!imagesToDelete.length) return;

    try {
      const groupedByBucket: Record<string, string[]> = {};

      imagesToDelete.forEach((url) => {
        const parsed = parseSupabaseFilePath(url);
        if (!parsed) return;

        if (!groupedByBucket[parsed.bucket]) {
          groupedByBucket[parsed.bucket] = [];
        }
        groupedByBucket[parsed.bucket].push(parsed.filePath);
      });

      for (const bucket in groupedByBucket) {
        const { error } = await supabaseClient.storage
          .from(bucket)
          .remove(groupedByBucket[bucket]);

        if (error) {
          console.error("Failed to delete images:", error.message);
          setShowStorageError(true);
        }
      }
    } catch (err) {
      console.error("Storage cleanup failed:", err);
      setShowStorageError(true);
    }
  };

  useEffect(() => {
    if (result?.tableDeleted) {
      setTimeout(() => {
        fetchProducts();
        toggleDeleteBox(false);
      }, 1500);
    }
  }, [result, fetchProducts, toggleDeleteBox]);


  useEffect(() => {
    if (showStorageError) {
      const timer = setTimeout(() => setShowStorageError(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showStorageError]);

  useEffect(() => {
    if (deleteBoxValue) {
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
  }, [deleteBoxValue]);

  if (!deleteBoxValue) return null;

  return (
    <div className={style.deleteModal}>
      <div className={style.deleteBox}>
        <button
          className={style.closeButton}
          type="button"
          onClick={() => toggleDeleteBox(false)}
        />

        {result?.tableDeleted ? (
          <p>Produktet er slettet!</p>
        ) : (
          <p>
            Er du helt sikker på at du vil slette produktet? Dette kan ikke
            angres!
          </p>
        )}

        {result?.error && <p style={{ color: "red" }}>{result.error}</p>}

        {showStorageError && (
          <p style={{ color: "red" }}>
            Produktet ble slettet, men ett eller flere bilder kunne ikke fjernes
            fra lagring.
          </p>
        )}

        {!result?.tableDeleted && (
          <button
            className={style.deleteButton}
            type="button"
            disabled={isLoading}
            onClick={handleDelete}
          >
            {isLoading ? "Laster..." : "Slett produktet"}
          </button>
        )}
      </div>
    </div>
  );
}

export default DeleteBox;
