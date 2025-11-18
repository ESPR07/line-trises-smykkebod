import { useContext, useEffect, useState } from "react";
import VippsButton from "../components/VippsButton/VippsButton";
import style from "./CartPage.module.css";
import { Cart, CartContext } from "../App";
import { initialValue } from "../Reducers/cartInteractions";
import CartProductCard from "../components/CartProductCard/CartProductCard";
import NavigationButton from "../components/utils/Button/NavigationButton";
import { verifyCart } from "../API/verifyCart";

function CartPage() {
  const [currentCart, setCurrentCart] = useState<Cart>(initialValue);
  const { state, dispatch } = useContext(CartContext);
  const [combinedDiscount, setCombinedDiscount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifiedTotal, setVerifiedTotal] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setCurrentCart(state);
  }, [state]);

  useEffect(() => {
    const totalDiscount = currentCart.productList.reduce(
      (sum, product) => sum + (product.discountPrice ?? 0) * product.quantity,
      0
    );
    setCombinedDiscount(totalDiscount);
  }, [currentCart]);

  const handleCheckout = async () => {
    if (currentCart.productList.length === 0) return;
    setIsProcessing(true);

    try {
      const data = await verifyCart(currentCart.productList);
      const total = data.total;
      setVerifiedTotal(total);

      // Proceed to payment with server-verified total
      console.log("Proceeding to payment with verified total:", total);
      // Example: pass `total` to your VippsButton
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Something went wrong during checkout. Please try again.");
      localStorage.setItem("cart", "")
    } finally {
      setIsProcessing(false);
    }
  };

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
              <NavigationButton text="Utforsk" path="/browse" buttonWidth={100} />
            </article>
            <VippsButton />
            <button
              className={style.kortBetaling}
              onClick={handleCheckout}
              disabled={isProcessing}
            >
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
          {currentCart.productList.map((product) => (
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
          ))}
        </article>
        <div className={style.cartPaymentInfo}>
          <article className={style.cartInfo}>
            <h2>Oppsummering</h2>
            <div className={style.cartInfoRow}>
              <p>Rabatter:</p>
              <p>kr {combinedDiscount}</p>
            </div>
            <div className={style.cartInfoRow}>
              <p>Totalt:</p>
              <p>
                kr{" "}
                {verifiedTotal !== null
                  ? verifiedTotal.toFixed(2)
                  : currentCart.totalPrice.toFixed(2)}
              </p>
            </div>
          </article>
          <VippsButton/>
          <button
            className={style.kortBetaling}
            onClick={handleCheckout}
            disabled={isProcessing}
          >
            Kortbetaling <span className={style.cardIcons}></span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default CartPage;
