import { getProductList } from "../API/getProducts";
import ProductCard from "../components/ProductCard/ProductCard";
import style from "./BrowsePage.module.css"

function BrowsePage() {
  const {productList, isLoading, isError} = getProductList();

  if(isLoading) {
    return(
      <main className={style.browseMain}>
        <h1 className={style.browseHeader}>Alle Produkter</h1>
        <section className={style.browseContainer}>
          <p className={style.loader}>Loading...</p>
        </section>
      </main>
    )
  }

  if(isError) {
    return(
      <main className={style.browseMain}>
        <h1 className={style.browseHeader}>Alle Produkter</h1>
        <section className={style.browseContainer}>
          <p className={style.loader}>Something went wrong!</p>
        </section>
      </main>
    )
  }

  return(
    <main className={style.browseMain}>
      <h1 className={style.browseHeader}>Alle Produkter</h1>
      <section className={style.browseContainer}>
        <article className={style.searchFilterMenu}>
          <input type="text" placeholder="Search"/>
          <select>
            <option defaultValue={"Filter"} hidden>Filter</option>
            <option value="Yellow">Yellow</option>
          </select>
        </article>
        <span className={style.divider}></span>
        <article className={style.productGrid}>
          {productList?.map((product) => {
            return(
              <ProductCard key={product.id} imageURL={product.image_url} name={product.name} price={product.price} discount={product.discount} discountPrice={product.discount_amount} id={product.id}/>
            )
          })}
        </article>
      </section>
    </main>
  )
}

export default BrowsePage;