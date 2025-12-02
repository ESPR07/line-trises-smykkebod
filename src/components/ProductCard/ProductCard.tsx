import { Link } from "react-router";
import style from "./ProductCard.module.css";
import EventButton from "../utils/EventButton/EventButton";
import { useContext } from "react";
import { CartContext } from "../../App";

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

  const handleAddToCart = ({
    id,
  }: AddToCart) => {
    dispatch({
      type: "addToCart",
      payload: { id, quantity: 1 },
    });
  };

  return (
    <Link to={`/produkt/${id}`}>
      <article className={style.productCardContainer}>
        <EventButton
          text="+"
          event={() => {
            handleAddToCart({ id, name, discountPrice, price, imageURL });
          }}
          buttonWidth={20}
        />
        <img src={imageURL} alt="product" className={style.productImage} />
        <div className={style.productInfoContainer}>
          <div className={style.headers}>
            <h1>{name}</h1>
            <div className={style.priceContainer}>
              <h2 className={discount ? style.discounted : ""}>kr {price}</h2>
              {discount ? <h3>kr {discountPrice}</h3> : ""}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;
