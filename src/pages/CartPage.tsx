import { useContext, useEffect, useState } from "react";
import style from "./CartPage.module.css";
import { CartItem, CartItemMinimal } from "../App";
import CartProductCard from "../components/CartProductCard/CartProductCard";
import NavigationButton from "../components/utils/Button/NavigationButton";
import ShippingForm from "../components/ShippingForm/ShippingForm";
import { shippingData } from "../@types/Database";
import { useNavigate } from "react-router";
import { useCustomProducts } from "../API/useCustomProducts";
import { handleCheckout as handleCheckoutFn } from "../API/checkout";
import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../components/PaymentForm/PaymentForm";
import { APIResult, CartContext } from "../context/siteContexts";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

function CartPage() {
  const { state: cartState, dispatch } = useContext(CartContext);
  const { allProducts } = useContext(APIResult);
  const navigate = useNavigate();

  const [enrichedCart, setEnrichedCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [verifiedTotal, setVerifiedTotal] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [shippingData, setShippingData] = useState<Partial<shippingData>>({});
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const shippingCost = 59;

  const {
    customProducts,
    isLoading: isLoadingCustoms,
    fetchCustomProducts,
  } = useCustomProducts();

  // Scroll to top on mount
  useEffect(() => window.scrollTo(0, 0), []);

  // Fetch custom products if any
  useEffect(() => {
    const customIds = cartState.productList
      .filter((item) => !allProducts?.some((p) => p.id === item.id))
      .map((item) => item.id);

    if (customIds.length > 0) fetchCustomProducts(customIds);
  }, [cartState.productList, allProducts, customProducts, fetchCustomProducts]);

  // Enrich cart with product info and calculate totals
  useEffect(() => {
    if (!allProducts || customProducts === undefined) return;

    const enriched = cartState.productList.map((cartItem: CartItemMinimal) => {
      const product = allProducts.find((p) => p.id === cartItem.id);
      if (product) {
        const price = Number(product.price);
        return {
          id: product.id,
          name: product.name,
          price,
          discountPrice: product.discount_amount
            ? Number(product.discount_amount)
            : null,
          imageURL: product.image_url,
          quantity: cartItem.quantity,
          short_description: product.short_description,
        } as CartItem;
      }

      if (customProducts) {
        const custom = customProducts.find((p) => p.id === cartItem.id);
        if (!custom) return null;

        return {
          id: custom.id,
          name: "Lag Din Egen",
          price: custom.calculated_price,
          discountPrice: null,
          imageURL: "/images/image_placeholder.webp",
          quantity: cartItem.quantity,
          metadata: custom.configuration,
          expires_at: custom.expires_at,
        } as CartItem;
      }

      return null;
    });

    const validItems = enriched.filter(
      (item): item is CartItem => item !== null,
    );

    const afterDiscount = validItems.reduce((sum, item) => {
      const discount = item.discountPrice ?? 0;
      return sum + (discount === 0 ? item.price : discount) * item.quantity;
    }, 0);

    const discountSum = validItems.reduce((sum, item) => {
      const discount = item.discountPrice ?? 0;
      return (
        sum + (discount !== 0 ? (item.price - discount) * item.quantity : 0)
      );
    }, 0);

    setEnrichedCart(validItems);
    setTotalPrice(afterDiscount);
    setTotalDiscount(discountSum);
    setVerifiedTotal(afterDiscount);
  }, [cartState, allProducts, customProducts]);

  // Function to create PaymentIntent when shipping data is submitted
  const createPaymentIntent = async (shipping: Partial<shippingData>) => {
    if (enrichedCart.length === 0) return;

    const totalOere = Math.round(
      enrichedCart.reduce((sum, item) => {
        const price = item.discountPrice ?? item.price;
        return sum + price * item.quantity;
      }, 0) * 100,
    );

    try {
      const res = await fetch("/.netlify/functions/createPaymentIntent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalOere + shippingCost * 100,
          cart: enrichedCart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
          clientPlatform: "web",
          firstName: shipping.firstName ?? "",
          lastName: shipping.lastName ?? "",
          email: shipping.email ?? "",
          phone: shipping.phone ?? "",
          adress: shipping.adress ?? "",
          place: shipping.place ?? "",
          postNr: shipping.postNr ?? "",
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setClientSecret(data.clientSecret);
    } catch (err) {
      console.error("Failed to create PaymentIntent:", err);
    }
  };

  // Checkout wrapper for ShippingForm
  const handleCheckout = async (
    stripe: Stripe | null,
    elements: StripeElements | null,
  ) => {
    await handleCheckoutFn({
      enrichedCart,
      setEnrichedCart,
      dispatch,
      shippingData,
      setIsProcessing,
      navigate,
      stripe,
      elements,
    });
  };

  if (isLoadingCustoms) {
    return (
      <main className={style.cartPageContainer}>
        <h1>Laster handlekurv...</h1>
      </main>
    );
  }

  if (enrichedCart.length === 0) {
    return (
      <>
        <title>Tom Handlekurv | Line Trises Kunstsmykker</title>
        <meta name="description" content="Handlekurven din er visst tom" />
        <main className={style.cartPageContainer}>
          <h1 className={style.cartHeader}>Handlekurv</h1>
          <section className={style.contentContainer}>
            <article className={style.cartItemList}></article>
            <div className={style.cartPaymentInfo}>
              <article className={style.cartInfo}>
                <h2>Oppsummering</h2>
                <p className={style.emptyMessage}>Her var det visst tomt!</p>
                <NavigationButton
                  text="Utforsk"
                  path="/produkter"
                  buttonWidth={100}
                />
              </article>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <main className={style.cartPageContainer}>
      <h1 className={style.cartHeader}>Handlekurv</h1>
      <section className={style.contentContainer}>
        <article className={style.cartItemList}>
          {enrichedCart.map((product) => (
            <CartProductCard
              key={product.id}
              product={product}
              onUpdate={(p, quantity) =>
                dispatch({
                  type: "updateProduct",
                  payload: { id: p.id, quantity },
                })
              }
              onRemove={(p) =>
                dispatch({
                  type: "updateProduct",
                  payload: { id: p.id, quantity: 0 },
                })
              }
            />
          ))}
        </article>

        <div className={style.cartPaymentContainer}>
          <div className={style.cartPaymentInfo}>
            <article className={style.cartInfo}>
              <h2>Oppsummering</h2>

              <div className={style.cartInfoBody}>
                <div className={style.cartInfoRow}>
                  <p>Delsum:</p>
                  <p>kr {totalPrice.toFixed(2)}</p>
                </div>

                {totalDiscount > 0 && (
                  <div className={`${style.cartInfoRow} ${style.discount}`}>
                    <p>Rabatt:</p>
                    <p>-kr {totalDiscount.toFixed(2)}</p>
                  </div>
                )}

                <div className={style.cartInfoRow}>
                  <p>Frakt:</p>
                  <p>
                    {shippingCost !== 59
                      ? "Gratis"
                      : `kr ${shippingCost.toFixed(2)}`}
                  </p>
                </div>
              </div>

              <div className={`${style.cartInfoRow} ${style.totalRow}`}>
                <p>Totalt:</p>
                <p>
                  kr{" "}
                  {(verifiedTotal !== null
                    ? verifiedTotal + shippingCost
                    : totalPrice + shippingCost
                  ).toFixed(2)}
                </p>
              </div>
            </article>
          </div>

          {!clientSecret ? (
            <ShippingForm
              onShippingSubmit={() => createPaymentIntent(shippingData)}
              setShippingInfo={setShippingData}
              disabled={isProcessing}
              initialData={shippingData}
            />
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm
                enrichedCart={enrichedCart}
                shippingData={shippingData}
                handleCheckout={handleCheckout}
                disabled={isProcessing}
                clientSecret={clientSecret}
                onEditShipping={() => setClientSecret(null)}
              />
            </Elements>
          )}
        </div>
      </section>
    </main>
  );
}

export default CartPage;
