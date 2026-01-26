import { useContext, useEffect, useState } from "react";
import { useDeleteProduct } from "../../../API/useDeleteProduct";
import style from "./DeleteBox.module.css";
import { APIResult } from "../../../context/siteContexts";

interface DeleteBoxProps {
  id: string;
  imageUrl?: string;
  deleteBoxValue: boolean;
  toggleDeleteBox: (val: boolean) => void;
}

function DeleteBox({ id, imageUrl, deleteBoxValue, toggleDeleteBox }: DeleteBoxProps) {
  const { fetchProducts } = useContext(APIResult);
  const { deleteProduct, result, isLoading } = useDeleteProduct();
  const [showStorageError, setShowStorageError] = useState(false);

  const handleDelete = async () => {
    await deleteProduct(id, imageUrl);
  };

  // Handle auto-close on table deletion success
  useEffect(() => {
    if (result?.tableDeleted) {
      setTimeout(() => {
        fetchProducts();
        toggleDeleteBox(false);
      }, 1500);
    }
  }, [result, fetchProducts, toggleDeleteBox]);

  // Show storage error message temporarily
  useEffect(() => {
    if (result?.tableDeleted && result?.storageDeleted === false) {
      setShowStorageError(true);
      const timer = setTimeout(() => setShowStorageError(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [result]);

  useEffect(() => { //Prevents scroll on elements behind modal
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

  return (
    <div className={style.deleteModal}>
      <div className={style.deleteBox}>
        <button
          className={style.closeButton}
          type="button"
          onClick={() => toggleDeleteBox(!deleteBoxValue)}
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
            Produktet ble slettet, men bildet kunne ikke fjernes fra lagring.
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
