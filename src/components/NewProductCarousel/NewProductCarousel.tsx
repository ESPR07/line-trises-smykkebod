import { useContext, useRef } from "react";
import ProductCard from "../ProductCard/ProductCard";
import style from "./NewProductCarousel.module.css"
import { FetchResult } from "../../@types/Database";
import { APIResult } from "../../App";

function NewProductCarousel() {
  const scrollRef = useRef<HTMLUListElement>(null);
  const {allProducts, loading, error} = useContext(APIResult);

  function scrollRight() {
    if(scrollRef.current) {
      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: Math.min(scrollRef.current.scrollLeft + 332, maxScroll),
        behavior: "smooth",
      })
    }
  }

  function scrollLeft() {
    if(scrollRef.current) {
      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: Math.min(scrollRef.current.scrollLeft - 332, maxScroll),
        behavior: "smooth",
      })
    }
  }

  if(loading) {
    return(
      <section className={style.carouselContainer}>
        <article className={style.newProductsHeader}>Nye produkter</article>
        <button className={style.sideSwipeLeft} onClick={scrollLeft}></button>
        <ul className={style.newProductList} ref={scrollRef}>
          <p className={style.loader}>Loading...</p>
        </ul>
        <button className={style.sideSwipeRight} onClick={scrollRight}></button>
      </section>
    )
  }

  if(error) {
    return(
      <section className={style.carouselContainer}>
        <article className={style.newProductsHeader}>Nye produkter</article>
        <button className={style.sideSwipeLeft} onClick={scrollLeft}></button>
        <ul className={style.newProductList} ref={scrollRef}>
          <p className={style.error}>Something went wrong!</p>
        </ul>
        <button className={style.sideSwipeRight} onClick={scrollRight}></button>
      </section>
    )
  }

  return(
    <section className={style.carouselContainer}>
      <article className={style.newProductsHeader}>Nye produkter</article>
      <button className={style.sideSwipeLeft} onClick={scrollLeft}></button>
      <ul className={style.newProductList} ref={scrollRef}>
        {allProducts?.length === 0 ? <h2 className={style.emptyList}>Ingen produkter til salg</h2> : ""}
        {allProducts?.map((product : FetchResult) => {
          return(
            <ProductCard key={product.id} imageURL={product.image_url} name={product.name} price={product.price} discount={product.discount} discountPrice={product.discount_amount} id={product.id}/>
          )
        })}
      </ul>
      <button className={style.sideSwipeRight} onClick={scrollRight}></button>
    </section>
  )
}

export default NewProductCarousel;