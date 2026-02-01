import { Link, useParams } from "react-router";
import { useContext, useState } from "react";
import style from "./ProductPage.module.css"
import { useSingleProduct } from "../API/useSingleProduct";
import { CartContext } from "../context/siteContexts";

function SingleProduct() {
  const { id } = useParams() as { id: string };
  const { product, isLoading, isError } = useSingleProduct(id);
  const dispatch = useContext(CartContext).dispatch;
  const [addedToCart, setAddedToCart] = useState(false);
  // const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch({
      type: "addToCart",
      payload: { id: product.id, quantity: 1 },
    });
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // const handleQuantityChange = (change: number) => {
  //   const newQuantity = quantity + change;
  //   if (newQuantity >= 1 && newQuantity <= 10) {
  //     setQuantity(newQuantity);
  //   }
  // };

  if (isLoading) {
    return (
      <>
        <title>Laster... | Line Trises Kunstsmykker</title>
        <main className={style.productPageContainer}>
          <div className={style.loadingContainer}>
            <div className={style.spinner}></div>
            <p>Laster produkt...</p>
          </div>
        </main>
      </>
    );
  }

  if (isError || !product) {
    return (
      <>
        <title>Fant ikke produkt | Line Trises Kunstsmykker</title>
        <main className={style.productPageContainer}>
          <div className={style.errorContainer}>
            <div className={style.errorIcon}>⚠️</div>
            <h1>Produktet ble ikke funnet</h1>
            <p>Beklager, vi kunne ikke finne produktet du leter etter.</p>
            <Link to="/produkter" className={style.backButton}>
              Tilbake til produkter
            </Link>
          </div>
        </main>
      </>
    );
  }

  const displayPrice = product.discount ? product.discount_amount : product.price;
  const savings = product.discount ? product.price - product.discount_amount : 0;
  const savingsPercent = savings > 0 ? Math.round((savings / product.price) * 100) : 0;

  return (
    <>
      <title>{`${product.name} | Line Trises Kunstsmykker`}</title>
      <meta name="description" content={product.short_description || product.long_description || `Kjøp ${product.name}`} />
      
      <main className={style.productPageContainer}>
        <Link to="/produkter" className={style.backLink}>
          <div className={style.backArrow}></div>
          <span>Tilbake til produkter</span>
        </Link>

        <section className={style.productContainer}>
          <article className={style.imageSection}>
            {product.discount && savingsPercent > 0 && (
              <div className={style.discountBadge}>
                -{savingsPercent}%
              </div>
            )}
            <div className={style.imageWrapper}>
              <img 
                src={product.image_url || "/placeholder-image.jpg"} 
                alt={product.name}
                className={style.productImage}
              />
            </div>
          </article>

          <article className={style.infoSection}>
            <div className={style.productHeader}>
              <h1 className={style.productName}>{product.name}</h1>
            </div>

            <div className={style.priceSection}>
              <div className={style.priceContainer}>
                {product.discount ? (
                  <>
                    <span className={style.currentPrice}>kr {displayPrice}</span>
                    <span className={style.originalPrice}>kr {product.price}</span>
                  </>
                ) : (
                  <span className={style.currentPrice}>kr {product.price}</span>
                )}
              </div>
              {savings > 0 && (
                <div className={style.savingsInfo}>
                  Du sparer kr {savings}
                </div>
              )}
              <h2 className={style.descriptionTitle}>Beskrivelse</h2>
              <p className={style.descriptionText}>{product.long_description}</p>
            </div>

            <div className={style.quantitySection}>
              <label className={style.quantityLabel}>Antall:</label>
              {/* <div className={style.quantityControls}>
                <button 
                  className={style.quantityButton}
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className={style.quantityDisplay}>{quantity}</span>
                <button 
                  className={style.quantityButton}
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div> */}
            </div>

            <button 
              className={`${style.addToCartButton} ${addedToCart ? style.added : ''}`}
              onClick={handleAddToCart}
              disabled={!product.active_status}
            >
              {addedToCart ? '✓ Lagt til!' : 'Legg til i handlekurv'}
            </button>

            {!product.active_status && (
              <div className={style.unavailableNotice}>
                Dette produktet er ikke tilgjengelig for øyeblikket
              </div>
            )}

            <div className={style.featuresSection}>
              <h2 className={style.featuresTitle}>Viktig Informasjon</h2>
              <p>✨ Alle varer er håndlaget og kan derfor variere litt i størrelse og form</p>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}

export default SingleProduct;