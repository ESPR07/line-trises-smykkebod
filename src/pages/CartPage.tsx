import { useContext, useEffect, useState } from "react";
import VippsButton from "../components/VippsButton/VippsButton";
import style from "./CartPage.module.css";
import { Cart, CartContext } from "../App";
import { initialValue } from "../Reducers/cartInteractions";
import CartProductCard from "../components/CartProductCard/CartProductCard";
import NavigationButton from "../components/utils/Button/NavigationButton";

function CartPage() {
  const [currentCart, setCurrentCart] = useState<Cart>(initialValue);
  const { state, dispatch } = useContext(CartContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setCurrentCart(state);
  }, [state]);

  if (currentCart.productList.length <= 0) {
    return (
      <main className={style.cartPageContainer}>
        <h1 className={style.cartHeader}>Handlekurv</h1>
        <section className={style.contentContainer}>
          <article className={style.cartItemList}></article>
          <div className={style.cartPaymentInfo}>
            <article className={style.cartInfo}>
              <h2>Oppsummering</h2>
              <p className={style.emptyMessage}>Her var det visst tomt!</p>
              <NavigationButton text="Utforsk" path="/browse" buttonWidth={100}/>
            </article>
            <VippsButton />
            <button className={style.kortBetaling}>
              Kortbetaling <span className={style.cardIcons}></span>
            </button>
          </div>
        </section>
      </main>
    );
  }

   return (
    <main className={style.cartPageContainer}>
      <h1 className={style.cartHeader}>Handlekurv</h1>
      <section className={style.contentContainer}>
        <article className={style.cartItemList}>
          {currentCart.productList.map((product) => {
            return (
              <CartProductCard
                key={product.id}
                product={product}
                onUpdate={(product, quantity) => {
                  dispatch({
                    type: "updateProduct",
                    payload: { ...product, quantity },
                  });
                }}
                onRemove={(product) => {
                  dispatch({
                    type: "updateProduct",
                    payload: { ...product, quantity: 0 },
                  });
                }}
              />
            );
          })}
        </article>
        <div className={style.cartPaymentInfo}>
          <article className={style.cartInfo}>
            <h2>Oppsummering</h2>
            <div className={style.cartInfoRow}>
              <p>Totalt:</p>
              <p>kr {currentCart.totalPrice.toFixed(2)}</p>
            </div>
          </article>
          <VippsButton />
          <button className={style.kortBetaling}>
            Kortbetaling <span className={style.cardIcons}></span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default CartPage;
