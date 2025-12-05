import { useContext } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import style from "./BrowsePage.module.css";
import { APIResult } from "../App";

function BrowsePage() {
  const { allProducts, loading, error } = useContext(APIResult);

  if (loading) {
    return (
      <>
        <title>Laster... | Line Trises Smykkebod</title>
        <meta name="description" content="Laster alle produkter"/>
        <main className={style.browseMain}>
        <h1 className={style.browseHeader}>Alle Produkter</h1>
        <section className={style.browseContainer}>
          <p className={style.loader}>Loading...</p>
        </section>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <title>Fant ikke side | Line Trises Smykkebod</title>
        <meta name="description" content="Kunne ikke finne siden du ser etter."/>
        <main className={style.browseMain}>
          <h1 className={style.browseHeader}>Alle Produkter</h1>
          <section className={style.browseContainer}>
            <p className={style.loader}>Something went wrong!</p>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <title>Håndlagde smykker | Line Trises Smykkebod</title>
      <meta name="description" content="Se hele utvalget av håndlagde smykker. Finn ringer, armbånd, halskjeder og personlige gaver laget i høy kvalitet."/>
      <main className={style.browseMain}>
        <div className={style.banner}></div>
        <section className={style.browseContainer}>
          <h1 className={style.browseHeader}>Alle Produkter</h1>
          <article className={style.filterMenu}>
            <select>
              <option defaultValue={"Filter"} hidden>
                Filter
              </option>
              <option value="Yellow">Yellow</option>
            </select>
          </article>
          <span className={style.divider}></span>
          <article className={style.productGrid}>
            {allProducts?.length === 0 ? <h2>Ingen produkter til salgs</h2> : ""}
            {allProducts?.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  imageURL={product.image_url || ""}
                  name={product.name}
                  price={product.price}
                  discount={product.discount}
                  discountPrice={product.discount_amount}
                  id={product.id}
                />
              );
            })}
          </article>
        </section>
        <div className={style.archContainer}>
          <svg viewBox="0 0 1440 150" className={style.arch}>
            <path
              fill="#bddaec"
              d="M0,0 C360,150 1080,150 1440,0 L1440,150 L0,150 Z"
            ></path>
          </svg>
        </div>
      </main>
    </>
  );
}

export default BrowsePage;
