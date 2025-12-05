import { Link, useParams } from "react-router";
import style from "./ProductPage.module.css";
import { useSingleProduct } from "../API/useSingleProduct";
import EventButton from "../components/utils/EventButton/EventButton";
import { useContext } from "react";
import { CartContext } from "../App";

type AddToCart = {
  id: string;
  name: string;
  discountPrice: number | null;
  price: number;
  imageURL: string;
};

function ProductPage() {
  const { id } = useParams() as { id: string };
  const { product, isLoading, isError } = useSingleProduct(id);
  const dispatch = useContext(CartContext).dispatch;

  const handleAddToCart = ({ id }: AddToCart) => {
    dispatch({
      type: "addToCart",
      payload: { id, quantity: 1 },
    });
  };

  if (!product) return null;

  if (isLoading) {
    return (
      <>
        <title>Laster... | Line Trises Smykkebod</title>
        <meta name="description" content="Laster inn produkt."/>
        <main className={style.productPageContainer}>
          <Link to="/browse" className={style.backButtonContainer}>
            <div className={style.backArrow}></div>
            <p className={style.backText}>Tilbake</p>
          </Link>
          <h1>Loading...</h1>
        </main>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <title>Fant ikke produkt | Line Trises Smykkebod</title>
        <meta name="description" content="Fant ikke produktet du leter etter"/>
        <main className={style.productPageContainer}>
          <Link to="/browse" className={style.backButtonContainer}>
            <div className={style.backArrow}></div>
            <p className={style.backText}>Tilbake</p>
          </Link>
          <h1>Something went wrong!</h1>
        </main>
      </>
    );
  }

  if (product) {
    return (
      <>
        <title>{`${product.name} - Håndlaget smykke | Line Trises Smykkebod`}</title>
        <meta name="description" content={`Kjøp ${product.name} - et unikt, håndlaget smykke fra Line Trises Smykkebod. Laget og designet for daglig bruk og spesielle anledninger.`}/>
        <main className={style.productPageContainer}>
          <Link to="/browse" className={style.backButtonContainer}>
            <div className={style.backArrow}></div>
            <p className={style.backText}>Tilbake</p>
          </Link>
          <h1 className={style.productHeader}>{product.name}</h1>
          <section className={style.productContainer}>
            <article className={style.imageContainer}>
              <img
                src={product.image_url}
                alt="Product Image"
                className={style.productImage}
              />
            </article>
            <article className={style.productText}>
              <div className={style.priceContainer}>
                <p
                  className={`${style.productPrice} ${
                    product.discount ? style.discounted : ""
                  }`}
                >
                  kr {product.price}
                </p>
                {product.discount ? (
                  <p className={style.discountedPrice}>
                    kr {product.discount_amount}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <section className={style.descriptionContainer}>
                <ul>
                  <li>Beskrivelse</li>
                </ul>
                <div className={style.textButtonWrapper}>
                  <p>{product.long_description}</p>
                  <EventButton
                    text="Legg til i Handlekurv"
                    event={() => {
                      handleAddToCart({
                        id: product.id,
                        name: product.name,
                        discountPrice: product.discount_amount,
                        price: product.price,
                        imageURL: product.image_url || "",
                      });
                    }}
                    buttonWidth={100}
                  />
                </div>
              </section>
            </article>
          </section>
        </main>
      </>
    );
  }
}

export default ProductPage;
