import { useContext } from "react";
import AdminProductColumn from "../AdminProductColumn/AdminProductColumn";
import style from "./AdminProducts.module.css";
import { APIResult } from "../../../App";
import EventButton from "../../utils/EventButton/EventButton";

function AdminProducts() {
  const { allProducts, loading, error } = useContext(APIResult);

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

  if (allProducts) {
    return (
      <article className={style.adminProductsContainer}>
        <div className={style.topSection}>
          <h2>Produkter</h2>
          <EventButton text="Nytt Produkt" event={() => {console.log("Nytt Produkt!")}} buttonWidth={20}/>
        </div>

        {allProducts.length === 0 ? <h3>Her var det tomt</h3> : ""}

        <div className={style.adminProductsHeader}>
          <span>Bilde</span>
          <span>Navn</span>
          <span>Pris</span>
          <span>Status</span>
          <span>Handlinger</span>
        </div>

        {allProducts?.map((product) => {
          return <AdminProductColumn key={product.id} data={product} />;
        })}
      </article>
    );
  }
}

export default AdminProducts;
