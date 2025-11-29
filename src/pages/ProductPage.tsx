import { Link, useParams } from "react-router";
import style from "./ProductPage.module.css";
import { getSingleProduct } from "../API/getSingleProduct";
import EventButton from "../components/utils/EventButton/EventButton";
import { useContext } from "react";
import { CartContext } from "../App";

type AddToCart = {
  id: number;
  name: string;
  discountPrice: number | null;
  price: number;
  imageURL: string;
};

function ProductPage() {
  let { id } = useParams();
  const { product, isLoading, isError } = getSingleProduct(Number(id));
  const dispatch = useContext(CartContext).dispatch;

  const handleAddToCart = ({
    id,
  }: AddToCart) => {
    dispatch({
      type: "addToCart",
      payload: { id, quantity: 1 },
    });
  };

  const singleProduct = product?.[0];
  if (!singleProduct) return null;

  if (isLoading) {
    return (
      <main className={style.productPageContainer}>
        <Link to="/browse" className={style.backButtonContainer}>
          <div className={style.backArrow}></div>
          <p className={style.backText}>Tilbake</p>
        </Link>
        <h1>Loading...</h1>
      </main>
    );
  }

  if (isError) {
    return (
      <main className={style.productPageContainer}>
        <Link to="/browse" className={style.backButtonContainer}>
          <div className={style.backArrow}></div>
          <p className={style.backText}>Tilbake</p>
        </Link>
        <h1>Something went wrong!</h1>
      </main>
    );
  }

  if (product) {
    return (
      <main className={style.productPageContainer}>
        <Link to="/browse" className={style.backButtonContainer}>
          <div className={style.backArrow}></div>
          <p className={style.backText}>Tilbake</p>
        </Link>
        <h1 className={style.productHeader}>{singleProduct.name}</h1>
        <section className={style.productContainer}>
          <article className={style.imageContainer}>
            <img
              src={singleProduct.image_url}
              alt="Product Image"
              className={style.productImage}
            />
          </article>
          <article className={style.productText}>
            <div className={style.priceContainer}>
              <p
                className={`${style.productPrice} ${
                  singleProduct.discount ? style.discounted : ""
                }`}
              >
                kr {singleProduct.price}
              </p>
              {singleProduct.discount ? (
                <p className={style.discountedPrice}>
                  kr {singleProduct.discount_amount}
                </p>
              ) : (
                ""
              )}
            </div>
            <section className={style.descriptionContainer}>
              <ul>
                <li>Beskrivelse</li>
              </ul>
              <p>{singleProduct.long_description}</p>
            </section>
            <EventButton
              text="Legg til i Handlekurv"
              event={() => {
                handleAddToCart({
                  id: singleProduct.id,
                  name: singleProduct.name,
                  discountPrice: singleProduct.discount_amount,
                  price: singleProduct.price,
                  imageURL: singleProduct.image_url,
                });
              }}
              buttonWidth={100}
            />
          </article>
        </section>
      </main>
    );
  }
}

export default ProductPage;
