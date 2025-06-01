import { Link, useParams } from "react-router";
import style from "./ProductPage.module.css"
import { getSingleProduct } from "../API/getSingleProduct";
import NavigationButton from "../components/utils/Button/NavigationButton";

function ProductPage() {
  let {id} = useParams();
  const {product, isLoading, isError} = getSingleProduct(Number(id));

  if(isLoading) {
    <main className={style.productPageContainer}>
      <Link to="/browse" className={style.backButtonContainer}>
          <div className={style.backArrow}></div>
          <p className={style.backText}>Tilbake</p>
      </Link>
      <h1>Loading...</h1>
    </main>
  }

  if(isError) {
    <main className={style.productPageContainer}>
      <Link to="/browse" className={style.backButtonContainer}>
          <div className={style.backArrow}></div>
          <p className={style.backText}>Tilbake</p>
      </Link>
      <h1>Something went wrong!</h1>
    </main>
  }

  if(product) {
      return(
      <main className={style.productPageContainer}>
        <Link to="/browse" className={style.backButtonContainer}>
          <div className={style.backArrow}></div>
          <p className={style.backText}>Tilbake</p>
        </Link>
        <section className={style.productContainer}>
          <img src={product[0].image_url} alt="Product Image" className={style.productImage}/>
          <article className={style.productInfo}>
            <h1 className={style.productHeader}>{product[0].name}</h1>
            <div className={style.priceContainer}>
              <p className={`${style.productPrice} ${product[0].discount? style.discounted : ""}`}>kr {product[0].price}</p>
              {product[0].discount? <p className={style.discountedPrice}>kr {product[0].discount_amount}</p> : ""}
            </div>
            <div className={style.colorContainer}>
              <p>Farge</p>
              <ul className={style.selectionList}>
                <li className={style.gold}></li>
                <li className={style.silver}></li>
              </ul>
              <p>Gull</p>
            </div>
            <div className={style.sizeContainer}>
              <p>Str</p>
              <ul className={style.selectionList}>
                <li className={style.small}>S</li>
                <li className={style.medium}>M</li>
              </ul>
              <p>Small</p>
            </div>
            <NavigationButton text="Legg i Handlekurv" path="#" buttonWidth={100}/>
          </article>
        </section>
        <section className={style.descriptionContainer}>
          <ul>
            <li>Beskrivelse</li>
            <li>Detaljer</li>
            <li>Omtaler</li>
          </ul>
          <span className={style.descriptionDivider}></span>
          <p>{product[0].long_description}</p>
        </section>
      </main>
    )
  }
}

export default ProductPage;