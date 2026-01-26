import { Link } from "react-router";
import { useContext, useState } from "react";
import style from "./ProductCard.module.css";
import { CartContext } from "../../context/siteContexts";

interface ProductCardProps {
  imageURL: string;
  name: string;
  price: number;
  discount: boolean;
  discountPrice: number | null;
  id: string;
}

type AddToCart = {
  id: string;
  name: string;
  discountPrice: number | null;
  price: number;
  imageURL: string;
};

function ProductCard({
  imageURL,
  name,
  price,
  discount,
  discountPrice,
  id,
}: ProductCardProps) {
  const dispatch = useContext(CartContext).dispatch;
  const [isAdded, setIsAdded] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent, _data: AddToCart) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: "addToCart",
      payload: { id, quantity: 1 },
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discountPercentage = discount && discountPrice 
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  return (
    <Link to={`/produkt/${id}`} className={style.cardLink}>
      <article className={style.card}>
        {/* Discount Badge */}
        {discount && (
          <div className={style.discountBadge}>
            -{discountPercentage}%
          </div>
        )}

        {/* Image Container */}
        <div className={style.imageContainer}>
          <img 
            src={imageURL} 
            alt={name}
            className={style.productImage}
          />
          
          {/* Add to Cart Button - Desktop */}
          <button
            onClick={(e) => handleAddToCart(e, { id, name, discountPrice, price, imageURL })}
            className={`${style.addButtonDesktop} ${isAdded ? style.added : ''}`}
            aria-label="Legg til i handlekurv"
          >
            {isAdded ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={style.checkIcon}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={style.plusIcon}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className={style.productInfo}>
          <h3 className={style.productName}>
            {name}
          </h3>
          
          <div className={style.priceSection}>
            {discount && discountPrice ? (
              <div className={style.discountPriceContainer}>
                <span className={style.currentPrice}>
                  kr {discountPrice}
                </span>
                <span className={style.originalPrice}>
                  kr {price}
                </span>
                <span className={style.savingsTag}>
                  Du sparer kr {price - discountPrice}
                </span>
              </div>
            ) : (
              <span className={style.regularPrice}>
                kr {price}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Add Button */}
        <button
          onClick={(e) => handleAddToCart(e, { id, name, discountPrice, price, imageURL })}
          className={`${style.addButtonMobile} ${isAdded ? style.addedMobile : ''}`}
          aria-label="Legg til i handlekurv"
        >
          {isAdded ? '✓ Lagt til!' : 'Legg til i handlekurv'}
        </button>
      </article>
    </Link>
  );
}

export default ProductCard;