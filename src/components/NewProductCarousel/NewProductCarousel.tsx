import { useContext, useRef, useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import ProductCard from "../ProductCard/ProductCard";
import style from "./NewProductCarousel.module.css";
import { FetchResult } from "../../@types/Database";
import { APIResult } from "../../context/siteContexts";

function NewProductCarousel() {
  const scrollRef = useRef<HTMLUListElement>(null);
  const { allProducts, loading, error } = useContext(APIResult);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function getCardWidthWithGap() {
    const firstCard = scrollRef.current?.querySelector("li");
    if (!firstCard) return 280 + 30;
    return firstCard.clientWidth + 30;
  }

  function scrollRight() {
    if (!scrollRef.current) return;
    const scrollAmount = isMobile ? getCardWidthWithGap() : scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }

  function scrollLeft() {
    if (!scrollRef.current) return;
    const scrollAmount = isMobile ? getCardWidthWithGap() : scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  }

  // super simple swipe -> call your functions
  const swipeHandlers = useSwipeable({
    onSwipedLeft: scrollRight,
    onSwipedRight: scrollLeft,
    trackMouse: true
  });

  if (loading || error) {
    return (
      <section className={style.carouselContainer} {...swipeHandlers}>
        <article className={style.newProductsHeader}>Nye produkter</article>
        <button className={style.sideSwipeLeft} onClick={scrollLeft}></button>

        <ul className={style.newProductList} ref={scrollRef}>
          {loading ? (
            <p className={style.loader}>Loading...</p>
          ) : (
            <p className={style.error}>Noe gikk galt!</p>
          )}
        </ul>

        <button className={style.sideSwipeRight} onClick={scrollRight}></button>
      </section>
    );
  }

  return (
    <section className={style.carouselContainer} {...swipeHandlers}>
      <article className={style.newProductsHeader}>Nye produkter</article>
      <button
        aria-label="Left Scroll"
        className={style.sideSwipeLeft}
        onClick={scrollLeft}
      ></button>

      <ul className={style.newProductList} ref={scrollRef}>
        {allProducts?.length === 0 && (
          <h2 className={style.emptyList}>Ingen produkter til salg</h2>
        )}

        {allProducts?.map((product: FetchResult) => (
          <li key={product.id}>
            <ProductCard
              imageURL={product.image_url || ""}
              name={product.name}
              price={product.price}
              discount={product.discount}
              discountPrice={product.discount_amount}
              id={product.id}
            />
          </li>
        ))}
      </ul>

      <button
        aria-label="Right Scroll"
        className={style.sideSwipeRight}
        onClick={scrollRight}
      ></button>
    </section>
  );
}

export default NewProductCarousel;
