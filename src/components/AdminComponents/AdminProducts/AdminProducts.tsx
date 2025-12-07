import { useContext, useEffect, useState } from "react";
import AdminProductColumn from "../AdminProductColumn/AdminProductColumn";
import style from "./AdminProducts.module.css";
import { APIResult } from "../../../App";
import EventButton from "../../utils/EventButton/EventButton";
import NewBox from "../NewBox/NewBox";

interface AdminProductsProps {
  canEdit?: boolean;
}

function AdminProducts(canEdit?: AdminProductsProps) {
  const {
    allProducts,
    loading,
    error,
    fetchProducts,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useContext(APIResult);

  const [newBox, setNewBox] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts(currentPage, false); // Admin sees all products
  }, [currentPage]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <article className={style.adminProductsContainer}>
        <h2>Laster...</h2>
      </article>
    );
  }

  if (error) {
    return (
      <article className={style.adminProductsContainer}>
        <h2>Noe gikk galt</h2>
      </article>
    );
  }

  if (canEdit?.canEdit === false) {
    return (
      <article className={style.adminProductsContainer}>
        <div className={style.topSection}>
          <h2>Produkter</h2>
        </div>

        <div className={style.adminProductsHeader}>
          <span>Bilde</span>
          <span>Navn</span>
          <span>Pris</span>
          <span>Status</span>
          <span>Handlinger</span>
        </div>

        {allProducts && allProducts.length === 0 && <h3>Her var det tomt</h3>}

        {allProducts?.map((product) => (
          <AdminProductColumn key={product.id} data={product} />
        ))}
      </article>
    );
  }

  return (
    <article className={style.adminProductsContainer}>
      <div className={style.topSection}>
        <h2>Produkter</h2>
        <EventButton
          text="Nytt Produkt"
          event={() => setNewBox(true)}
          buttonWidth={30}
          checkBox={false}
        />
      </div>

      {newBox && <NewBox showModal={newBox} toggleModal={setNewBox} />}

      <div className={style.adminProductsHeader}>
        <span>Bilde</span>
        <span>Navn</span>
        <span>Pris</span>
        <span>Status</span>
        <span>Handlinger</span>
      </div>

      {allProducts && allProducts.length === 0 && <h3>Her var det tomt</h3>}

      {allProducts?.map((product) => (
        <AdminProductColumn key={product.id} data={product} />
      ))}

      {/* Pagination Controls */}
      <div className={style.pagination}>
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={style.paginationButton}
        >
          ‹ Forrige
        </button>

        <span className={style.pageInfo}>
          Side {currentPage} av {totalPages}
        </span>

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={style.paginationButton}
        >
          Neste ›
        </button>
      </div>
    </article>
  );
}

export default AdminProducts;
