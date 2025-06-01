import { Link } from "react-router";
import NavigationButton from "../utils/Button/NavigationButton";
import style from "./ProductCard.module.css"

interface ProductCardProps {
  imageURL : string,
  name: string,
  price: number,
  discount: boolean,
  discountPrice: number | null,
  id: number
}

function ProductCard({imageURL, name, price, discount, discountPrice, id} : ProductCardProps) {
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
            <NavigationButton text="Se mer" path={`/produkt/${id}`} buttonWidth={100}/>
            <NavigationButton text="+" path="#" buttonWidth={30}/>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default ProductCard;