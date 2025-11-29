import { useContext, useState } from "react";
import AdminProductColumn from "../AdminProductColumn/AdminProductColumn";
import style from "./AdminProducts.module.css";
import { APIResult } from "../../../App";
import EventButton from "../../utils/EventButton/EventButton";
import NewBox from "../NewBox/NewBox";

function AdminProducts() {
  const { allProducts, loading, error } = useContext(APIResult);
  const [newBox, setNewBox] = useState<boolean>(false);
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

  return (
    <article className={style.adminProductsContainer}>
      <div className={style.topSection}>
        <h2>Produkter</h2>
        <EventButton
          text="Nytt Produkt"
          event={() => setNewBox(true)}
          buttonWidth={20}
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
    </article>
  );
}

export default AdminProducts;
