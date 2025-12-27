import { useContext, useEffect, useState } from "react";
import style from "./CartPage.module.css";
import { CartContext, CartItem, CartItemMinimal, APIResult } from "../App";
import CartProductCard from "../components/CartProductCard/CartProductCard";
import NavigationButton from "../components/utils/Button/NavigationButton";
import { handleCheckout as checkout } from "../API/checkout";
import ShippingForm from "../components/utils/ShippingForm/ShippingForm";
import { shippingData } from "../@types/Database";
import { useCreateOrder } from "../API/usePlaceOrder";
import { useNavigate } from "react-router";

function CartPage() {
  const { state: cartState, dispatch } = useContext(CartContext);
  const { allProducts } = useContext(APIResult);
  const { createOrder } = useCreateOrder();
  const navigate = useNavigate();

  const [enrichedCart, setEnrichedCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [verifiedTotal, setVerifiedTotal] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [shippingData, setShippingData] = useState<Partial<shippingData>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Enrich minimal cart and calculate pricing
  useEffect(() => {
    if (!allProducts) return;

    const enriched = cartState.productList.map((cartItem: CartItemMinimal) => {
  const product = allProducts.find((product) => product.id === cartItem.id);

  if (!product) {
    // If it’s a custom product, return it directly
    if (cartItem.metadata) {
      return {
        id: cartItem.id,
        name: cartItem.name ?? "Custom product",
        price: cartItem.price ?? 0,
        discountPrice: null,
        imageURL: "/src/assets/images/image_placeholder.webp", // Optionally provide a placeholder or preview image
        quantity: cartItem.quantity,
        metadata: cartItem.metadata, // Keep selections for display
        isCustom: true, // Flag for the CartProductCard if needed
      } as CartItem;
    }

    console.warn("Product missing from API:", cartItem.id);
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    discountPrice:
      product.discount_amount !== null
        ? Number(product.discount_amount)
        : null,
    imageURL: product.image_url,
    quantity: cartItem.quantity,
  } as CartItem;
});


    const validItems = enriched.filter(
      (product): product is CartItem => product !== null
    );

    const calculatedAfterDiscount = validItems.reduce((sum, item) => {
      const discount = item.discountPrice ?? 0;
      return sum + (discount === 0 ? item.price : discount) * item.quantity;
    }, 0);

    const calculatedDiscount = validItems.reduce((sum, item) => {
      const discount = item.discountPrice ?? 0;
      return (
        sum + (discount !== 0 ? (item.price - discount) * item.quantity : 0)
      );
    }, 0);

    setEnrichedCart(validItems);
    setTotalPrice(calculatedAfterDiscount);
    setTotalDiscount(calculatedDiscount);
  }, [cartState, allProducts]);

  const handleCheckoutWrapper = () =>
  checkout({
    enrichedCart,
    setEnrichedCart,
    dispatch,
    shippingData,
    createOrder,
    setVerifiedTotal,
    setIsProcessing,
    navigate,
  });

  if (enrichedCart.length === 0) {
    return (
      <>
        <title>Tom Handlekurv | Line Trises Smykkebod</title>
        <meta name="description" content="Handlekurven din er visst tom"/>
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
                  path="/browse"
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
    <>
      <title>Handlekurv | Line Trises Smykkebod</title>
      <meta name="description" content="Se varene dine og fullfør kjøpet av håndlagde smykker hos Line Trises Smykkebod."/>
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
          <div className={style.cartPaymentInfo}>
            <article className={style.cartInfo}>
              <h2>Oppsummering</h2>
              <div className={style.cartInfoRow}>
                <p>Rabatter:</p>
                <p>kr {totalDiscount.toFixed(2)}</p>
              </div>
              <div className={style.cartInfoRow}>
                <p>Totalt:</p>
                <p>
                  kr{" "}
                  {verifiedTotal !== null
                    ? verifiedTotal.toFixed(2)
                    : totalPrice.toFixed(2)}
                </p>
              </div>
            </article>
            <ShippingForm
              handleCheckout={handleCheckoutWrapper}
              disabled={isProcessing}
              setShippingInfo={setShippingData}
            />
          </div>
        </section>
      </main>
    </>
  );
}

export default CartPage;
