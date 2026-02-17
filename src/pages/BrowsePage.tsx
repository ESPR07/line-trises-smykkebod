import { useContext, useEffect } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import style from "./BrowsePage.module.css";
import { APIResult } from "../context/siteContexts";
// import { useCategories } from "../API/useCategories";

function BrowsePage() {
  const {
    allProducts,
    loading,
    error,
    fetchProducts,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useContext(APIResult);

  // const { categories, fetchCategories } = useCategories();
  // const [selectedCategory, setSelectedCategory] = useState<string>("");

  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  useEffect(() => {
    fetchProducts(
      currentPage,
      true,
      undefined,
      // selectedCategory ? [selectedCategory] : undefined,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setCurrentPage(1); // reset to page 1 on filter change
  //   setSelectedCategory(e.target.value);
  // };

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
      <>
        <title>Laster... | Line Trises Kunstsmykker</title>
        <meta name="description" content="Laster alle produkter" />
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
        <title>Fant ikke side | Line Trises Kunstsmykker</title>
        <meta name="description" content="Kunne ikke finne siden du ser etter." />
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
      <title>Håndlagde smykker | Line Trises Kunstsmykker</title>
      <meta
        name="description"
        content="Se hele utvalget av håndlagde smykker. Finn ringer, armbånd, halskjeder og personlige gaver laget i høy kvalitet."
      />
      <main className={style.browseMain}>
        <div className={style.banner}>
          <div className={style.archContainer}>
            <svg viewBox="0 0 1440 150" className={style.arch}>
              <path
                fill="#bddaec"
                d="M0,0 C360,150 1080,150 1440,0 L1440,150 L0,150 Z"
              ></path>
            </svg>
          </div>
        </div>

        <section className={style.browseContainer}>
          <h1 className={style.browseHeader}>Alle Produkter</h1>

          {/* Category filter */}
          {/* {categories.length > 0 && (
            <div className={style.filterMenu}>
              <select
                className={style.categorySelect}
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">Alle kategorier</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )} */}

          <span className={style.divider}></span>

          <article className={style.productGrid}>
            {allProducts?.length === 0 ? (
              <h2>Ingen produkter til salgs</h2>
            ) : null}
            {allProducts?.map((product) => (
              <ProductCard
                key={product.id}
                imageURL={product.image_url || ""}
                name={product.name}
                price={product.price}
                discount={product.discount}
                discountPrice={product.discount_amount}
                id={product.id}
              />
            ))}
          </article>

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
        </section>
      </main>
    </>
  );
}

export default BrowsePage;