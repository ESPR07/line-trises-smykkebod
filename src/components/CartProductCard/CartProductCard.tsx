import { useState, useEffect } from "react";
import style from "./CartProductCard.module.css";
import { CartItem } from "../../App";
import TrashIcon from "../../assets/svg_components/TrashIcon";

type Props = {
  product: CartItem;
  onUpdate: (product: CartItem, quantity: number) => void;
  onRemove: (product: CartItem) => void;
};

const CartProductCard = ({ product, onUpdate, onRemove }: Props) => {
  const [quantity, setQuantity] = useState<number>(product.quantity);

  useEffect(() => {
    setQuantity(product.quantity);
  }, [product.quantity]);

  const handleQunatityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
      onUpdate(product, newQuantity);
    }
  };

  return (
    <div className={style.item}>
      <img src={product.imageURL} alt={product.name} />
      <div className={style.itemInfo}>
        <div className={style.cartItemText}>
          <span className={style.titleDeleteContainer}>
            <h2>{product.name}</h2>
            <button
              className={style.deleteButton}
              onClick={() => onRemove(product)}
              aria-label="Slett produkt"
            >
              <TrashIcon />
            </button>
          </span>
          {product.discountPrice ? (
            <p className={style.discount}>kr {product.price}</p>
          ) : (
            <p>kr {product.price}</p>
          )}
          {product.discountPrice ? (
            <p>kr {product.discountPrice.toFixed(2)}</p>
          ) : (
            ""
          )}
        </div>
        <div className={style.cartItemInteraction}>
          <div className={style.quantitySection}>
            {quantity > 1 && (
              <div className={style.quantityControls}>
                <button
                  className={style.quantityButton}
                  onClick={() => handleQunatityChange(-1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className={style.quantityDisplay}>{quantity}</span>
                <button
                  className={style.quantityButton}
                  onClick={() => handleQunatityChange(1)}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProductCard;
