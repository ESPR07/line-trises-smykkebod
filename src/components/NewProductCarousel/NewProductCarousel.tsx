import { useRef } from "react";
import ProductCard from "../ProductCard/ProductCard";
import style from "./NewProductCarousel.module.css"

function NewProductCarousel() {
  const scrollRef = useRef<HTMLUListElement>(null);

  function scrollRight() {
    if(scrollRef.current) {
      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: Math.min(scrollRef.current.scrollLeft + 350, maxScroll),
        behavior: "smooth",
      })
    }
  }

  function scrollLeft() {
    if(scrollRef.current) {
      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: Math.min(scrollRef.current.scrollLeft - 350, maxScroll),
        behavior: "smooth",
      })
    }
  }

  return(
    <section className={style.carouselContainer}>
      <article className={style.newProductsHeader}>Nye produkter</article>
      <button className={style.sideSwipeLeft} onClick={scrollLeft}></button>
      <ul className={style.newProductList} ref={scrollRef}>
        <ProductCard/>
        <ProductCard/>
        <ProductCard/>
        <ProductCard/>
        <ProductCard/>
      </ul>
      <button className={style.sideSwipeRight} onClick={scrollRight}></button>
    </section>
  )
}

export default NewProductCarousel;