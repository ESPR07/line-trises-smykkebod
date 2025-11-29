import { useContext, useEffect } from "react";
import { useDeleteProduct } from "../../../API/useDeleteProduct";
import style from "./DeleteBox.module.css";
import { APIResult } from "../../../App";

function DeleteBox({ id, deleteBoxValue, toggleDeleteBox }: any) {
  const { fetchProducts } = useContext(APIResult);
  const { deleteProduct, isLoading, isSuccess, isError } = useDeleteProduct();

  async function handleDelete() {
    await deleteProduct(id);
  }

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
      fetchProducts();
      toggleDeleteBox(false);
    }, 1500);
    }
  }, [isSuccess]);

  return (
    <div className={style.deleteModal}>
      <div className={style.deleteBox}>
        <button
          className={style.closeButton}
          type="button"
          onClick={() => {
            toggleDeleteBox(!deleteBoxValue);
          }}
        >
          X
        </button>
        {isSuccess ? (
          <p>Produktet er slettet!</p>
        ) : (
          <p>
            Er du helt sikker på at du vil slette produktet? Dette kan ikke
            angres!
          </p>
        )}
        {isError && <p style={{ color: "red" }}>Noe gikk galt, prøv igjen.</p>}
        {!isSuccess && (
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
