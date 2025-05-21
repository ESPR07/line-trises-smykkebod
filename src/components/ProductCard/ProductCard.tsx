import NavigationButton from "../utils/Button/NavigationButton";
import style from "./ProductCard.module.css"

function ProductCard() {
  return(
    <article className={style.productCardContainer}>
      <img src="/src/assets/pexels-gdtography-277628-6563393.jpg" alt="product" className={style.productImage}/>
      <div className={style.productInfoContainer}>
        <div className={style.headers}>
          <h1>Smykke Smykkis</h1>
          <h2>kr 399</h2>
        </div>
        <div className={style.colors}>
          <p>Farger:</p>
          <ul className={style.colorSelection}>
            <li></li>
            <li></li>
          </ul>
        </div>
        <div className={style.productInteraction}>
          <NavigationButton text="Se mer" path="#" buttonWidth={100}/>
          <NavigationButton text="+" path="#" buttonWidth={30}/>
        </div>
      </div>
    </article>
  )
}

export default ProductCard;