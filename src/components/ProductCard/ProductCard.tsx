import { Link } from "react-router";
import NavigationButton from "../utils/Button/NavigationButton";
import style from "./ProductCard.module.css"
import EventButton from "../utils/EventButton/EventButton";
import { useContext } from "react";
import { CartContext } from "../../App";

interface ProductCardProps {
  imageURL : string,
  name: string,
  price: number,
  discount: boolean,
  discountPrice: number | null,
  id: number
}

type AddToCart = {
  id: number,
  name: string,
  discountPrice: number | null,
  price: number,
  imageURL: string,
}

function ProductCard({imageURL, name, price, discount, discountPrice, id} : ProductCardProps) {
  const dispatch = useContext(CartContext).dispatch;

   const handleAddToCart = ({id, name, discountPrice, price, imageURL}: AddToCart) => {
    dispatch({type: "addToCart", payload: { id, name, discountPrice, price, imageURL, quantity: 1 }});
  }

  return(
    <Link to={`/produkt/${id}`}>
      <article className={style.productCardContainer}>
        <img src={imageURL} alt="product" className={style.productImage}/>
        <div className={style.productInfoContainer}>
          <div className={style.headers}>
            <h1>{name}</h1>
            <h2 className={discount? style.discounted : ""}>kr {price}</h2>
            {discount? <h3>kr {discountPrice}</h3> : ""}
          </div>
          <div className={style.colors}>
            <p>Farger:</p>
            <ul className={style.colorSelection}>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className={style.productInteraction}>
            <NavigationButton text="Se Mer" path="browse" buttonWidth={100}/>
            <EventButton text="+" event={() => {handleAddToCart({id, name, discountPrice, price, imageURL})}} buttonWidth={30}/>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default ProductCard;