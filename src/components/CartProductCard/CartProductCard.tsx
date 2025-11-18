import React, { useState, useEffect } from "react";
import style from "./CartProductCard.module.css";
import { Cart } from "../../App";

type Props = {
  product: Cart["productList"][number];
  onUpdate: (product: Cart["productList"][number], quantity: number) => void;
  onRemove: (product: Cart["productList"][number]) => void;
};

const CartProductCard = ({ product, onUpdate, onRemove }: Props) => {
  const [quantity, setQuantity] = useState(product.quantity);

  useEffect(() => {
    setQuantity(product.quantity);
  }, [product.quantity]);

  const increase = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onUpdate(product, newQty);
  };

  const decrease = () => {
    if (quantity <= 1) return;
    const newQty = quantity - 1;
    setQuantity(newQty);
    onUpdate(product, newQty);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1) {
      setQuantity(val);
      onUpdate(product, val);
    }
  };

  return (
    <div className={style.item}>
      <img src={product.imageURL} alt={product.name} />
      <div className={style.itemInfo}>
        <div className={style.cartItemText}>
          <span className={style.titleDeleteContainer}>
            <h2>{product.name}</h2>
            <div
              className={style.deleteIcon}
              onClick={() => onRemove(product)}
            ></div>
          </span>
          {product.discountPrice ? <p className={style.discount}>kr {product.price}</p> : <p>kr {product.price}</p>}
          {product.discountPrice ? <p>kr {product.discountPrice.toFixed(2)}</p> : ""}
        </div>
        <div className={style.cartItemInteraction}>
          <div className={style.amountSelection}>
            <p onClick={decrease}>−</p>
            <input type="number" value={quantity} min={1} onChange={onChange} />
            <p onClick={increase}>+</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProductCard;